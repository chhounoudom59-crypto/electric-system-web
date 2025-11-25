from django.urls import path
from .views import SalesReportView, TopSellingProductsView, ProductTrendView

urlpatterns = [
    path('sales/', SalesReportView.as_view(), name='sales-report'),
    path('top-products/', TopSellingProductsView.as_view(), name='top-products'),
    path('trends/', ProductTrendView.as_view(), name='product-trends'),
]