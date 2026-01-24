from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import date


def get_today():
    """Return today's date (not datetime)"""
    return date.today()


class User(AbstractUser):
    """Custom User model extending Django's AbstractUser"""
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=1000.00)
    total_recycled_kg = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    level = models.IntegerField(default=1)
    join_date = models.DateField(default=get_today)
    role = models.CharField(max_length=10, choices=[('user', 'User'), ('admin', 'Admin')], default='user')
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.username} ({self.email})"


class Transaction(models.Model):
    """Transaction model"""
    TRANSACTION_TYPES = [
        ('earn', 'Earn'),
        ('spend', 'Spend'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    date = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=5, choices=TRANSACTION_TYPES)
    description = models.CharField(max_length=255)
    provider = models.CharField(max_length=100, blank=True, null=True)
    
    class Meta:
        verbose_name = 'Transaction'
        verbose_name_plural = 'Transactions'
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.user.username} - {self.type} - {self.amount}"


class GlobalStats(models.Model):
    """Global Statistics model"""
    total_users = models.IntegerField(default=142050)
    total_waste_collected = models.DecimalField(max_digits=10, decimal_places=2, default=5890.00)
    total_payouts = models.BigIntegerField(default=850000000)
    co2_saved = models.DecimalField(max_digits=10, decimal_places=2, default=2100.00)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Global Statistics'
        verbose_name_plural = 'Global Statistics'
    
    def __str__(self):
        return f"Global Stats - Updated: {self.updated_at}"


class EmailVerification(models.Model):
    """Email verification code model"""
    email = models.EmailField()
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = 'Email Verification'
        verbose_name_plural = 'Email Verifications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.email} - {self.code}"
    
    def save(self, *args, **kwargs):
        # Agar expires_at to'ldirilmagan bo'lsa, avtomatik 10 daqiqadan keyin eskiradi
        if not self.expires_at:
            self.expires_at = timezone.now() + timezone.timedelta(minutes=10)
        super().save(*args, **kwargs)
    
    def is_expired(self):
        if not self.expires_at:
            return False
        return timezone.now() > self.expires_at




