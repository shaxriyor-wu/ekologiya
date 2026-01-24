#!/usr/bin/env python
"""
Test foydalanuvchi yaratish skripti
"""
import os
import sys
import django

# Django setup
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecocash_backend.settings')
django.setup()

from api.models import User

def create_test_user():
    """Test foydalanuvchi yaratish"""
    # Test foydalanuvchi ma'lumotlari
    username = 'shohjaxon'
    email = 'shohjaxon@test.com'
    password = '123456'
    first_name = 'Shohjaxon'
    last_name = 'Baxtiyorov'
    
    # Foydalanuvchi mavjudligini tekshirish
    if User.objects.filter(email=email).exists():
        user = User.objects.get(email=email)
        print(f"[OK] Foydalanuvchi allaqachon mavjud: {user.email} (ID: {user.id})")
        print(f"     Username: {user.username}")
        print(f"     Parol: {password}")
        return user
    
    # Yangi foydalanuvchi yaratish
    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            balance=1000.00,
            total_recycled_kg=0.00,
            level=1,
            role='user'
        )
        print(f"[OK] Yangi foydalanuvchi yaratildi!")
        print(f"     ID: {user.id}")
        print(f"     Username: {user.username}")
        print(f"     Email: {user.email}")
        print(f"     Parol: {password}")
        print(f"     Balance: {user.balance} UZS")
        return user
    except Exception as e:
        print(f"[ERROR] Xatolik: {e}")
        return None

if __name__ == '__main__':
    print("=" * 50)
    print("Test Foydalanuvchi Yaratish")
    print("=" * 50)
    print()
    user = create_test_user()
    print()
    print("=" * 50)
    print("Login qilish uchun:")
    print(f"Email: {user.email if user else 'N/A'}")
    print(f"Parol: 123456")
    print("=" * 50)

