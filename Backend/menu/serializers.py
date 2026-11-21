
from rest_framework import serializers
from .models import MenuItem
from decimal import Decimal

class MenuItemSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=Decimal("0.01")
    )

    image = serializers.ImageField(
        required=False,
        allow_null=True
    )

    class Meta:
        model = MenuItem
        fields = [
            'id',
            'restaurant',
            'name',
            'category',
            'image',
            'description',
            'price',
            'is_available'
        ]
        read_only_fields = ['id']

    def validate_image(self, value):
        if value is None:
            return value

        max_size = 5 * 1024 * 1024  # 5 MB

        if value.size > max_size:
            raise serializers.ValidationError(
                "Image size must not exceed 5 MB."
            )

        allowed_formats = ['JPEG', 'PNG', 'WEBP']

        if value.image.format not in allowed_formats:
            raise serializers.ValidationError(
                "Only JPEG, PNG, and WEBP images are allowed."
            )

        return value
