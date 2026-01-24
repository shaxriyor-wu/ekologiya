from django.core.management.base import BaseCommand
from api.models import User


class Command(BaseCommand):
    help = 'Test foydalanuvchi yaratish'

    def add_arguments(self, parser):
        parser.add_argument(
            '--username',
            type=str,
            default='shohjaxon',
            help='Username',
        )
        parser.add_argument(
            '--email',
            type=str,
            default='shohjaxon@test.com',
            help='Email',
        )
        parser.add_argument(
            '--password',
            type=str,
            default='123456',
            help='Parol',
        )
        parser.add_argument(
            '--name',
            type=str,
            default='Shohjaxon Baxtiyorov',
            help='Ism Familiya',
        )

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']
        name = options['name']
        
        name_parts = name.split(' ', 1)
        first_name = name_parts[0] if name_parts else ''
        last_name = name_parts[1] if len(name_parts) > 1 else ''
        
        # Foydalanuvchi mavjudligini tekshirish
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            self.stdout.write(
                self.style.SUCCESS(f'✅ Foydalanuvchi allaqachon mavjud: {user.email} (ID: {user.id})')
            )
            self.stdout.write(f'   Username: {user.username}')
            self.stdout.write(f'   Parol: {password}')
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
            self.stdout.write(
                self.style.SUCCESS('✅ Yangi foydalanuvchi yaratildi!')
            )
            self.stdout.write(f'   ID: {user.id}')
            self.stdout.write(f'   Username: {user.username}')
            self.stdout.write(f'   Email: {user.email}')
            self.stdout.write(f'   Parol: {password}')
            self.stdout.write(f'   Balance: {user.balance} UZS')
            return user
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Xatolik: {e}')
            )
            return None




















