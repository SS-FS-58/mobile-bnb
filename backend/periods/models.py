from django.db import models
from mobiles.models import Mobile


class AvailabilityPeriod(models.Model):
    mobile = models.ForeignKey(Mobile, on_delete=models.CASCADE)
    begindate = models.DateField()
    enddate = models.DateField()


class BlockingPeriod(models.Model):
    mobile = models.ForeignKey(Mobile, on_delete=models.CASCADE)
    begindate = models.DateField()
    enddate = models.DateField()
