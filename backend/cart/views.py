from django.shortcuts import render

# Create your views here.
from rest_framework import views, viewsets, permissions, status
from rest_framework.response import Response
from .models import Cart, CartItem, Order
from .serializers import (
    CartSerializer,
    CartItemSerializer,
    CartItemCreateUpdateSerializer,
    CheckoutSerializer,
    OrderSerializer,
)


def get_user_cart(user) -> Cart:
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


class CartView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart = get_user_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class CartItemViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = CartItem.objects.all()

    def get_queryset(self):
        cart = get_user_cart(self.request.user)
        return cart.items.select_related('variant', 'variant__product')

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CartItemCreateUpdateSerializer
        return CartItemSerializer

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['cart'] = get_user_cart(self.request.user)
        return ctx


class CheckoutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        order_data = OrderSerializer(order).data

        # Include payment URL if payment transaction exists
        if hasattr(order, 'payment'):
            order_data['payment_url'] = order.payment.payment_url

        return Response(order_data, status=status.HTTP_201_CREATED)


class ABAPayWayWebhookView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # In production, verify the hash/signature from PayWay first.
        data = request.data
        tran_id = data.get('tran_id')
        status_code = data.get('status')  # PayWay usually uses 0 for success

        if not tran_id:
            return Response({"detail": "Missing tran_id"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.get(order_number=tran_id)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        # Success
        if str(status_code) == '0':
            order.mark_paid()
            payment = getattr(order, 'payment', None)
            if payment:
                payment.status = payment.Status.SUCCESS
                payment.raw_response = data
                payment.save(update_fields=['status', 'raw_response'])
            return Response({"status": "ok"})

        # Failure
        payment = getattr(order, 'payment', None)
        if payment:
            payment.status = payment.Status.FAILED
            payment.raw_response = data
            payment.save(update_fields=['status', 'raw_response'])
        return Response({"status": "failed"}, status=status.HTTP_400_BAD_REQUEST)


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')