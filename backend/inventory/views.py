from rest_framework.views import APIView
from rest_framework.response import Response


# Create your views here.
from rest_framework import viewsets, permissions, filters
from .models import (
    Branch,
    Supplier,
    InventoryItem,
    StockImport,
    StockAdjustment,
    StockAlert,
)
from .serializers import (
    BranchSerializer,
    SupplierSerializer,
    InventoryItemSerializer,
    StockImportSerializer,
    StockAdjustmentSerializer,
    StockAlertSerializer,
)


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return bool(request.user and request.user.is_authenticated)
        return bool(request.user and request.user.is_staff)


class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [IsAdminOrReadOnly]


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsAdminOrReadOnly]


class InventoryItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = InventoryItem.objects.select_related('branch', 'variant', 'variant__product')
    serializer_class = InventoryItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['variant__sku', 'variant__product__name', 'branch__code']


class StockImportViewSet(viewsets.ModelViewSet):
    queryset = StockImport.objects.all().select_related('branch', 'supplier')
    serializer_class = StockImportSerializer
    permission_classes = [permissions.IsAdminUser]


class StockAdjustmentViewSet(viewsets.ModelViewSet):
    queryset = StockAdjustment.objects.all().select_related('branch', 'variant')
    serializer_class = StockAdjustmentSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx


class StockAlertViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StockAlert.objects.select_related('inventory_item', 'inventory_item__branch', 'inventory_item__variant')
    serializer_class = StockAlertSerializer
    permission_classes = [permissions.IsAdminUser]


class TriggerStockAlertScanView(APIView):
    """Manually scan inventory items and create/resolve stock alerts.

    - If available_quantity <= 0: create/keep OUT_OF_STOCK alert.
    - Else if available_quantity <= min_threshold: create/keep LOW alert.
    - Else: resolve any active alerts.
    """

    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        alerts_created = 0
        alerts_resolved = 0

        items = InventoryItem.objects.select_related("branch", "variant")
        for item in items:
            available = item.available_quantity
            threshold = item.min_threshold
            active_alerts = item.alerts.filter(is_resolved=False)

            if available <= 0:
                desired_type = StockAlert.AlertType.OUT_OF_STOCK
            elif threshold and available <= threshold:
                desired_type = StockAlert.AlertType.LOW
            else:
                desired_type = None

            if desired_type is None:
                # No alert should be active; resolve any existing ones.
                resolved_count = active_alerts.update(is_resolved=True)
                alerts_resolved += resolved_count
                continue

            # If an active alert of the desired type already exists, keep it.
            if active_alerts.filter(alert_type=desired_type).exists():
                continue

            # Resolve alerts of other types for this item.
            resolved_count = active_alerts.exclude(alert_type=desired_type).update(is_resolved=True)
            alerts_resolved += resolved_count

            StockAlert.objects.create(inventory_item=item, alert_type=desired_type)
            alerts_created += 1

        return Response({
            "alerts_created": alerts_created,
            "alerts_resolved": alerts_resolved,
        })