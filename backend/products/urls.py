from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, BrandViewSet, ProductViewSet, FavoriteViewSet

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('brands', BrandViewSet, basename='brand')
router.register('', ProductViewSet, basename='product')
router.register('favorites', FavoriteViewSet, basename='favorite')

urlpatterns = [
    path('', include(router.urls)),
]