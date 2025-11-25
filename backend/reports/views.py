from django.shortcuts import render

# Create your views here.
from django.db.models import Sum, Count, F
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth, TruncYear
from rest_framework import views, permissions
from rest_framework.response import Response
from cart.models import Order, OrderItem
from products.models import Product


class SalesReportView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        period = request.query_params.get('period', 'daily')
        qs = Order.objects.filter(status__in=[Order.Status.PAID, Order.Status.DELIVERED])

        if period == 'daily':
            qs = qs.annotate(period=TruncDay('created_at'))
        elif period == 'weekly':
            qs = qs.annotate(period=TruncWeek('created_at'))
        elif period == 'monthly':
            qs = qs.annotate(period=TruncMonth('created_at'))
        elif period == 'yearly':
            qs = qs.annotate(period=TruncYear('created_at'))
        else:
            return Response({"detail": "Invalid period"}, status=400)

        agg = qs.values('period').annotate(
            total_revenue=Sum('total_amount'),
            order_count=Count('id'),
        ).order_by('period')

        return Response(agg)


class TopSellingProductsView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        limit = int(request.query_params.get('limit', 10))
        qs = OrderItem.objects.filter(order__status__in=[Order.Status.PAID, Order.Status.DELIVERED])
        agg = qs.values('variant__product').annotate(
            quantity_sold=Sum('quantity'),
            revenue=Sum('line_total'),
        ).order_by('-quantity_sold')[:limit]

        product_ids = [a['variant__product'] for a in agg]
        products = Product.objects.in_bulk(product_ids)

        result = []
        for row in agg:
            p = products.get(row['variant__product'])
            if not p:
                continue
            result.append({
                'product_id': p.id,
                'name': p.name,
                'quantity_sold': row['quantity_sold'],
                'revenue': row['revenue'],
            })
        return Response(result)


class ProductTrendView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        """
        Get sales trend for products over the last 3 years.
        Optional query param: product_id (if omitted, aggregates all products)
        """
        from django.utils import timezone
        import datetime

        product_id = request.query_params.get('product_id')
        now = timezone.now()
        three_years_ago = now - datetime.timedelta(days=365 * 3)

        qs = OrderItem.objects.filter(
            order__status__in=[Order.Status.PAID, Order.Status.DELIVERED],
            order__created_at__gte=three_years_ago
        )

        if product_id:
            qs = qs.filter(variant__product_id=product_id)

        # Group by Year
        qs = qs.annotate(year=TruncYear('order__created_at'))
        agg = qs.values('year').annotate(
            total_sold=Sum('quantity'),
            total_revenue=Sum('line_total')
        ).order_by('year')

        # Calculate simple growth rate
        data = list(agg)
        for i in range(1, len(data)):
            prev = data[i-1]
            curr = data[i]
            if prev['total_revenue'] > 0:
                growth = ((curr['total_revenue'] - prev['total_revenue']) / prev['total_revenue']) * 100
                curr['growth_percentage'] = round(growth, 2)
            else:
                curr['growth_percentage'] = 100 if curr['total_revenue'] > 0 else 0

        return Response(data)