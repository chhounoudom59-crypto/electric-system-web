from django.shortcuts import render

# Create your views here.
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.response import Response
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import EmailOTP, PhoneOTP, UserProfile
from .serializers import (
    RequestOTPSerializer,
    VerifyOTPSerializer,
    UserProfileSerializer,
    UserProfileUpdateSerializer,
    RequestPhoneOTPSerializer,
    VerifyPhoneOTPSerializer,
)

User = get_user_model()


def send_otp_via_email(email: str, code: str):
    subject = "Your verification code"
    message = f"Your 6-digit verification code is {code}. It will expire in 10 minutes."
    from_email = None  # uses DEFAULT_FROM_EMAIL from settings
    recipient_list = [email]

    send_mail(subject, message, from_email, recipient_list, fail_silently=False)

def send_otp_via_sms(phone_number: str, code: str):
    # TODO: integrate with ABA PayWay / SmartBiz SMS gateway
    print(f"[DEV] SMS OTP for {phone_number}: {code}")


class RequestOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RequestOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        purpose = serializer.validated_data['purpose']

        now = timezone.now()
        recent_otps = EmailOTP.objects.filter(
            email=email,
            purpose=purpose,
            created_at__gte=now - timezone.timedelta(minutes=5),
        )
        if recent_otps.count() >= 5:
            return Response(
                {"detail": "Too many OTP requests. Please try again later."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        otp = EmailOTP.create_new(email=email, purpose=purpose)
        send_otp_via_email(email, otp.code)

        return Response({"detail": "OTP sent successfully."}, status=status.HTTP_200_OK)


class RequestPhoneOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RequestPhoneOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone_number = serializer.validated_data['phone_number']
        purpose = serializer.validated_data['purpose']

        now = timezone.now()
        recent_otps = PhoneOTP.objects.filter(
            phone_number=phone_number,
            purpose=purpose,
            created_at__gte=now - timezone.timedelta(minutes=5),
        )
        if recent_otps.count() >= 5:
            return Response(
                {"detail": "Too many OTP requests. Please try again later."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        otp = PhoneOTP.create_new(phone_number=phone_number, purpose=purpose)
        send_otp_via_sms(phone_number, otp.code)

        # DEV ONLY: include OTP code in response so you can see it easily during testing
        return Response({
            "detail": "OTP sent successfully.",
            "dev_otp": otp.code,
        }, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        otp: EmailOTP = serializer.validated_data['otp']
        email = serializer.validated_data['email']
        purpose = serializer.validated_data['purpose']

        otp.mark_used()

        user, created = User.objects.get_or_create(
            email=email,
            defaults={'username': email},
        )

        if created:
            UserProfile.objects.create(
                user=user,
                full_name=serializer.validated_data.get('full_name', ''),
                address_line1=serializer.validated_data.get('address_line1', ''),
            )

        refresh = RefreshToken.for_user(user)
        data = {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
            },
        }
        return Response(data, status=status.HTTP_200_OK)


class VerifyPhoneOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        serializer = VerifyPhoneOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        otp: PhoneOTP = serializer.validated_data['otp']
        phone_number = serializer.validated_data['phone_number']
        
        otp.mark_used()

        # Use phone number as username for phone-based users
        user, created = User.objects.get_or_create(
            username=phone_number,
            defaults={'email': f"{phone_number}@placeholder.com"}, # Placeholder email
        )

        if created:
            UserProfile.objects.create(
                user=user,
                phone=phone_number,
                full_name=serializer.validated_data.get('full_name', ''),
                address_line1=serializer.validated_data.get('address_line1', ''),
            )
        else:
            # Ensure profile exists and update phone if missing
            profile, _ = UserProfile.objects.get_or_create(user=user)
            if not profile.phone:
                profile.phone = phone_number
                profile.save(update_fields=['phone'])

        refresh = RefreshToken.for_user(user)
        data = {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "phone": phone_number,
            },
        }
        return Response(data, status=status.HTTP_200_OK)


class ProfileView(RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer

    def get_object(self):
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'PUT']:
            return UserProfileUpdateSerializer
        return UserProfileSerializer