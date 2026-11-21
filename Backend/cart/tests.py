
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from menu.models import MenuItem
from .models import CartItem


class CartAPITests(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.user1 = User.objects.create_user(
            username="cart_user1",
            password="TestPassword123!"
        )

        self.user2 = User.objects.create_user(
            username="cart_user2",
            password="TestPassword123!"
        )

        self.menu_item = MenuItem.objects.create(
            name="Test Chicken 65",
            category="Starters",
            description="Test item",
            price="150.00"
        )

        self.cart_item = CartItem.objects.create(
            user=self.user1,
            menu_item=self.menu_item,
            quantity=2
        )

        self.cart_url = "/api/cart/"

    def test_user_can_view_own_cart(self):
        self.client.force_authenticate(user=self.user1)

        response = self.client.get(self.cart_url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_user_cannot_view_another_users_cart(self):
        self.client.force_authenticate(user=self.user2)

        response = self.client.get(
            f"/api/cart/{self.cart_item.id}/"
        )

        self.assertEqual(response.status_code, 404)

    def test_user_cannot_assign_cart_item_to_another_user(self):
        self.client.force_authenticate(user=self.user2)

        response = self.client.post(
            self.cart_url,
            {
                "user": self.user1.id,
                "menu_item": self.menu_item.id,
                "quantity": 1
            },
            format="json"
        )

        self.assertEqual(response.status_code, 201)

        new_item = CartItem.objects.get(id=response.data["id"])
        self.assertEqual(new_item.user, self.user2)

    def test_zero_quantity_is_rejected(self):
        self.client.force_authenticate(user=self.user1)

        response = self.client.post(
            self.cart_url,
            {
                "menu_item": self.menu_item.id,
                "quantity": 0
            },
            format="json"
        )

        self.assertEqual(response.status_code, 400)
