from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings
from django.utils import timezone
from products.models import ProductVariant


class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart',
        null=True,
        blank=True,
    )
    session_id = models.CharField(max_length=255, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.user:
            return f"Cart of {self.user.email}"
        return f"Cart session {self.session_id}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    variant = models.ForeignKey(ProductVariant, on_delete=models.PROTECT, related_name='cart_items')
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('cart', 'variant')


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PROCESSING = 'PROCESSING', 'Processing'
        PAID = 'PAID', 'Paid'
        SHIPPED = 'SHIPPED', 'Shipped'
        DELIVERED = 'DELIVERED', 'Delivered'
        CANCELLED = 'CANCELLED', 'Cancelled'
        REFUNDED = 'REFUNDED', 'Refunded'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='orders')
    order_number = models.CharField(max_length=30, unique=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)

    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    discount_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    payment_method = models.CharField(max_length=50, blank=True)
    payment_status = models.CharField(max_length=50, blank=True)

    shipping_address = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    def mark_paid(self):
        self.status = self.Status.PAID
        self.payment_status = 'PAID'
        self.paid_at = timezone.now()
        self.save(update_fields=['status', 'payment_status', 'paid_at'])

    def __str__(self):
        return self.order_number


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    variant = models.ForeignKey(ProductVariant, on_delete=models.PROTECT, related_name='order_items')
    product_name = models.CharField(max_length=255)
    variant_sku = models.CharField(max_length=100)
    variant_attributes = models.JSONField(blank=True, default=dict)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    quantity = models.PositiveIntegerField()
    line_total = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.product_name} x{self.quantity}"


class PaymentTransaction(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        SUCCESS = 'SUCCESS', 'Success'
        FAILED = 'FAILED', 'Failed'

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    gateway = models.CharField(max_length=50)
    gateway_transaction_id = models.CharField(max_length=100, blank=True)
    gateway_signature = models.CharField(max_length=255, blank=True)
    payment_url = models.TextField(blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    raw_response = models.JSONField(blank=True, default=dict)
    created_at = models.DateTimeField(auto_now_add=True)