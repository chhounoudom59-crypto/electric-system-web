from django.shortcuts import render

# Create your views here.
from decimal import Decimal

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from inventory.models import Branch, InventoryItem

from .models import (
    Category,
    Brand,
    Product,
    ProductVariant,
    Favorite,
    ProductImage,
)
from .serializers import (
    CategorySerializer,
    BrandSerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductVariantSerializer,
    FavoriteSerializer,
)


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'


class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).select_related('category', 'brand')
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'category__slug': ['exact'],
        'brand__slug': ['exact'],
        'product_type': ['exact'],
        'base_price': ['gte', 'lte'],
    }
    search_fields = ['name', 'description', 'brand__name', 'category__name']
    ordering_fields = ['base_price', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def variants(self, request, pk=None):
        product = self.get_object()
        qs = product.variants.filter(is_active=True)
        serializer = ProductVariantSerializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def related(self, request, pk=None):
        """
        Get related products based on same category (simple recommendation).
        """
        product = self.get_object()
        # Simple logic: same category, exclude self
        related_qs = Product.objects.filter(
            category=product.category,
            is_active=True
        ).exclude(id=product.id).order_by('?')[:5] # Random 5 from same category
        
        serializer = ProductListSerializer(related_qs, many=True)
        return Response(serializer.data)


def create_demo_catalog():
    """Seed demo categories, brands, products, variants, images, and inventory.

    This is a helper you can call from the Django shell:

        python manage.py shell
        >>> from products.views import create_demo_catalog
        >>> create_demo_catalog()

    It is safe to run multiple times; it will reuse existing objects if they exist.
    """
    smartphones, _ = Category.objects.get_or_create(
        slug="smartphones",
        defaults={"name": "Smartphones"},
    )
    laptops, _ = Category.objects.get_or_create(
        slug="laptops",
        defaults={"name": "Laptops"},
    )
    headphones, _ = Category.objects.get_or_create(
        slug="headphones",
        defaults={"name": "Headphones"},
    )

    apple, _ = Brand.objects.get_or_create(
        slug="apple",
        defaults={"name": "Apple"},
    )
    samsung, _ = Brand.objects.get_or_create(
        slug="samsung",
        defaults={"name": "Samsung"},
    )
    sony, _ = Brand.objects.get_or_create(
        slug="sony",
        defaults={"name": "Sony"},
    )

    iphone, _ = Product.objects.get_or_create(
        slug="iphone-15-pro-max",
        defaults={
            "name": "iPhone 15 Pro Max",
            "category": smartphones,
            "brand": apple,
            "product_type": Product.ProductType.PHONE_TABLET,
            "description": "Flagship iPhone with Pro camera system and titanium design.",
            "base_price": Decimal("1199.00"),
            "is_active": True,
        },
    )
    macbook, _ = Product.objects.get_or_create(
        slug="macbook-pro-16",
        defaults={
            "name": "MacBook Pro 16-inch",
            "category": laptops,
            "brand": apple,
            "product_type": Product.ProductType.LAPTOP_COMPUTER,
            "description": "Powerful laptop for creators with Retina display.",
            "base_price": Decimal("2499.00"),
            "is_active": True,
        },
    )
    wh1000, _ = Product.objects.get_or_create(
        slug="sony-wh-1000xm5",
        defaults={
            "name": "Sony WH-1000XM5",
            "category": headphones,
            "brand": sony,
            "product_type": Product.ProductType.AUDIO,
            "description": "Industry-leading noise cancelling wireless headphones.",
            "base_price": Decimal("399.00"),
            "is_active": True,
        },
    )

    v1, _ = ProductVariant.objects.get_or_create(
        product=iphone,
        sku="IPH15PM-256-NT",
        defaults={
            "color": "Natural Titanium",
            "storage": "256GB",
            "ram": "",
            "base_price": Decimal("1199.00"),
            "is_active": True,
        },
    )
    v2, _ = ProductVariant.objects.get_or_create(
        product=macbook,
        sku="MBP16-1TB-SB",
        defaults={
            "color": "Space Black",
            "storage": "1TB SSD",
            "ram": "32GB",
            "base_price": Decimal("2799.00"),
            "is_active": True,
        },
    )
    v3, _ = ProductVariant.objects.get_or_create(
        product=wh1000,
        sku="WH1000XM5-BLK",
        defaults={
            "color": "Black",
            "storage": "",
            "ram": "",
            "base_price": Decimal("399.00"),
            "is_active": True,
        },
    )

    ProductImage.objects.get_or_create(
        product=iphone,
        image_url="/iPhone_15_Pro_Max_Natural_Titanium.webp",
        defaults={
            "alt_text": "iPhone 15 Pro Max",
            "is_primary": True,
            "sort_order": 0,
        },
    )

    ProductImage.objects.get_or_create(
        product=macbook,
        image_url="/macbook-pro-16-inch-space-black.jpg",
        defaults={
            "alt_text": "MacBook Pro 16-inch",
            "is_primary": True,
            "sort_order": 0,
        },
    )

    ProductImage.objects.get_or_create(
        product=wh1000,
        image_url="/Sony WH-1000XM5.jpg",
        defaults={
            "alt_text": "Sony WH-1000XM5",
            "is_primary": True,
            "sort_order": 0,
        },
    )

    main_branch, _ = Branch.objects.get_or_create(
        code="main",
        defaults={"name": "Main Store"},
    )

    for variant in [v1, v2, v3]:
        inv, created = InventoryItem.objects.get_or_create(
            branch=main_branch,
            variant=variant,
            defaults={
                "quantity": 50,
                "reserved_quantity": 0,
                "min_threshold": 5,
            },
        )
        if not created and inv.quantity < 10:
            inv.quantity = 10
            inv.save(update_fields=["quantity"])


class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related(
            'product', 'product__brand', 'product__category'
        )

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise permissions.PermissionDenied("Cannot delete another user's favorite.")
        instance.delete()