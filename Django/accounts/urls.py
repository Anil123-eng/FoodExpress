from django.urls import path
from .views import RestaurantListCreateView, RestaurantDetailView


urlpatterns = [
    path('restaurants/', RestaurantListCreateView.as_view(), name='restaurants'),
    path('restaurants/<int:pk>/', RestaurantDetailView.as_view(), name='restaurant-detail'),
]