from .views import AvailabilityPeriodViewSet, BlockingPeriodViewSet
from rest_framework.routers import DefaultRouter
from django.urls import path, include

router = DefaultRouter()
router.register(r'1', AvailabilityPeriodViewSet)
router.register(r'2', BlockingPeriodViewSet)

urlpatterns = router.urls
