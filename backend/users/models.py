from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


class UserRole(models.Model):
    ROLES = [
        ('admin', 'Admin'),
        ('customer', 'Customer'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='role')
    role = models.CharField(max_length=20, choices=ROLES, default='customer')
    
    def __str__(self):
        return f"{self.user.username} - {self.get_role_display()}"


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile',
    )
    phone = models.CharField(max_length=20, blank=True)
    full_name = models.CharField(max_length=255, blank=True)
    address_line1 = models.CharField(max_length=255, blank=True)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Profile of {self.user.username}"
    

class EmailOTP(models.Model):
    class Purpose(models.TextChoices):
        REGISTER = 'REGISTER', 'Register'
        LOGIN = 'LOGIN', 'Login'

    email = models.EmailField()
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=20, choices=Purpose.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    sent_count = models.PositiveIntegerField(default=1)
    last_sent_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['email', 'purpose', 'is_used']),
        ]

    def is_expired(self) -> bool:
        return timezone.now() > self.expires_at

    @classmethod
    def create_new(cls, email: str, purpose: str, ip_address: str | None = None, ttl_minutes: int = 10):
        now = timezone.now()
        expires_at = now + timedelta(minutes=ttl_minutes)
        code = cls._generate_code()
        otp = cls.objects.create(
            email=email,
            code=code,
            purpose=purpose,
            expires_at=expires_at,
            last_sent_at=now,
            ip_address=ip_address,
        )
        return otp

    @staticmethod
    def _generate_code() -> str:
        import random
        return f"{random.randint(0, 999999):06d}"

    def mark_used(self):
        self.is_used = True
        self.save(update_fields=['is_used'])


class PhoneOTP(models.Model):
    class Purpose(models.TextChoices):
        REGISTER = 'REGISTER', 'Register'
        LOGIN = 'LOGIN', 'Login'

    phone_number = models.CharField(max_length=20)
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=20, choices=Purpose.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    sent_count = models.PositiveIntegerField(default=1)
    last_sent_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['phone_number', 'purpose', 'is_used']),
        ]

    def is_expired(self) -> bool:
        return timezone.now() > self.expires_at

    @classmethod
    def create_new(cls, phone_number: str, purpose: str, ip_address: str | None = None, ttl_minutes: int = 10):
        now = timezone.now()
        expires_at = now + timedelta(minutes=ttl_minutes)
        code = cls._generate_code()
        otp = cls.objects.create(
            phone_number=phone_number,
            code=code,
            purpose=purpose,
            expires_at=expires_at,
            last_sent_at=now,
            ip_address=ip_address,
        )
        return otp

    @staticmethod
    def _generate_code() -> str:
        import random
        return f"{random.randint(0, 999999):06d}"

    def mark_used(self):
        self.is_used = True
        self.save(update_fields=['is_used'])