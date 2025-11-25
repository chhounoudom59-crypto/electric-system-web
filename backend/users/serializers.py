from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import UserProfile, EmailOTP, PhoneOTP

User = get_user_model()


class RequestOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    purpose = serializers.ChoiceField(choices=EmailOTP.Purpose.choices)

    def validate(self, attrs):
        email = attrs['email'].lower()
        purpose = attrs['purpose']

        if purpose == EmailOTP.Purpose.LOGIN and not User.objects.filter(email=email).exists():
            raise serializers.ValidationError("User with this email does not exist.")
        attrs['email'] = email
        return attrs


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)
    purpose = serializers.ChoiceField(choices=EmailOTP.Purpose.choices)
    full_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    address_line1 = serializers.CharField(max_length=255, required=False, allow_blank=True)

    def validate(self, attrs):
        email = attrs['email'].lower()
        code = attrs['code']
        purpose = attrs['purpose']

        otp_qs = EmailOTP.objects.filter(
            email=email,
            purpose=purpose,
            code=code,
            is_used=False,
            expires_at__gte=timezone.now(),
        ).order_by('-created_at')

        otp = otp_qs.first()
        if not otp:
            raise serializers.ValidationError("Invalid or expired OTP.")
        attrs['otp'] = otp
        attrs['email'] = email
        return attrs


class RequestPhoneOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    purpose = serializers.ChoiceField(choices=PhoneOTP.Purpose.choices)

    def validate(self, attrs):
        # Normalize phone number to avoid issues with spaces/formatting
        raw_phone = attrs['phone_number']
        phone_number = raw_phone.replace(" ", "")
        purpose = attrs['purpose']

        if purpose == PhoneOTP.Purpose.LOGIN and not User.objects.filter(username=phone_number).exists():
            # Note: We use phone number as username for phone-based auth
            raise serializers.ValidationError("User with this phone number does not exist.")
        
        attrs['phone_number'] = phone_number
        return attrs


class VerifyPhoneOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    code = serializers.CharField(max_length=6)
    purpose = serializers.ChoiceField(choices=PhoneOTP.Purpose.choices, required=False)
    full_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    address_line1 = serializers.CharField(max_length=255, required=False, allow_blank=True)

    def validate(self, attrs):
        # Normalize phone number the same way as in RequestPhoneOTPSerializer
        raw_phone = attrs['phone_number']
        phone_number = raw_phone.replace(" ", "")
        code = attrs['code']
        # purpose may be present but we don't use it to filter OTPs

        otp_qs = PhoneOTP.objects.filter(
            phone_number=phone_number,
            code=code,
            is_used=False,
            expires_at__gte=timezone.now(),
        ).order_by('-created_at')

        otp = otp_qs.first()
        if not otp:
            raise serializers.ValidationError("Invalid or expired OTP.")
        attrs['otp'] = otp
        attrs['phone_number'] = phone_number
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'email',
            'username',
            'full_name',
            'phone',
            'address_line1',
            'address_line2',
            'city',
            'state',
            'postal_code',
            'country',
        ]


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'full_name',
            'phone',
            'address_line1',
            'address_line2',
            'city',
            'state',
            'postal_code',
            'country',
        ]