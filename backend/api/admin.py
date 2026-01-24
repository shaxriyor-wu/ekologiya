from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Transaction, GlobalStats, EmailVerification


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for User model"""
    list_display = ('username', 'email', 'name', 'balance', 'total_recycled_kg', 'level', 'role', 'is_staff', 'is_active', 'is_deleted', 'deleted_at')
    list_filter = ('role', 'is_staff', 'is_active', 'is_deleted', 'level')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('EcoCash Info', {
            'fields': ('balance', 'total_recycled_kg', 'level', 'role', 'join_date')
        }),
        ('Account Status', {
            'fields': ('is_deleted', 'deleted_at')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('EcoCash Info', {
            'fields': ('balance', 'total_recycled_kg', 'level', 'role', 'join_date')
        }),
    )
    
    readonly_fields = ('deleted_at',)
    
    def name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username
    name.short_description = 'Name'


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    """Admin configuration for Transaction model"""
    list_display = ('user', 'type', 'amount', 'description', 'provider', 'date')
    list_filter = ('type', 'date', 'provider')
    search_fields = ('user__username', 'user__email', 'description', 'provider')
    readonly_fields = ('date',)
    ordering = ('-date',)
    date_hierarchy = 'date'


@admin.register(GlobalStats)
class GlobalStatsAdmin(admin.ModelAdmin):
    """Admin configuration for GlobalStats model"""
    list_display = ('total_users', 'total_waste_collected', 'total_payouts', 'co2_saved', 'updated_at')
    readonly_fields = ('updated_at',)
    
    def has_add_permission(self, request):
        # Only allow one GlobalStats instance
        return not GlobalStats.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(EmailVerification)
class EmailVerificationAdmin(admin.ModelAdmin):
    """Admin configuration for EmailVerification model"""
    list_display = ('email', 'code', 'is_verified', 'created_at', 'expires_at', 'is_expired_display')
    list_filter = ('is_verified', 'created_at')
    search_fields = ('email', 'code')
    readonly_fields = ('created_at', 'expires_at', 'is_expired_display')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('email', 'code', 'is_verified')
        }),
        ('Vaqt', {
            'fields': ('created_at', 'expires_at', 'is_expired_display')
        }),
    )
    
    def is_expired_display(self, obj):
        """Kod eskirgan yoki yo'qligini ko'rsatish"""
        if obj.is_expired():
            return "[ESKIRGAN]"
        return "[FAOL]"
    is_expired_display.short_description = 'Holati'
    
    def save_model(self, request, obj, form, change):
        # Yangi yaratilganda expires_at ni avtomatik to'ldirish
        if not change and not obj.expires_at:
            from django.utils import timezone
            obj.expires_at = timezone.now() + timezone.timedelta(minutes=10)
        super().save_model(request, obj, form, change)




