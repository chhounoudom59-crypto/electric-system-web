from django.db import transaction
from rest_framework import serializers
from products.models import ProductVariant
from inventory.models import InventoryItem
from .models import Cart, CartItem, Order, OrderItem, PaymentTransaction


class ProductVariantSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'sku', 'color', 'storage', 'ram', 'base_price']


class CartItemSerializer(serializers.ModelSerializer):
    variant = ProductVariantSimpleSerializer(read_only=True)
    variant_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.all(),
        write_only=True,
        source='variant',
    )

    class Meta:
        model = CartItem
        fields = ['id', 'variant', 'variant_id', 'quantity', 'unit_price', 'created_at']
        read_only_fields = ['unit_price', 'created_at']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'total_items', 'total_amount', 'created_at', 'updated_at', 'items']

    def get_total_items(self, obj):
        return sum(item.quantity for item in obj.items.all())

    def get_total_amount(self, obj):
        return sum(item.quantity * item.unit_price for item in obj.items.all())


def get_available_stock(variant: ProductVariant) -> int:
    qs = InventoryItem.objects.filter(variant=variant)
    total = 0
    for inv in qs:
        total += inv.available_quantity
    return total


class CartItemCreateUpdateSerializer(serializers.ModelSerializer):
    variant_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.all(),
        write_only=True,
        source='variant',
    )

    class Meta:
        model = CartItem
        fields = ['id', 'variant_id', 'quantity']

    def validate(self, attrs):
        variant = attrs['variant']
        quantity = attrs['quantity']
        available = get_available_stock(variant)
        if quantity <= 0:
            raise serializers.ValidationError("Quantity must be greater than zero.")
        if quantity > available:
            raise serializers.ValidationError(f"Only {available} items available in stock.")
        return attrs

    def create(self, validated_data):
        cart: Cart = self.context['cart']
        variant = validated_data['variant']
        quantity = validated_data['quantity']

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            variant=variant,
            defaults={
                'quantity': quantity,
                'unit_price': variant.base_price,
            },
        )
        if not created:
            new_qty = item.quantity + quantity
            available = get_available_stock(variant)
            if new_qty > available:
                raise serializers.ValidationError(f"Only {available} items available in stock.")
            item.quantity = new_qty
            item.save(update_fields=['quantity'])
        return item

    def update(self, instance: CartItem, validated_data):
        quantity = validated_data.get('quantity', instance.quantity)
        available = get_available_stock(instance.variant)
        if quantity > available:
            raise serializers.ValidationError(f"Only {available} items available in stock.")
        instance.quantity = quantity
        instance.save(update_fields=['quantity'])
        return instance


class OrderItemSerializer(serializers.ModelSerializer):
    variant = ProductVariantSimpleSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id',
            'variant',
            'product_name',
            'variant_sku',
            'variant_attributes',
            'unit_price',
            'quantity',
            'line_total',
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'order_number',
            'status',
            'subtotal',
            'discount_total',
            'tax_total',
            'total_amount',
            'payment_method',
            'payment_status',
            'shipping_address',
            'created_at',
            'paid_at',
            'items',
        ]


class CheckoutSerializer(serializers.Serializer):
    shipping_address = serializers.CharField()
    payment_method = serializers.CharField()

    def validate(self, attrs):
        user = self.context['request'].user
        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            raise serializers.ValidationError("Cart is empty.")

        if not cart.items.exists():
            raise serializers.ValidationError("Cart is empty.")
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        request = self.context['request']
        user = request.user
        cart = Cart.objects.select_for_update().get(user=user)

        subtotal = 0
        for item in cart.items.all():
            available = get_available_stock(item.variant)
            if item.quantity > available:
                raise serializers.ValidationError(
                    f"Not enough stock for {item.variant.sku}. Available: {available}."
                )
            subtotal += item.quantity * item.unit_price

        discount_total = 0
        tax_total = 0
        total_amount = subtotal - discount_total + tax_total

        import uuid
        order_number = uuid.uuid4().hex[:12].upper()

        order = Order.objects.create(
            user=user,
            order_number=order_number,
            status=Order.Status.PENDING,
            subtotal=subtotal,
            discount_total=discount_total,
            tax_total=tax_total,
            total_amount=total_amount,
            payment_method=validated_data['payment_method'],
            payment_status='PENDING',
            shipping_address=validated_data['shipping_address'],
        )

        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                variant=item.variant,
                product_name=item.variant.product.name,
                variant_sku=item.variant.sku,
                variant_attributes={
                    'color': item.variant.color,
                    'storage': item.variant.storage,
                    'ram': item.variant.ram,
                },
                unit_price=item.unit_price,
                quantity=item.quantity,
                line_total=item.quantity * item.unit_price,
            )

            remaining = item.quantity
            for inv in InventoryItem.objects.filter(variant=item.variant).order_by('id'):
                if remaining <= 0:
                    break
                available = inv.available_quantity
                if available <= 0:
                    continue
                deduct = min(available, remaining)
                inv.quantity -= deduct
                inv.save(update_fields=['quantity'])
                remaining -= deduct

        cart.items.all().delete()

        # Generate dummy ABA PayWay payment URL
        # In production, use real API keys and HMAC logic
        import base64
        import hashlib
        import hmac

        aba_merchant_id = "dummy_merchant"
        aba_api_key = "dummy_api_key"
        req_time = timezone.now().strftime("%Y%m%d%H%M%S")
        hash_str = f"{req_time}{aba_merchant_id}{order.order_number}{order.total_amount}"
        signature = hmac.new(aba_api_key.encode(), hash_str.encode(), hashlib.sha512).hexdigest()
        
        payment_url = f"https://checkout.payway.com.kh/api/payment-gateway?merchant_id={aba_merchant_id}&tran_id={order.order_number}&amount={order.total_amount}&hash={signature}"

        payment = PaymentTransaction.objects.create(
            order=order,
            gateway=order.payment_method,
            amount=order.total_amount,
            status=PaymentTransaction.Status.PENDING,
            gateway_signature=signature,
            payment_url=payment_url,
            raw_response={},
        )

        return order