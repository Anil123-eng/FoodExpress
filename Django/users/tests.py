
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status


class UserAPITests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPassword123!'
        )

        self.register_url = '/api/register/'
        self.login_url = '/api/login/'
        self.me_url = '/api/me/'
        self.profile_url = '/api/update-profile/'
        self.password_url = '/api/change-password/'
        self.delete_url = '/api/delete-account/'

    def test_user_can_register(self):
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'StrongPassword123!'
        }

        response = self.client.post(self.register_url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            User.objects.filter(username='newuser').exists()
        )

    def test_registration_requires_email(self):
        data = {
            'username': 'noemailuser',
            'password': 'StrongPassword123!'
        }

        response = self.client.post(self.register_url, data)

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )
    
    def test_duplicate_username_is_rejected(self):
        data = {
            'username': 'testuser',
            'email': 'another@example.com',
            'password': 'StrongPassword123!'
        }

        response = self.client.post(self.register_url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_can_login(self):
        data = {
            'username': 'testuser',
            'password': 'TestPassword123!'
        }

        response = self.client.post(self.login_url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_authenticated_user_can_view_profile(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get(self.me_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

    def test_unauthenticated_user_cannot_view_profile(self):
        response = self.client.get(self.me_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

    def test_user_can_update_email(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.put(
            self.profile_url,
            {'email': 'updated@example.com'}
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, 'updated@example.com')

    def test_invalid_email_is_rejected(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.put(
            self.profile_url,
            {'email': 'invalid-email'}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

        self.user.refresh_from_db()
        self.assertEqual(self.user.email, 'test@example.com')

    def test_duplicate_email_is_rejected(self):
        User.objects.create_user(
            username='anotheruser',
            email='taken@example.com',
            password='AnotherPassword123!'
        )

        self.client.force_authenticate(user=self.user)

        response = self.client.put(
            self.profile_url,
            {'email': 'taken@example.com'}
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_can_change_password(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.put(
            self.password_url,
            {
                'current_password': 'TestPassword123!',
                'new_password': 'NewStrongPassword456!'
            }
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertTrue(
            self.user.check_password('NewStrongPassword456!')
        )

    def test_wrong_current_password_is_rejected(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.put(
            self.password_url,
            {
                'current_password': 'WrongPassword123!',
                'new_password': 'NewStrongPassword456!'
            }
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_weak_new_password_is_rejected(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.put(
            self.password_url,
            {
                'current_password': 'TestPassword123!',
                'new_password': '123'
            }
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_account_deletion_requires_correct_password(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.delete(
            self.delete_url,
            {'current_password': 'WrongPassword123!'}
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_user_can_delete_account(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.delete(
            self.delete_url,
            {'current_password': 'TestPassword123!'}
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(User.objects.filter(username='testuser').exists())
