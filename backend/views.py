import random
from django.http import JsonResponse
from django.middleware.csrf import get_token

from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework.decorators import api_view
import logging
import urllib.request
import os
from rest_framework.response import Response

from users.models import CustomUser
from mobiles.models import Mobile
from faker import Faker


def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})


def ping(request):
    return JsonResponse({'result': 'OK'})


@csrf_exempt
def check_url(request):
    try:
        url_status = urllib.request.urlopen(request.body.decode("utf-8")).getcode()
    except:
        return HttpResponse(":( Url is Not Working")
    if url_status == 200:
        return HttpResponse("Yey! URL is Working")
    return HttpResponse(":( Url is Not Working")


@csrf_exempt
def generate_fake_data(request):
    faker = Faker()
    amount = int(request.GET.get('amount'))
    userList = []
    mobileList = []
    if amount is not None:
        for _ in range(amount):
            new_user = CustomUser()
            profile = faker.simple_profile()
            new_user.first_name = faker.first_name()
            new_user.last_name = faker.last_name()
            new_user.email = profile['mail']
            new_user.date_of_birth = profile['birthdate']

            new_user.save()

            userList.append({
                "pk": new_user.pk,
                "first_name": new_user.first_name,
                "last_name": new_user.last_name,
                "email": new_user.email,
                "date_of_birth": new_user.date_of_birth,
            })

            new_mobile = Mobile()
            new_mobile.name = faker.word()
            new_mobile.description = faker.text()
            new_mobile.user = new_user
            new_mobile.location = faker.city()
            new_mobile.save()

            mobileList.append({
                "name": new_mobile.name,
                "description": new_mobile.description,
                "user": new_user.pk,
                "location": new_mobile.location,
                "state": new_mobile.state
            })

    return JsonResponse({
        "users": userList,
        "mobiles": mobileList
    })


class FrontendAppView(View):
    """
    Serves the compiled frontend entry point (only works if you have run `yarn
    run build`).
    """

    def get(self, request):
        print(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html'))
        try:
            with open(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            logging.exception('Production build of app not found')
            return HttpResponse(
                """
                This URL is only used when you have built the production
                version of the app. Visit http://localhost:3000/ instead, or
                run `yarn run build` to test the production version.
                """,
                status=501,
            )
