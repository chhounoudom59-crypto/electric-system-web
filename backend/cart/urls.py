from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CartView, CartItemViewSet, CheckoutView, OrderViewSet, ABAPayWayWebhookView

router = DefaultRouter()
router.register('items', CartItemViewSet, basename='cart-item')
router.register('orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', CartView.as_view(), name='cart-detail'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('webhooks/payway/', ABAPayWayWebhookView.as_view(), name='payway-webhook'),
    path('', include(router.urls)),
]