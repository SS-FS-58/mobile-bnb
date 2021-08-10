from rest_framework import serializers

from .models import Mobile
from .models import Photo
import logging

logger = logging.getLogger(__name__)


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ('photo',)

    def get_photo_url(self, obj):
        return obj.photo.url


class MobileSerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(source='photo_set', many=True, read_only=True)

    class Meta:
        model = Mobile
        fields = ['id', 'name', 'description', 'user', 'location', 'photos']

    def create(self, validated_data):
        photos_data = self.context.get('view').request.FILES
        mobile = Mobile.objects.create(**validated_data)

        for i in photos_data.getlist('photos'):
            Photo.objects.create(
                mobile=mobile,
                photo=i
            )
        return mobile
