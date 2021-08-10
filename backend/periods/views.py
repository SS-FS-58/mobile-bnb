import datetime
from itertools import chain
from periods.models import AvailabilityPeriod, BlockingPeriod
from rest_framework import viewsets
from rest_framework import permissions
from periods.serializers import AvailabilityPeriodSerializer, BlockingPeriodSerializer
from django.http import JsonResponse
from django.http.request import QueryDict
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.db.models import Q
import json

def date2String(date):
    return datetime.datetime.strftime(date, "%Y-%m-%d")

def GetChangedDate(date, days):
    date = datetime.datetime.strptime(date, "%Y-%m-%d")
    date = date + datetime.timedelta(days=days)
    return date


def getPeriodList(request):
    mobile = request.GET.get('mobile', 0)
    beginDate = GetChangedDate(request.GET.get('begindate', ''), -30)
    endDate = GetChangedDate(request.GET.get('enddate', ''), 30)

    searchedPeriods1 = []
    searchedPeriods2 = []
    if beginDate != '' and endDate != '':
        searchedPeriods1 = AvailabilityPeriod.objects.filter(mobile=mobile, begindate__gte=beginDate,
                                                             begindate__lte=endDate).order_by('id')
        searchedPeriods2 = BlockingPeriod.objects.filter(mobile=mobile, begindate__gte=beginDate,
                                                         begindate__lte=endDate).order_by('id')

    periodList = []

    for item in searchedPeriods1:
        periodList.append({
            "id": item.id,
            "title": "Availability",
            "start": date2String(item.begindate) + " 00:00:00",
            "end": date2String(item.enddate) + " 23:59:00",
        })

    for item in searchedPeriods2:
        periodList.append({
            "id": item.id,
            "title": "Blocking",
            "start": date2String(item.begindate) + " 00:00:00",
            "end": date2String(item.enddate) + " 23:59:00",
        })
    return JsonResponse({
        "results": periodList,
    })


def deleteExistingPeriods(request):
    mobile = request.GET.get('mobile', 0)
    AvailabilityPeriod.objects.filter(mobile=mobile).delete()
    BlockingPeriod.objects.filter(mobile=mobile).delete()
    return JsonResponse({
        "results": {"statusText": 'Deleted'},
    })


def checkValidPeriodExist(request):
    mobile = request.GET.get('mobile', 0)
    beginDate = request.GET.get('begindate', '')
    endDate = request.GET.get('enddate', '')
    mode = request.GET.get('mode', '1')
    period = request.GET.get('periodid', 0)
    valid = True

    searchedPeriods1 = []
    searchedPeriods2 = []
    otherModeRecordCount = 0
    sameModeRecordCount = 0

    if beginDate != '' and endDate != '':
        if mode == '1':
            searchedPeriods1 = AvailabilityPeriod.objects.filter(
                Q(Q(begindate__lte=beginDate, enddate__gte=beginDate) |
                  Q(begindate__lte=endDate, enddate__gte=endDate)) &
                ~Q(id=period) &
                Q(mobile=mobile)
            )
            searchedPeriods2 = BlockingPeriod.objects.filter(
                Q(mobile=mobile)
            )
            otherModeRecordCount = searchedPeriods2.count()
            sameModeRecordCount = searchedPeriods1.count()

            print(otherModeRecordCount, sameModeRecordCount)

        elif mode == '0':
            searchedPeriods1 = AvailabilityPeriod.objects.filter(
                Q(mobile=mobile)
            )
            searchedPeriods2 = BlockingPeriod.objects.filter(
                Q(Q(begindate__lte=beginDate, enddate__gte=beginDate) |
                  Q(begindate__lte=endDate, enddate__gte=endDate)) &
                ~Q(id=period) &
                Q(mobile=mobile)
            )
            otherModeRecordCount = searchedPeriods1.count()
            sameModeRecordCount = searchedPeriods2.count()

    if otherModeRecordCount > 0 or sameModeRecordCount > 0:
        valid = False

    return JsonResponse({
        "results": {"valid": valid},
    })


class AvailabilityPeriodViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows mobiles to be viewed or edited.
    """
    queryset = AvailabilityPeriod.objects.all()
    serializer_class = AvailabilityPeriodSerializer
    permission_classes = [permissions.IsAuthenticated]


class BlockingPeriodViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows mobiles to be viewed or edited.
    """
    queryset = BlockingPeriod.objects.all()
    serializer_class = BlockingPeriodSerializer
    permission_classes = [permissions.IsAuthenticated]
