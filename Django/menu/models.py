from django.db import models


class MenuItem(models.Model):
    restaurant = models.ForeignKey(
        'accounts.Restaurant',
        on_delete=models.CASCADE,
        related_name='menu_items',
        null=True,
        blank=True
    )
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100, default='Other')
    image = models.ImageField(upload_to='menu/', null=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name