from django.urls import path
from .views import MenuItemListCreateView, MenuItemDetailView


urlpatterns = [
    path('menu-items/', MenuItemListCreateView.as_view(), name='menu-items'),
    path('menu-items/<int:pk>/', MenuItemDetailView.as_view(), name='menu-item-detail'),
]