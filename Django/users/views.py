
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RegisterSerializer
from django.core.validators import validate_email



class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'username': request.user.username,
            'email': request.user.email,
        })
        

class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        email = request.data.get('email', request.user.email)

        if email:
            try:
                validate_email(email)
            except ValidationError:
                return Response({
                    'message': 'Invalid email address.'
                }, status=400)

            if User.objects.filter(email__iexact=email).exclude(
                id=request.user.id
            ).exists():
                return Response({
                    'message': 'This email address is already registered.'
                }, status=400)

        request.user.email = email
        request.user.save()

        return Response({
            'message': 'Profile updated successfully.',
            'username': request.user.username,
            'email': request.user.email,
        })



class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not current_password or not new_password:
            return Response({
                'message': 'Current password and new password are required.'
            }, status=400)

        if not request.user.check_password(current_password):
            return Response({
                'message': 'Current password is incorrect.'
            }, status=400)

        try:
            validate_password(new_password, request.user)
        except ValidationError as error:
            return Response({
                'message': error.messages
            }, status=400)

        request.user.set_password(new_password)
        request.user.save()

        return Response({
            'message': 'Password changed successfully.'
        })

    


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        current_password = request.data.get('current_password')

        if not current_password:
            return Response({
                'message': 'Current password is required.'
            }, status=400)

        if not request.user.check_password(current_password):
            return Response({
                'message': 'Current password is incorrect.'
            }, status=400)

        request.user.delete()

        return Response({
            'message': 'Account deleted successfully.'
        })
