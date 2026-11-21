
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from django.db import transaction

from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import CartItem


class OrderListCreateView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()

        return Order.objects.filter(user=self.request.user)


class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [IsAuthenticated()]

        return [IsAdminUser()]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()

        return Order.objects.filter(user=self.request.user)


class CheckoutView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        cart_items = CartItem.objects.filter(user=request.user)

        if not cart_items.exists():
            return Response(
                {"detail": "Your cart is empty."},
                status=400
            )

        with transaction.atomic():
            total_amount = sum(
                item.menu_item.price * item.quantity
                for item in cart_items
            )

            order = Order.objects.create(
                user=request.user,
                total_amount=total_amount,
                status='pending'
            )

            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    menu_item=item.menu_item,
                    quantity=item.quantity,
                    price=item.menu_item.price
                )

            cart_items.delete()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=201)
