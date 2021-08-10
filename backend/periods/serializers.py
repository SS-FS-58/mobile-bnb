from rest_framework import serializers
from .models import AvailabilityPeriod, BlockingPeriod


class AvailabilityPeriodSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    start = serializers.CharField(source='begindate')
    end = serializers.CharField(source='enddate')

    class Meta:
        model = AvailabilityPeriod
        fields = ['id', 'mobile', 'start', 'end', 'title']

    def get_title(self, obj):
        return "Availability"


class BlockingPeriodSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    start = serializers.CharField(source='begindate')
    end = serializers.CharField(source='enddate')

    class Meta:
        model = BlockingPeriod
        fields = ['id', 'mobile', 'start', 'end', 'title']

    def get_title(self, obj):
        return "Blocking"
