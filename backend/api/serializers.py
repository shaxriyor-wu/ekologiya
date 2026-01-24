from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Transaction, GlobalStats


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    totalRecycledKg = serializers.DecimalField(source='total_recycled_kg', max_digits=10, decimal_places=2, read_only=True)
    joinDate = serializers.SerializerMethodField()
    join_date = serializers.DateField(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'name', 'balance', 
                  'total_recycled_kg', 'totalRecycledKg', 'level', 'join_date', 'joinDate', 'role']
        read_only_fields = ['id', 'balance', 'total_recycled_kg', 'totalRecycledKg', 'level', 'join_date', 'joinDate']
    
    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username
    
    def get_joinDate(self, obj):
        # DateField'ni to'g'ri formatda qaytarish
        if obj.join_date:
            # Agar datetime bo'lsa, date'ga o'tkazish
            if hasattr(obj.join_date, 'date'):
                return obj.join_date.date()
            return obj.join_date
        return None


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'date', 'amount', 'type', 'description', 'provider']
        read_only_fields = ['id', 'date']


class GlobalStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalStats
        fields = ['total_users', 'total_waste_collected', 'total_payouts', 'co2_saved']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, min_length=6)
    email = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
    
    def validate_email(self, value):
        # Email bo'lsa, to'g'ri formatda bo'lishi kerak
        # Email bo'lmasa yoki bo'sh bo'lsa, None qaytarish (avtomatik yaratiladi)
        if not value or (isinstance(value, str) and value.strip() == ''):
            return None
        # Email formatini tekshirish
        if '@' not in value or '.' not in value.split('@')[1]:
            return None  # Noto'g'ri format bo'lsa, None qaytarish (avtomatik yaratiladi)
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Parollar mos kelmaydi")
        
        # Username mavjudligini tekshirish va avtomatik raqam qo'shish
        username = attrs.get('username')
        if username:
            base_username = username
            counter = 1
            # Username mavjud bo'lsa, raqam qo'shish
            while User.objects.filter(username=username, is_deleted=False).exists():
                username = f"{base_username}{counter}"
                counter += 1
                # Agar juda ko'p urinish bo'lsa, to'xtatish
                if counter > 1000:
                    raise serializers.ValidationError({'username': ['Username yaratishda muammo. Boshqa username tanlang']})
            
            # Yangilangan username'ni qaytarish
            attrs['username'] = username
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        # Email bo'lmasa yoki noto'g'ri bo'lsa, avtomatik yaratish
        email = validated_data.get('email')
        if not email or (isinstance(email, str) and email.strip() == ''):
            # To'g'ri email formatida yaratish (example.com domain ishlatiladi)
            validated_data['email'] = f"{validated_data['username']}@example.com"
        else:
            validated_data['email'] = email.strip().lower()
        
        # First name bo'lmasa, username'ni ishlatish
        if not validated_data.get('first_name'):
            validated_data['first_name'] = validated_data['username']
        
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

