from django.db import models

# Create your models here.
from django.db import models
from products.models import Product
from inventory.models import Branch


class CachedSalesSummary(models.Model):
    period_start = models.DateField()
    period_end = models.DateField()
    period_type = models.CharField(max_length=20)  # daily, weekly, monthly, yearly
    branch = models.ForeignKey(Branch, null=True, blank=True, on_delete=models.CASCADE, related_name='sales_summaries')

    total_revenue = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    order_count = models.PositiveIntegerField(default=0)
    items_sold = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('period_start', 'period_end', 'period_type', 'branch')


class ProductRelation(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='relations_from')
    related_product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='relations_to')
    score = models.FloatField(default=0)  # frequency / strength

    class Meta:
        unique_together = ('product', 'related_product')