
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status

from .models import Restaurant


class RestaurantAPITests(APITestCase):

    def setUp(self):
        self.customer = User.objects.create_user(
            username='customer',
            password='TestPassword123!'
        )

        self.admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='AdminPassword123!'
        )

        self.restaurant = Restaurant.objects.create(
            name='FoodExpress Restaurant',
            description='Test restaurant',
            city='Hyderabad',
            address='Madhapur',
            phone='9876543210',
            is_open=True
        )

        self.list_url = '/api/restaurants/'
        self.detail_url = f'/api/restaurants/{self.restaurant.id}/'

    def test_anyone_can_view_restaurant_list(self):
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_anyone_can_view_restaurant_details(self):
        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data['name'],
            'FoodExpress Restaurant'
        )

    def test_customer_cannot_create_restaurant(self):
        self.client.force_authenticate(user=self.customer)

        data = {
            'name': 'New Restaurant',
            'description': 'Another restaurant',
            'city': 'Hyderabad',
            'address': 'Gachibowli',
            'phone': '9876543211',
            'is_open': True
        }

        response = self.client.post(self.list_url, data)

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

    def test_admin_can_create_restaurant(self):
        self.client.force_authenticate(user=self.admin)

        data = {
            'name': 'Admin Restaurant',
            'description': 'Created by admin',
            'city': 'Hyderabad',
            'address': 'Kukatpally',
            'phone': '9876543212',
            'is_open': True
        }

        response = self.client.post(self.list_url, data)

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

    def test_customer_cannot_update_restaurant(self):
        self.client.force_authenticate(user=self.customer)

        response = self.client.patch(
            self.detail_url,
            {'name': 'Updated Restaurant'}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

    def test_customer_cannot_delete_restaurant(self):
        self.client.force_authenticate(user=self.customer)

        response = self.client.delete(self.detail_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )
