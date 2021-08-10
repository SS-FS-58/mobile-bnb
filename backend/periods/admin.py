from django.contrib import admin
from periods.models import AvailabilityPeriod, BlockingPeriod

# Register your models here.
admin.site.register(AvailabilityPeriod)
admin.site.register(BlockingPeriod)
