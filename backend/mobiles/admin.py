from django.contrib import admin
from .models import Mobile
from .models import Photo


class PhotoInline(admin.TabularInline):
    model = Photo
    extra = 3


class MobileAdmin(admin.ModelAdmin):
    inlines = [PhotoInline, ]


# Register your models here.
admin.site.register(Mobile, MobileAdmin)
