from rest_framework import serializers
from .models import (
    Branch,
    Supplier,
    InventoryItem,
    StockImport,
    StockImportItem,
    StockAdjustment,
    StockAlert,
)
from products.models import ProductVariant


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['id', 'name', 'code', 'address', 'phone']


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['id', 'name', 'contact_email', 'phone', 'address']


class ProductVariantSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'sku', 'color', 'storage', 'ram']


class InventoryItemSerializer(serializers.ModelSerializer):
    variant = ProductVariantSimpleSerializer(read_only=True)
    available_quantity = serializers.IntegerField(read_only=True)

    class Meta:
        model = InventoryItem
        fields = [
            'id',
            'branch',
            'variant',
            'quantity',
            'reserved_quantity',
            'min_threshold',
            'available_quantity',
        ]


class StockImportItemSerializer(serializers.ModelSerializer):
    variant = ProductVariantSimpleSerializer(read_only=True)
    variant_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.all(),
        write_only=True,
        source='variant',
    )

    class Meta:
        model = StockImportItem
        fields = ['id', 'variant', 'variant_id', 'quantity_received', 'purchase_price']


class StockImportSerializer(serializers.ModelSerializer):
    items = StockImportItemSerializer(many=True)

    class Meta:
        model = StockImport
        fields = [
            'id',
            'branch',
            'supplier',
            'import_date',
            'reference_number',
            'total_cost',
            'items',
        ]
        read_only_fields = ['import_date', 'total_cost']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        stock_import = StockImport.objects.create(**validated_data)

        total_cost = 0
        for item_data in items_data:
            variant = item_data['variant']
            qty = item_data['quantity_received']
            price = item_data['purchase_price']
            total_cost += qty * price
            StockImportItem.objects.create(
                stock_import=stock_import,
                variant=variant,
                quantity_received=qty,
                purchase_price=price,
            )
            inv, _ = InventoryItem.objects.get_or_create(
                branch=stock_import.branch,
                variant=variant,
                defaults={'quantity': 0, 'reserved_quantity': 0},
            )
            inv.quantity += qty
            inv.save(update_fields=['quantity'])

        stock_import.total_cost = total_cost
        stock_import.save(update_fields=['total_cost'])
        return stock_import


class StockAdjustmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockAdjustment
        fields = [
            'id',
            'branch',
            'variant',
            'old_quantity',
            'new_quantity',
            'reason',
            'created_by',
            'created_at',
        ]
        read_only_fields = ['old_quantity', 'created_by', 'created_at']

    def create(self, validated_data):
        request = self.context['request']
        branch = validated_data['branch']
        variant = validated_data['variant']
        new_quantity = validated_data['new_quantity']

        inv, _ = InventoryItem.objects.get_or_create(
            branch=branch,
            variant=variant,
            defaults={'quantity': 0, 'reserved_quantity': 0},
        )
        old_q = inv.quantity
        inv.quantity = new_quantity
        inv.save(update_fields=['quantity'])

        adjustment = StockAdjustment.objects.create(
            branch=branch,
            variant=variant,
            old_quantity=old_q,
            new_quantity=new_quantity,
            reason=validated_data.get('reason', ''),
            created_by=request.user if request and request.user.is_authenticated else None,
        )
        return adjustment


class StockAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockAlert
        fields = ['id', 'inventory_item', 'alert_type', 'created_at', 'is_resolved']