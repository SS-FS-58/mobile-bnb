from django.db import models
from users.models import CustomUser
import django_filters


class Mobile(models.Model):
    name = models.CharField(max_length=250, unique=True)
    description = models.TextField(max_length=5000)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    location = models.CharField(max_length=255, default='')


class Photo(models.Model):
    mobile = models.ForeignKey(Mobile, related_name='photos', on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='photos', default='default.jpg')
