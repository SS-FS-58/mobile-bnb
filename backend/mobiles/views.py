from itertools import chain
import datetime
from mobiles.models import Mobile
from periods.models import AvailabilityPeriod, BlockingPeriod
from rest_framework import viewsets
from rest_framework import permissions
from mobiles.serializers import MobileSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.http import HttpResponse, HttpResponseBadRequest
from django.db.models import Q


def string2Date(dateString):
    return datetime.datetime.strptime(dateString, "%Y-%m-%d").date()


def date2String(date):
    return datetime.datetime.strftime(date, "%Y-%m-%d")


def getChangedDate(date, days):
    date = string2Date(date)
    date = date + datetime.timedelta(days=days)
    return date2String(date)


def checkPerfectPeriod(mobileId, beginDate, endDate, mode):
    if mode == 1:
        searchedPeriod = AvailabilityPeriod.objects.filter(
            Q(mobile_id=mobileId,
              enddate__gte=beginDate,
              begindate__lte=endDate)
        ).order_by('begindate')
    else:
        searchedPeriod = BlockingPeriod.objects.filter(
            Q(mobile_id=mobileId,
              enddate__gte=beginDate,
              begindate__lte=endDate)
        ).order_by('begindate')
    length = len(searchedPeriod)
    check = False
    if length == 1:
        return False

    if length >= 2:
        check = checkTightPeriod(searchedPeriod, length, beginDate, endDate)

    return check


def checkTightPeriod(periods, lengthRec, beginDate, endDate):
    inx = 0
    prevItem = None

    for item in periods:
        inx += 1
        if inx == 1:
            if item.begindate > string2Date(beginDate):
                return False
        if inx == lengthRec:
            if item.enddate < string2Date(endDate):
                return False
        if prevItem is not None:
            if getChangedDate(date2String(prevItem.enddate), 1) != date2String(item.begindate):
                return False
        prevItem = item
    return True


def getMobileList(request):
    location = request.GET.get('location', '')
    page = request.GET.get('page', 1)
    items = request.GET.get('items', 10)
    beginDate = request.GET.get('begindate', '')
    endDate = request.GET.get('enddate', '')

    searchedMobiles = []
    searchedMobilesAvailableExact = []
    searchedMobilesAvailableIntersect = []
    searchedMobilesOfBlockingIntersect = []
    searchedMobilesOfBlockingAll = []
    if beginDate != '' and endDate != '':
        # find mobiles contains exact available periods which have beginDate and endDate
        searchedMobilesAvailableExact = Mobile.objects.filter(
            Q(location__icontains=location,
              availabilityperiod__begindate__lte=beginDate,
              availabilityperiod__enddate__gte=endDate))

        # find mobiles contains available periods which have even one day between beginDate and endDate
        searchedMobilesAvailableIntersect = Mobile.objects.filter(
            Q(location__icontains=location,
              availabilityperiod__enddate__gte=beginDate,
              availabilityperiod__begindate__lte=endDate)
        ).order_by('id')

        # find mobiles contains blocking periods which have even one day between beginDate and endDate
        searchedMobilesOfBlockingIntersect = Mobile.objects.filter(
            Q(location__icontains=location,
              blockingperiod__enddate__gte=beginDate,
              blockingperiod__begindate__lte=beginDate) |
            Q(location__icontains=location,
              blockingperiod__enddate__gte=endDate,
              blockingperiod__begindate__lte=endDate)
        ).order_by('id')

        # find all mobiles contains location
        searchedMobilesOfBlockingAll = Mobile.objects.filter(
            Q(location__icontains=location,
              blockingperiod__id__gt=0)
        ).order_by('id')

    else:
        searchedMobiles = Mobile.objects.filter(location__icontains=location).order_by('id')

    searchedMobiles = list(chain(searchedMobiles, searchedMobilesAvailableExact))

    keyList1 = {}
    keyList2 = {}
    keyList3 = {}
    mobileList = []
    # we have to find mobiles has tight available period
    # 1-5,6-10,11-20 => tight
    # 1-3, 5-7 => not tight
    for item in searchedMobilesAvailableIntersect:
        if item.id not in keyList1:
            keyList1[item.id] = 1
            if checkPerfectPeriod(item.id, beginDate, endDate, 1):
                searchedMobiles.append(item)

    # find mobiles to be removed from searchedMobilesOfBlockingAll
    for item in searchedMobilesOfBlockingIntersect:
        if item.id not in keyList2:
            keyList2[item.id] = 1

    # add mobiles to searchedMobiles from searchedMobilesOfBlockingAll except searchedMobilesOfBlockingIntersect
    for item in searchedMobilesOfBlockingAll:
        if item.id not in keyList3 and item.id not in keyList2:
            keyList3[item.id] = 1
            searchedMobiles.append(item)

    for item in searchedMobiles:
        mobileList.append({
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "user": item.user.pk,
            "location": item.location,
        })

    paginator = Paginator(searchedMobiles, items)
    searchedMobiles = paginator.page(page)

    return JsonResponse({
        "mobiles": mobileList[((int(page) - 1) * items):(int(page) * items - 1)],
        "page": page,
        "items": items,
        "totalPages": paginator.num_pages,
        "totalItems": paginator.count,
    })


class MobileViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows mobiles to be viewed or edited.
    """
    queryset = Mobile.objects.all()
    serializer_class = MobileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def partial_update(self, request, *args, **kwargs):
        mobile = self.get_object()
        mobile_serializer = MobileSerializer(mobile, data=request.data, partial=True)
        if mobile_serializer.is_valid():
            mobile_serializer.save()
            return HttpResponse(mobile_serializer.data)
        else:
            return HttpResponseBadRequest()
