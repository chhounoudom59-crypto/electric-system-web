from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BranchViewSet,
    SupplierViewSet,
    InventoryItemViewSet,
    StockImportViewSet,
    StockAdjustmentViewSet,
    StockAlertViewSet,
    TriggerStockAlertScanView,
)

router = DefaultRouter()
router.register('branches', BranchViewSet, basename='branch')
router.register('suppliers', SupplierViewSet, basename='supplier')
router.register('inventory', InventoryItemViewSet, basename='inventory-item')
router.register('imports', StockImportViewSet, basename='stock-import')
router.register('adjustments', StockAdjustmentViewSet, basename='stock-adjustment')
router.register('alerts', StockAlertViewSet, basename='stock-alert')

urlpatterns = [
    path('', include(router.urls)),
    path('scan-alerts/', TriggerStockAlertScanView.as_view(), name='scan-alerts'),
]