
from io import BytesIO

from PIL import Image

from django.test import TestCase
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile

from rest_framework.test import APIClient

from .models import MenuItem


class MenuAPITests(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.customer = User.objects.create_user(
            username="test_customer",
            password="TestPassword123!"
        )

        self.admin = User.objects.create_user(
            username="test_admin",
            password="TestPassword123!",
            is_staff=True
        )

        self.menu_url = "/api/menu-items/"

        self.menu_data = {
            "name": "Test Chicken 65",
            "category": "Starters",
            "description": "Test menu item",
            "price": "150.00",
            "is_available": True
        }

    def create_test_image(self, image_format="JPEG", size=(100, 100)):
        image = Image.new("RGB", size, color="red")
        image_buffer = BytesIO()
        image.save(image_buffer, format=image_format)
        image_buffer.seek(0)

        extension = image_format.lower()

        return SimpleUploadedFile(
            f"test_image.{extension}",
            image_buffer.read(),
            content_type=f"image/{extension}"
        )

    def test_anyone_can_view_menu_items(self):
        response = self.client.get(self.menu_url)
        self.assertEqual(response.status_code, 200)

    def test_customer_cannot_create_menu_item(self):
        self.client.force_authenticate(user=self.customer)

        response = self.client.post(
            self.menu_url,
            self.menu_data,
            format="json"
        )

        self.assertEqual(response.status_code, 403)

    def test_admin_can_create_menu_item(self):
        self.client.force_authenticate(user=self.admin)

        response = self.client.post(
            self.menu_url,
            self.menu_data,
            format="json"
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            MenuItem.objects.filter(name="Test Chicken 65").exists()
        )

    def test_zero_price_is_rejected(self):
        self.client.force_authenticate(user=self.admin)

        invalid_data = self.menu_data.copy()
        invalid_data["price"] = "0.00"

        response = self.client.post(
            self.menu_url,
            invalid_data,
            format="json"
        )

        self.assertEqual(response.status_code, 400)

    def test_admin_can_upload_valid_jpeg_image(self):
        self.client.force_authenticate(user=self.admin)

        data = self.menu_data.copy()
        data["image"] = self.create_test_image("JPEG")

        response = self.client.post(
            self.menu_url,
            data,
            format="multipart"
        )

        self.assertEqual(response.status_code, 201)

    def test_image_larger_than_5mb_is_rejected(self):
        self.client.force_authenticate(user=self.admin)

        data = self.menu_data.copy()
        data["image"] = self.create_test_image(
            "BMP",
            size=(1400, 1400)
        )

        self.assertGreater(data["image"].size, 5 * 1024 * 1024)

        response = self.client.post(
            self.menu_url,
            data,
            format="multipart"
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("image", response.data)

    def test_unsupported_image_format_is_rejected(self):
        self.client.force_authenticate(user=self.admin)

        data = self.menu_data.copy()
        data["image"] = self.create_test_image("BMP")

        response = self.client.post(
            self.menu_url,
            data,
            format="multipart"
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("image", response.data)
