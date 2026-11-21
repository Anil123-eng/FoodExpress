from django.db import models


class Restaurant(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=15)
    is_open = models.BooleanField(default=True)

    def __str__(self):
        return self.name