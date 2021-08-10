from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _
from django.core.validators import MinLengthValidator

from .managers import CustomUserManager


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    first_name = models.CharField(blank=False, max_length=100, validators=[MinLengthValidator(1)])
    last_name = models.CharField(blank=False, max_length=100, validators=[MinLengthValidator(1)])
    date_of_birth = models.DateField(blank=True, null=True)
    is_host = models.BooleanField(default=False)

    def __str__(self):
        return self.email
