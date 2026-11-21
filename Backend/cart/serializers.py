
from rest_framework import serializers
from .models import CartItem


class CartItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(
        source='menu_item.name',
        read_only=True
    )

    menu_item_price = serializers.DecimalField(
        source='menu_item.price',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    menu_item_image = serializers.ImageField(
        source='menu_item.image',
        read_only=True
    )

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError(
                "Quantity must be at least 1."
            )
        return value

    class Meta:
        model = CartItem
        fields = [
            'id',
            'user',
            'menu_item',
            'menu_item_name',
            'menu_item_price',
            'menu_item_image',
            'quantity',
        ]
        extra_kwargs = {
            'user': {'read_only': True}
        }
