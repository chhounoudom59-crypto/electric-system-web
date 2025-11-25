from django.urls import path
from .views import (
    RequestOTPView,
    VerifyOTPView,
    RequestPhoneOTPView,
    VerifyPhoneOTPView,
    ProfileView,
)

urlpatterns = [
    path('auth/request-otp/', RequestOTPView.as_view(), name='request-otp'),
    path('auth/verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('auth/request-phone-otp/', RequestPhoneOTPView.as_view(), name='request-phone-otp'),
    path('auth/verify-phone-otp/', VerifyPhoneOTPView.as_view(), name='verify-phone-otp'),
    path('profile/', ProfileView.as_view(), name='profile'),
]