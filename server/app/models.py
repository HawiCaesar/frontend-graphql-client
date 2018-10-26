from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class Store(models.Model):
    name = models.TextField()
    owner = models.ForeignKey(User, models.PROTECT, related_name='stores')


class Product(models.Model):
    store = models.ForeignKey(Store, models.CASCADE, related_name='products')
    name = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)


class Order(models.Model):
    date = models.DateTimeField(default=timezone.now)
    store = models.ForeignKey(Store, models.CASCADE, related_name='orders')
    ordered_by = models.ForeignKey(User, models.CASCADE, related_name='orders')


class OrderItem(models.Model):
    order = models.ForeignKey(Order, models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, models.CASCADE, related_name='order_items')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
