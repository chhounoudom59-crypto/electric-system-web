from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=150)
    slug = models.SlugField(unique=True)
    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        related_name='children',
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return self.name


class Brand(models.Model):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    class ProductType(models.TextChoices):
        PHONE_TABLET = 'PHONE_TABLET', 'Phones & Tablets'
        LAPTOP_COMPUTER = 'LAPTOP_COMPUTER', 'Laptops & Computers'
        AUDIO = 'AUDIO', 'Audio & Headphones'
        WEARABLE = 'WEARABLE', 'Smart Watches & Wearables'
        ACCESSORY = 'ACCESSORY', 'Accessories'
        OTHER = 'OTHER', 'Other'

    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    brand = models.ForeignKey(Brand, on_delete=models.PROTECT, related_name='products')
    product_type = models.CharField(
        max_length=30,
        choices=ProductType.choices,
        default=ProductType.OTHER,
    )
    description = models.TextField(blank=True)
    base_price = models.DecimalField(max_digits=12, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    sku = models.CharField(max_length=100, unique=True)
    color = models.CharField(max_length=50, blank=True)
    storage = models.CharField(max_length=50, blank=True)
    ram = models.CharField(max_length=50, blank=True)
    attributes = models.JSONField(blank=True, default=dict)
    base_price = models.DecimalField(max_digits=12, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.product.name} ({self.sku})"


class PromotionRule(models.Model):
    class RuleType(models.TextChoices):
        PERCENT_DISCOUNT = 'PERCENT_DISCOUNT', 'Percent discount'
        FIXED_DISCOUNT = 'FIXED_DISCOUNT', 'Fixed discount'
        BULK_TIER = 'BULK_TIER', 'Bulk / tiered pricing'
        BUNDLE = 'BUNDLE', 'Bundle deal'
        GIFT = 'GIFT', 'Gift with purchase'

    product = models.ForeignKey(Product, null=True, blank=True, on_delete=models.CASCADE, related_name='promotions')
    variant = models.ForeignKey(ProductVariant, null=True, blank=True, on_delete=models.CASCADE, related_name='promotions')
    rule_type = models.CharField(max_length=30, choices=RuleType.choices)
    min_qty = models.PositiveIntegerField(default=1)
    max_qty = models.PositiveIntegerField(null=True, blank=True)
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    start_at = models.DateTimeField(null=True, blank=True)
    end_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        target = self.variant or self.product
        return f"Promo {self.rule_type} for {target}"


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField()
    alt_text = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['sort_order', 'id']


class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')