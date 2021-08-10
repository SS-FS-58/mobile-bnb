"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from allauth.account.views import confirm_email
from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from mobiles.views import MobileViewSet, getMobileList
from users.views import UserViewSet
from periods.views import AvailabilityPeriodViewSet, BlockingPeriodViewSet, getPeriodList, checkValidPeriodExist, \
    deleteExistingPeriods
from views import check_url, FrontendAppView, generate_fake_data
from mobiles.models import Mobile
from django_filters.views import object_filter
from periods import views

router = routers.DefaultRouter()
router.register(r'mobiles', MobileViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^rest-auth/registration/', include('rest_auth.registration.urls')),
    url(r'^account/', include('allauth.urls')),
    url(r'^accounts-rest/registration/account-confirm-email/(?P<key>.+)/$', confirm_email,
        name='account_confirm_email'),
    url(r'^admin/generate_fake_mobiles/$', generate_fake_data),
    url(r'^mobiles/search$', getMobileList),
    url(r'^periods/search$', getPeriodList),
    url(r'^periods/valid$', checkValidPeriodExist),
    url(r'^periods/delete$', deleteExistingPeriods),
    url(r'^mobiles/(?P<pk>[^/.]+)/periods/', include('periods.urls')),
    path('', include(router.urls))
]
