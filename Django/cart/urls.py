from django.urls import path
from .views import CartItemListCreateView, CartItemDetailView


urlpatterns = [
    path('cart/', CartItemListCreateView.as_view(), name='cart'),
    path('cart/<int:pk>/', CartItemDetailView.as_view(), name='cart-detail'),
]