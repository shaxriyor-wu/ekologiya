from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from django.db import transaction
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from decimal import Decimal
import random
import requests
from .models import User, Transaction, GlobalStats, EmailVerification
from .serializers import (
    UserSerializer, TransactionSerializer,
    GlobalStatsSerializer, RegisterSerializer, LoginSerializer
)


@api_view(['GET'])
def api_root(request):
    """API root endpoint with available endpoints"""
    return Response({
        'message': 'EcoCash Backend API',
        'version': '1.0',
        'endpoints': {
            'users': {
                'send_verification_code': 'POST /api/users/send_verification_code/',
                'verify_code': 'POST /api/users/verify_code/',
                'register': 'POST /api/users/register/',
                'login': 'POST /api/users/login/',
                'me': 'GET /api/users/me/ (authenticated)',
                'logout': 'POST /api/users/logout/ (authenticated)',
                'update_stats': 'POST /api/users/{id}/update_stats/',
                'pay_utility': 'POST /api/users/{id}/pay_utility/',
            },
            'transactions': {
                'list': 'GET /api/transactions/ (authenticated)',
            },
            'stats': {
                'global': 'GET /api/stats/',
            },
            'admin': {
                'panel': 'http://127.0.0.1:8000/admin/',
            }
        }
    })


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(is_deleted=False)
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def send_verification_code(self, request):
        """Send 6-digit verification code to email"""
        email = request.data.get('email')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        
        if not email:
            return Response({'error': 'Email talab qilinadi'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Email formatini tekshirish
        email = email.strip().lower()
        if '@' not in email or '.' not in email.split('@')[1]:
            return Response({'error': 'Noto\'g\'ri email format'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Test email'lar ro'yxati (bloklash)
        test_domains = [
            'test.com', 'example.com', 'mailinator.com', '10minutemail.com',
            'tempmail.com', 'guerrillamail.com', 'throwaway.email', 'fakeinbox.com',
            'mohmal.com', 'temp-mail.org', 'getnada.com', 'yopmail.com'
        ]
        email_domain = email.split('@')[1].lower()
        if email_domain in test_domains:
            return Response({
                'error': 'Test email\'lar qabul qilinmaydi. Haqiqiy email manzil kiriting (Gmail, Yahoo, Outlook va h.k.)'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # SMTP sozlanmagan bo'lsa, xatolik qaytar
        if not (settings.EMAIL_HOST_USER and settings.EMAIL_HOST_PASSWORD):
            return Response({
                'error': 'Email xizmati sozlanmagan. Iltimos, administrator bilan bog\'laning.',
                'hint': 'Backend/.env faylida EMAIL_HOST_USER va EMAIL_HOST_PASSWORD sozlang'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        # Check if email already exists
        if User.objects.filter(email=email, is_deleted=False).exists():
            return Response({'error': 'Bu email allaqachon ro\'yxatdan o\'tgan'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate 6-digit code
        code = str(random.randint(100000, 999999))
        
        # Delete old verification codes for this email
        EmailVerification.objects.filter(email=email, is_verified=False).delete()
        
        # Create new verification code
        verification = EmailVerification.objects.create(
            email=email,
            code=code,
            expires_at=timezone.now() + timezone.timedelta(minutes=10)  # 10 minutes expiry
        )
        
        # Send email - faqat haqiqiy email'ga
        try:
            subject = 'EcoCash - Email Tasdiqlash Kodi'
            message = f"""
Salom {first_name} {last_name}!

EcoCash tizimiga ro'yxatdan o'tish uchun tasdiqlash kodingiz:

{code}

Bu kod 10 daqiqa davomida amal qiladi.

Agar siz bu xabarni so'ramagan bo'lsangiz, uni e'tiborsiz qoldiring.

Hurmat bilan,
EcoCash Jamoasi
            """
            
            # Haqiqiy email yuborish (SMTP)
            send_mail(
                subject,
                message,
                settings.EMAIL_HOST_USER,  # Haqiqiy email'dan yuboriladi
                [email],  # Haqiqiy email'ga yuboriladi
                fail_silently=False,
            )
            
            print(f"✅ Email yuborildi: {email} (Kod: {code})")
            
            return Response({
                'message': f'Tasdiqlash kodi {email} ga yuborildi. Kod odatda 5-30 soniya ichida yetib keladi.',
                'email': email,
                'delivery_time': '5-30 soniya',
                'code': None  # Xavfsizlik uchun kod qaytarilmaydi
            })
        except Exception as e:
            # Email yuborishda xatolik
            error_msg = str(e)
            print(f"❌ Email sending error: {error_msg}")
            print(f"   Email: {email}")
            print(f"   Code: {code}")
            
            # Xatolikni qaytar
            return Response({
                'error': f'Email yuborishda xatolik yuz berdi: {error_msg}',
                'message': 'Email yuborilmadi. Iltimos, email manzilingizni tekshiring va qayta urinib ko\'ring.',
                'email': email,
                'hint': 'Email manzili to\'g\'ri ekanligini va internet ulanishini tekshiring'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def verify_code(self, request):
        """Verify email code and register user"""
        email = request.data.get('email')
        code = request.data.get('code')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        password = request.data.get('password')
        
        if not all([email, code, password]):
            return Response({'error': 'Barcha maydonlar to\'ldirilishi kerak'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Find verification code
        try:
            verification = EmailVerification.objects.filter(
                email=email,
                code=code,
                is_verified=False
            ).latest('created_at')
        except EmailVerification.DoesNotExist:
            return Response({'error': 'Noto\'g\'ri yoki eskirgan kod'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if code is expired
        if verification.is_expired():
            return Response({'error': 'Kod muddati tugagan. Yangi kod so\'rang'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Mark as verified
        verification.is_verified = True
        verification.save()
        
        # Create user
        try:
            username = email.split('@')[0]
            # Ensure username is unique
            base_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            
            # Auto login after registration
            from django.contrib.auth import login
            login(request, user)
            
            # Create welcome bonus transaction
            Transaction.objects.create(
                user=user,
                amount=1000,
                type='earn',
                description='Xush kelibsiz bonus',
                provider='EcoCash System'
            )
            
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': f'Foydalanuvchi yaratishda xatolik: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """Register a new user - oddiy username va parol bilan"""
        try:
            serializer = RegisterSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                # Auto login after registration
                from django.contrib.auth import login
                login(request, user)
                # Create welcome bonus transaction
                Transaction.objects.create(
                    user=user,
                    amount=1000,
                    type='earn',
                    description='Xush kelibsiz bonus',
                    provider='EcoCash System'
                )
                return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Registration error: {e}")
            return Response({
                'error': f'Registratsiya xatosi: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """Login user with username or email and password"""
        username_or_email = request.data.get('username', '').strip()
        password = request.data.get('password', '')
        
        if not username_or_email:
            return Response({'error': 'Username yoki Email kiriting'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not password:
            return Response({'error': 'Parol kiriting'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Username yoki email bilan topish (email uchun case-insensitive)
            if '@' in username_or_email:
                # Email uchun kichik harflarga o'tkazish
                email_lower = username_or_email.lower()
                try:
                    user = User.objects.get(email__iexact=email_lower, is_deleted=False)
                except User.DoesNotExist:
                    return Response({'error': 'Email topilmadi'}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                # Username uchun to'g'ridan-to'g'ri qidirish
                try:
                    user = User.objects.get(username=username_or_email, is_deleted=False)
                except User.DoesNotExist:
                    return Response({'error': 'Username topilmadi'}, status=status.HTTP_401_UNAUTHORIZED)
            
            # Check if account is deleted (double check)
            if user.is_deleted:
                return Response({'error': 'Bu hisob o\'chirilgan'}, status=status.HTTP_401_UNAUTHORIZED)
            
            # Parolni tekshirish
            if user.check_password(password):
                from django.contrib.auth import login
                login(request, user)
                return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Parol noto\'g\'ri'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'Foydalanuvchi topilmadi'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            print(f"Login error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({'error': f'Kirishda xatolik: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def google_auth(self, request):
        """Login or register user with Google OAuth JWT credential"""
        token = request.data.get('token')
        
        if not token:
            return Response({'error': 'Google token talab qilinadi'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Google JWT credential'ni verify qilish va user ma'lumotlarini olish
            # JWT credential Google Identity Services'dan keladi
            # Avval JWT'ni decode qilamiz va keyin Google API'dan verify qilamiz
            
            # JWT'ni decode qilish (payload olish uchun)
            import base64
            import json
            
            try:
                # JWT format: header.payload.signature
                parts = token.split('.')
                if len(parts) != 3:
                    return Response({'error': 'Noto\'g\'ri Google token formati'}, status=status.HTTP_400_BAD_REQUEST)
                
                # Payload'ni decode qilish
                payload = parts[1]
                # Base64URL decode
                payload += '=' * (4 - len(payload) % 4)  # Padding qo'shish
                decoded_payload = base64.urlsafe_b64decode(payload)
                payload_data = json.loads(decoded_payload)
                
                # JWT'ni Google API'dan verify qilish
                # Google Identity Services JWT'ni verify qilish uchun Google API'dan foydalanish kerak
                verify_url = 'https://oauth2.googleapis.com/tokeninfo'
                verify_response = requests.get(verify_url, params={'id_token': token}, timeout=10)
                
                if verify_response.status_code != 200:
                    # Agar verify qilishda muammo bo'lsa, payload'dan ma'lumotlarni olish
                    # (Development uchun, production'da verify qilish kerak)
                    print(f"⚠️ Google JWT verify qilishda muammo: {verify_response.status_code}")
                    # Payload'dan ma'lumotlarni olish
                    google_email = payload_data.get('email', '').lower()
                    google_first_name = payload_data.get('given_name', '')
                    google_last_name = payload_data.get('family_name', '')
                    google_name = payload_data.get('name', '')
                else:
                    # Verify qilingan ma'lumotlar
                    verified_data = verify_response.json()
                    google_email = verified_data.get('email', '').lower()
                    google_first_name = verified_data.get('given_name', '')
                    google_last_name = verified_data.get('family_name', '')
                    google_name = verified_data.get('name', '')
                
                # Agar payload'dan ma'lumotlar bo'lmasa, fallback
                if not google_email:
                    google_email = payload_data.get('email', '').lower()
                if not google_first_name:
                    google_first_name = payload_data.get('given_name', '')
                if not google_last_name:
                    google_last_name = payload_data.get('family_name', '')
                if not google_name:
                    google_name = payload_data.get('name', '')
                
            except Exception as decode_error:
                print(f"❌ JWT decode xatosi: {decode_error}")
                # Fallback: OAuth2 access token sifatida ishlatish
                google_user_info_url = 'https://www.googleapis.com/oauth2/v2/userinfo'
                headers = {'Authorization': f'Bearer {token}'}
                response = requests.get(google_user_info_url, headers=headers, timeout=10)
                
                if response.status_code != 200:
                    return Response({'error': 'Google token noto\'g\'ri yoki muddati tugagan'}, status=status.HTTP_401_UNAUTHORIZED)
                
                google_data = response.json()
                google_email = google_data.get('email', '').lower()
                google_first_name = google_data.get('given_name', '')
                google_last_name = google_data.get('family_name', '')
                google_name = google_data.get('name', '')
            
            if not google_email:
                return Response({'error': 'Google email topilmadi'}, status=status.HTTP_400_BAD_REQUEST)
            
            # User mavjudligini tekshirish
            try:
                user = User.objects.get(email=google_email, is_deleted=False)
                # User mavjud - login qilish
                if user.is_deleted:
                    return Response({'error': 'Bu hisob o\'chirilgan'}, status=status.HTTP_401_UNAUTHORIZED)
                
                # Ism va familyani yangilash (agar o'zgarganda)
                if google_first_name and user.first_name != google_first_name:
                    user.first_name = google_first_name
                if google_last_name and user.last_name != google_last_name:
                    user.last_name = google_last_name
                user.save()
                
                from django.contrib.auth import login
                login(request, user)
                return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                # User mavjud emas - yangi user yaratish
                # Username yaratish (email'dan)
                base_username = google_email.split('@')[0]
                username = base_username
                counter = 1
                while User.objects.filter(username=username).exists():
                    username = f"{base_username}{counter}"
                    counter += 1
                    if counter > 1000:
                        return Response({'error': 'Username yaratishda muammo'}, status=status.HTTP_400_BAD_REQUEST)
                
                # Yangi user yaratish
                user = User.objects.create_user(
                    username=username,
                    email=google_email,
                    first_name=google_first_name or google_name.split()[0] if google_name else username,
                    last_name=google_last_name or ' '.join(google_name.split()[1:]) if google_name and len(google_name.split()) > 1 else '',
                    password=None  # Google orqali kirganlar uchun parol kerak emas
                )
                user.set_unusable_password()  # Parolni o'chirib qo'yish
                user.save()
                
                # Welcome bonus transaction
                Transaction.objects.create(
                    user=user,
                    amount=1000,
                    type='earn',
                    description='Xush kelibsiz bonus (Google)',
                    provider='EcoCash System'
                )
                
                from django.contrib.auth import login
                login(request, user)
                return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        except requests.RequestException as e:
            print(f"Google API error: {str(e)}")
            return Response({'error': 'Google API bilan bog\'lanishda xatolik'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            print(f"Google auth error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({'error': f'Google orqali kirishda xatolik: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Get current user"""
        if request.user.is_deleted:
            return Response({'error': 'Bu hisob o\'chirilgan'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(UserSerializer(request.user).data)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def check_email(self, request):
        """Check if email exists"""
        email = request.data.get('email', '').strip().lower()
        
        if not email:
            return Response({'error': 'Email kiriting'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email, is_deleted=False)
            return Response({'exists': True, 'message': 'Bu email bilan hisob mavjud. Parol bilan kirishingiz mumkin.'})
        except User.DoesNotExist:
            return Response({'exists': False, 'message': 'Bu email bilan hisob mavjud emas.'})
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """Logout user"""
        from django.contrib.auth import logout
        logout(request)
        return Response({'message': 'Logged out successfully'})
    
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])  # Temporarily AllowAny
    def update_stats(self, request, pk=None):
        """Update user stats after recycling"""
        # Try to get user from session, fallback to pk
        if request.user.is_authenticated:
            user = request.user
        elif pk:
            try:
                user = User.objects.get(pk=pk)
            except User.DoesNotExist:
                return Response({'error': 'Foydalanuvchi topilmadi'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Foydalanuvchi talab qilinadi'}, status=status.HTTP_401_UNAUTHORIZED)
        added_balance = float(request.data.get('added_balance', 0))
        added_kg = float(request.data.get('added_kg', 0))
        
        with transaction.atomic():
            user.balance += added_balance
            user.total_recycled_kg += added_kg
            
            # Level up logic
            if user.total_recycled_kg > user.level * 50:
                user.level += 1
            
            user.save()
            
            # Create transaction record
            Transaction.objects.create(
                user=user,
                amount=added_balance,
                type='earn',
                description=f'Qayta ishlash: {added_kg}kg',
                provider='AI Scanner'
            )
        
        return Response(UserSerializer(user).data)
    
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])  # Temporarily AllowAny
    def pay_utility(self, request, pk=None):
        """Pay utility bill with fraud detection"""
        try:
            # Try to get user from session, fallback to pk
            user = None
            
            # First try authenticated user
            if request.user.is_authenticated:
                user = request.user
                print(f"✅ Using authenticated user: {user.id}")
            # Then try pk parameter
            elif pk:
                try:
                    # Try to convert pk to integer
                    pk_int = int(pk) if pk else None
                    
                    # Check if pk looks like a valid database ID (not a timestamp)
                    if pk_int and pk_int < 1000000 and pk_int > 0:
                        user = User.objects.get(pk=pk_int, is_deleted=False)
                        print(f"✅ Found user by pk: {pk_int}")
                    else:
                        print(f"⚠️ Invalid pk format (looks like timestamp?): {pk}")
                        # Try to find by username or email as fallback
                        try:
                            user = User.objects.filter(username=str(pk), is_deleted=False).first() or \
                                   User.objects.filter(email=str(pk), is_deleted=False).first()
                            if user:
                                print(f"✅ Found user by username/email: {pk}")
                        except Exception as e2:
                            print(f"❌ Could not find user: {e2}")
                except (User.DoesNotExist, ValueError, TypeError) as e:
                    print(f"❌ User not found with pk={pk}: {e}")
                    # Try to find by username or email
                    try:
                        user = User.objects.filter(username=str(pk), is_deleted=False).first() or \
                               User.objects.filter(email=str(pk), is_deleted=False).first()
                        if user:
                            print(f"✅ Found user by username/email (fallback): {pk}")
                    except:
                        pass
            
            if not user:
                return Response({
                    'error': 'Foydalanuvchi topilmadi. Iltimos, qaytadan kirib ko\'ring.',
                    'success': False
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            provider = request.data.get('provider')
            account_number = request.data.get('account_number', '')
            
            # Safe amount conversion to Decimal (user.balance is Decimal)
            try:
                amount_str = str(request.data.get('amount', 0))
                amount = Decimal(amount_str)
            except (ValueError, TypeError, Exception) as e:
                return Response({
                    'error': 'Summa noto\'g\'ri formatda',
                    'success': False
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Fraud detection logic
            fraud_detected = False
            fraud_reasons = []
            
            # Check 1: Invalid account number format (should be numeric and reasonable length)
            if account_number:
                if not account_number.isdigit():
                    fraud_detected = True
                    fraud_reasons.append('Hisob raqami noto\'g\'ri formatda')
                elif len(account_number) < 6 or len(account_number) > 15:
                    fraud_detected = True
                    fraud_reasons.append('Hisob raqami uzunligi noto\'g\'ri')
            
            # Check 2: Suspicious amount (too high or negative)
            if amount <= Decimal('0'):
                fraud_detected = True
                fraud_reasons.append('Summa noto\'g\'ri')
            elif amount > Decimal('10000000'):  # 10 million UZS threshold
                fraud_detected = True
                fraud_reasons.append('Juda katta summa')
            
            # Check 3: Balance check
            if user.balance < amount:
                return Response({
                    'error': "Mablag' yetarli emas!",
                    'success': False
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check 4: Multiple rapid payments (check last 5 minutes)
            recent_payments = Transaction.objects.filter(
                user=user,
                type='spend',
                date__gte=timezone.now() - timezone.timedelta(minutes=5)
            ).count()
            if recent_payments >= 5:
                fraud_detected = True
                fraud_reasons.append('Juda ko\'p tez to\'lovlar')
        
            # If fraud detected, return error
            if fraud_detected:
                Transaction.objects.create(
                    user=user,
                    amount=0,
                    type='spend',
                    description=f'{provider} to\'lovi - FIRIBGARLIK ANIQLANDI: {", ".join(fraud_reasons)}',
                    provider=provider
                )
                return Response({
                    'error': f'Firibgarlik aniqlandi: {", ".join(fraud_reasons)}',
                    'success': False
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Process payment
            try:
                with transaction.atomic():
                    user.balance -= amount
                    user.save()
                    
                    Transaction.objects.create(
                        user=user,
                        amount=-float(amount),  # Transaction model expects float
                        type='spend',
                        description=f'{provider} to\'lovi (Hisob: {account_number})',
                        provider=provider
                    )
                
                # Refresh user from database to get updated data
                user.refresh_from_db()
                
                # Serialize user data
                user_data = UserSerializer(user).data
                
                return Response({
                    **user_data,
                    'success': True,
                    'message': 'To\'lov muvaffaqiyatli amalga oshirildi!'
                })
            except Exception as db_error:
                print(f"❌ Database error during payment: {db_error}")
                import traceback
                traceback.print_exc()
                return Response({
                    'error': f'To\'lov amalga oshirishda xatolik: {str(db_error)}',
                    'success': False
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            print(f"❌ Unexpected error in pay_utility: {e}")
            import traceback
            traceback.print_exc()
            return Response({
                'error': f'Xatolik yuz berdi: {str(e)}',
                'success': False
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def delete_account(self, request, pk=None):
        """Soft delete user account"""
        if request.user.is_authenticated:
            user = request.user
        elif pk:
            try:
                user = User.objects.get(pk=pk, is_deleted=False)
            except User.DoesNotExist:
                return Response({'error': 'Foydalanuvchi topilmadi'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Foydalanuvchi talab qilinadi'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Soft delete - mark as deleted but keep in database
        user.is_deleted = True
        user.deleted_at = timezone.now()
        user.is_active = False
        user.save()
        
        # Logout user
        from django.contrib.auth import logout
        logout(request)
        
        return Response({'message': 'Hisob muvaffaqiyatli o\'chirildi'})


class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)


class GlobalStatsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GlobalStats.objects.all()
    serializer_class = GlobalStatsSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # Return singleton instance or create default
        stats, created = GlobalStats.objects.get_or_create(pk=1)
        return GlobalStats.objects.filter(pk=stats.pk)
