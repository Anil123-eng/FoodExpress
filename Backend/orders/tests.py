
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from menu.models import MenuItem
from cart.models import CartItem
from .models import Order, OrderItem


class OrdersAPITests(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.user1 = User.objects.create_user(
            username="order_user1",
            password="TestPassword123!"
        )

        self.user2 = User.objects.create_user(
            username="order_user2",
            password="TestPassword123!"
        )

        self.admin = User.objects.create_user(
            username="order_admin",
            password="TestPassword123!",
            is_staff=True
        )

        self.menu_item = MenuItem.objects.create(
            name="Test Chicken 65",
            category="Starters",
            description="Test item",
            price="150.00"
        )

        self.order = Order.objects.create(
            user=self.user1,
            total_amount="300.00"
        )

        OrderItem.objects.create(
            order=self.order,
            menu_item=self.menu_item,
            quantity=2,
            price="150.00"
        )

    def test_user_can_view_own_orders(self):
        self.client.force_authenticate(user=self.user1)

        response = self.client.get("/api/orders/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_user_cannot_view_another_users_order(self):
        self.client.force_authenticate(user=self.user2)

        response = self.client.get(
            f"/api/orders/{self.order.id}/"
        )

        self.assertEqual(response.status_code, 404)

    def test_customer_cannot_update_order(self):
        self.client.force_authenticate(user=self.user1)

        response = self.client.patch(
            f"/api/orders/{self.order.id}/",
            {"status": "confirmed"},
            format="json"
        )

        self.assertEqual(response.status_code, 403)

    def test_customer_cannot_delete_order(self):
        self.client.force_authenticate(user=self.user1)

        response = self.client.delete(
            f"/api/orders/{self.order.id}/"
        )

        self.assertEqual(response.status_code, 403)

    def test_checkout_creates_order_and_clears_cart(self):
        CartItem.objects.create(
            user=self.user1,
            menu_item=self.menu_item,
            quantity=2
        )

        self.client.force_authenticate(user=self.user1)

        response = self.client.post("/api/checkout/")

        self.assertEqual(response.status_code, 201)

        checkout_order = Order.objects.get(
            id=response.data["id"]
        )

        self.assertEqual(
            checkout_order.total_amount,
            300
        )

        self.assertEqual(
            checkout_order.items.count(),
            1
        )

        self.assertFalse(
            CartItem.objects.filter(user=self.user1).exists()
        )

    def test_checkout_rejects_empty_cart(self):
        self.client.force_authenticate(user=self.user2)

        response = self.client.post("/api/checkout/")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["detail"],
            "Your cart is empty."
        )
