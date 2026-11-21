
from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(
        source='menu_item.name',
        read_only=True
    )

    menu_item_image = serializers.ImageField(
        source='menu_item.image',
        read_only=True
    )

    class Meta:
        model = OrderItem
        fields = [
            'id',
            'order',
            'menu_item',
            'menu_item_name',
            'menu_item_image',
            'quantity',
            'price',
        ]
        read_only_fields = [
            'id',
            'order',
            'menu_item',
            'price',
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'user',
            'total_amount',
            'status',
            'created_at',
            'items',
        ]
        read_only_fields = [
            'id',
            'user',
            'total_amount',
            'status',
            'created_at',
        ]
