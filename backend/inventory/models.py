from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings
from products.models import ProductVariant


class Branch(models.Model):
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=50, unique=True)
    address = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"{self.name} ({self.code})"


class Supplier(models.Model):
    name = models.CharField(max_length=255)
    contact_email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    address = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name


class InventoryItem(models.Model):
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='inventory_items')
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='inventory_items')
    quantity = models.IntegerField(default=0)
    reserved_quantity = models.IntegerField(default=0)
    min_threshold = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('branch', 'variant')

    @property
    def available_quantity(self) -> int:
        return max(0, self.quantity - self.reserved_quantity)


class StockImport(models.Model):
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='stock_imports')
    supplier = models.ForeignKey(Supplier, null=True, blank=True, on_delete=models.SET_NULL, related_name='stock_imports')
    import_date = models.DateTimeField(auto_now_add=True)
    reference_number = models.CharField(max_length=100, blank=True)
    total_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return f"Import {self.id} to {self.branch.code}"


class StockImportItem(models.Model):
    stock_import = models.ForeignKey(StockImport, on_delete=models.CASCADE, related_name='items')
    variant = models.ForeignKey(ProductVariant, on_delete=models.PROTECT, related_name='stock_import_items')
    quantity_received = models.PositiveIntegerField()
    purchase_price = models.DecimalField(max_digits=12, decimal_places=2)


class StockAdjustment(models.Model):
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='stock_adjustments')
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='stock_adjustments')
    old_quantity = models.IntegerField()
    new_quantity = models.IntegerField()
    reason = models.CharField(max_length=255, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='stock_adjustments',
    )
    created_at = models.DateTimeField(auto_now_add=True)


class StockAlert(models.Model):
    class AlertType(models.TextChoices):
        LOW = 'LOW', 'Low stock'
        OUT_OF_STOCK = 'OUT_OF_STOCK', 'Out of stock'

    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, related_name='alerts')
    alert_type = models.CharField(max_length=20, choices=AlertType.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.alert_type} for {self.inventory_item.variant.sku} @ {self.inventory_item.branch.code}"