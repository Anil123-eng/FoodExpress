
from rest_framework import serializers
from .models import Restaurant


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = [
            'id',
            'name',
            'description',
            'city',
            'address',
            'phone',
            'is_open'
        ]
        read_only_fields = ['id']
