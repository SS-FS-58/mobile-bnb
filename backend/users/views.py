from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework import generics
from django.http import HttpResponse, HttpResponseBadRequest

from .models import CustomUser
from .serializers import UserSerializer


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def partial_update(self, request, *args, **kwargs):
        user = self.get_object()
        user_serializer = UserSerializer(user, data=request.data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()
            return HttpResponse(user_serializer.data)
        else:
            return HttpResponseBadRequest()
