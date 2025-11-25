from rest_framework import serializers
from .models import (
    Category,
    Brand,
    Product,
    ProductVariant,
    PromotionRule,
    ProductImage,
    Favorite,
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent']


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'alt_text', 'is_primary', 'sort_order']


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = [
            'id',
            'sku',
            'color',
            'storage',
            'ram',
            'attributes',
            'base_price',
            'is_active',
        ]


class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'product_type',
            'base_price',
            'is_active',
            'category',
            'brand',
            'primary_image',
        ]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        return ProductImageSerializer(img).data if img else None


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'product_type',
            'description',
            'base_price',
            'is_active',
            'category',
            'brand',
            'images',
            'variants',
        ]


class FavoriteSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        write_only=True,
        source='product',
    )

    class Meta:
        model = Favorite
        fields = ['id', 'product', 'product_id', 'created_at']

    def create(self, validated_data):
        user = self.context['request'].user
        product = validated_data['product']
        favorite, _ = Favorite.objects.get_or_create(user=user, product=product)
        return favorite