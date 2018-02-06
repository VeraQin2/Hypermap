# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, redirect, get_object_or_404
# Needed to manually create HttpResponse or raise an Http404 exception
from django.http import HttpResponse, Http404
from django.core.exceptions import ObjectDoesNotExist

# Helper function to guess a MIME type from a file name
from mimetypes import guess_type

from django.contrib.auth import login, authenticate
from django.core.urlresolvers import reverse
# decorator to use built-in authentication system
from django.contrib.auth.decorators import login_required
from django.contrib.auth.tokens import default_token_generator
# Used to send email from within Django
from django.core.mail import send_mail
import datetime
from channels import Group

from hypermap.models import *
from hypermap.forms import *

import httplib2
import os
from apiclient import discovery
from oauth2client import client
from oauth2client import tools
from oauth2client.file import Storage
import random
import json

try:
    import argparse
    flags = tools.argparser.parse_args([])
except ImportError:
    flags = None


import os
import logging
import httplib2

from googleapiclient.discovery import build
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseBadRequest
from django.http import HttpResponseRedirect
from team279 import settings
from oauth2client.contrib import xsrfutil
from oauth2client.client import flow_from_clientsecrets
from oauth2client.contrib.django_util.storage import DjangoORMStorage

# If modifying these scopes, delete your previously saved credentials
# at ~/.credentials/calendar-python-quickstart.json
SCOPES = 'https://www.googleapis.com/auth/calendar'
APPLICATION_NAME = 'Google Calendar API Quickstart'


FLOW = flow_from_clientsecrets(
    settings.GOOGLE_OAUTH2_CLIENT_SECRETS_JSON,
    scope=SCOPES,
    redirect_uri='https://hypermaap.com/hypermap/oauth2callback',
    prompt='consent')

@login_required
def auth_return(request):
    if not xsrfutil.validate_token(settings.SECRET_KEY, str(request.GET['state']), request.user):
        return  HttpResponseBadRequest()
    credential = FLOW.step2_exchange(request.GET)
    storage = DjangoORMStorage(CredentialsModel, 'id', request.user, 'credential')
    storage.put(credential)
    return HttpResponseRedirect("/")


def check_login(request):
    context = {}
    if request.user.is_authenticated():
        logedin = 1
    else:
        logedin = 0

    context['logedin'] = logedin
    return render(request, 'check_login.json', context, content_type='application/json')

@login_required
def home(request):
    context = {}
    if request.user.is_authenticated():
        logedin = True
    else:
        logedin = False
    context['logedin'] = logedin

    activities = Activity.objects.filter(user=request.user).order_by('event_date')
    context['activities'] = activities
    context['form'] = ActivityForm()
    markers = Activity.objects.all().order_by('-time')
    context['markers'] = markers

    storage = DjangoORMStorage(CredentialsModel, 'id', request.user, 'credential')
    credential = storage.get()
    if credential is None or credential.invalid == True:
        FLOW.params['state'] = xsrfutil.generate_token(settings.SECRET_KEY, request.user)
        authorize_url = FLOW.step1_get_authorize_url()
        return HttpResponseRedirect(authorize_url)
    else:
        http = httplib2.Http()
        http = credential.authorize(http)
        service = build("calendar", "v3", http=http)

        page_token = None
        calendar_list = service.calendarList().list(pageToken=page_token).execute()
        account = calendar_list['items'][0]['summary']
        account = account.split('@')

        context['account1'] = account[0]
        context['account2'] = account[1]
        context['user'] = request.user
        if not ActivityTag.objects.filter(tag="Study"):
            tag1 = ActivityTag(tag="Study")
            tag1.save()
        if not ActivityTag.objects.filter(tag="Music"):
            tag2 = ActivityTag(tag="Music")
            tag2.save()
        if not ActivityTag.objects.filter(tag="Sports"):
            tag3 = ActivityTag(tag="Sports")
            tag3.save()

        return render(request, 'hypermap/mainpage.html', context)

def register(request):
    context = {}

    form = RegistrationForm(request.POST)
    context['form_register'] = form
    if not form.is_valid():
        return HttpResponse(form.errors.as_json(), status = 200, content_type='application/json')

    new_user = User.objects.create_user(username = form.cleaned_data['username'], \
    	                                first_name = form.cleaned_data['firstname'], \
    	                                last_name = form.cleaned_data['lastname'], \
                                        password = form.cleaned_data['password1'],\
                                        email = form.cleaned_data['email'])
    new_user.is_active = False
    new_user.save()

    token = default_token_generator.make_token(new_user)

    email_body = """
Welcome to Hypermap. Please click the link below to verify your email address and complete the registration of your account:

  http://%s%s
""" % (request.get_host(),
       reverse('registration_confirmation', args=(new_user.username, token)))

    send_mail(subject="Verify your email address",
              message=email_body,
              from_email="ychen3@andrew.cmu.edu",
              recipient_list=[new_user.email])

    context['email'] = form.cleaned_data['email']
    return render(request, 'hypermap/registration_confirmation.html', context)

def registration_confirmation(request, username, token):
    try:
        user = User.objects.get(username=username)
    except ObjectDoesNotExist:
        raise Http404

    if not default_token_generator.check_token(user, token):
        raise Http404

    user.is_active = True
    user.save()

    login(request, user, backend='django.contrib.auth.backends.ModelBackend')
    return redirect(reverse('home'))


@login_required
def add_activity(request):
    context = {}
    if request.method == 'GET':
        return redirect(reverse('home'))

    new_activity = Activity(title=request.POST['title'], content=request.POST['content'],
                            user=request.user, 
                            event_date=request.POST['event_date'],
                            event_end_date=request.POST['event_end_date'],
                            event_time=request.POST['event_time'],
                            event_end_time=request.POST['event_end_time'],
                            lat=float(request.POST['lat']),
                            lng=float(request.POST['lng']),
                            address=request.POST['address'])
    if 'picture' in request.FILES:
        new_activity.picture = request.FILES['picture']
    if 'videos' in request.FILES:
        new_activity.videos = request.FILES['videos']
    new_activity.save()
    if 'tag1' in request.POST:
        tag1 = ActivityTag.objects.get(tag="Study")
        new_activity.tags.add(tag1)
    if 'tag2' in request.POST:
        tag2 = ActivityTag.objects.get(tag="Music")
        new_activity.tags.add(tag2)
    if 'tag3' in request.POST:
        tag3 = ActivityTag.objects.get(tag="Sports")
        new_activity.tags.add(tag3)
    new_activity.save()
    # Sets up data needed to generate the view, and generates the view
    context['activity'] = new_activity
    # renders the response using the calc.html template and the key-value pairs in the context dictionary
    res = {}
    con = {}
    con['id'] = new_activity.id
    con['html'] = new_activity.html()
    con['lat'] = new_activity.lat
    con['lng'] = new_activity.lng
    con['time'] = new_activity.event_date

    res['text'] = json.dumps(con)
    Group("all_user").send(res)

    return render(request, 'activity.json', context, content_type='application/json')


@login_required
def get_activity(request, activity_lat, activity_lng):
    context = {}
    this_act = Activity.objects.filter(lat__startswith=activity_lat[0:9], lng__startswith=activity_lng[0:9])
    if not this_act:
        context["err"] = 1
        return render(request, 'detailError.json', context, content_type='application/json')
    context['activity'] = this_act[0]
    return render(request, 'activity.json', context, content_type='application/json')


@login_required
def get_past(request):
    context = {}
    activities = Activity.objects.filter(event_date__lt=datetime.date.today()).order_by('event_date')
    context['activities'] = activities
    return render(request, 'act.json', context, content_type='application/json')

@login_required
def get_now(request):
    context = {}
    activities = Activity.objects.filter(event_date__startswith=datetime.date.today()).order_by('event_date')
    context['activities'] = activities
    return render(request, 'act.json', context, content_type='application/json')

@login_required
def get_future(request):
    context = {}
    activities = Activity.objects.filter(event_date__gt=datetime.date.today()).order_by('event_date')

    context['activities'] = activities
    return render(request, 'act.json', context, content_type='application/json')

@login_required
def get_tag_time(request, condition):
    context = {}
    activities = Activity.objects.none()
    if "past" in condition:
        activities = Activity.objects.filter(event_date__lt=datetime.date.today())
    if "present" in condition:
        activities = Activity.objects.filter(event_date__startswith=datetime.date.today())
    if "future" in condition:
        activities = Activity.objects.filter(event_date__gt=datetime.date.today())
    if "study" in condition:
        activities = Activity.objects.filter(id__in=activities, tags__tag="Study")
    if "music" in condition:
        activities = Activity.objects.filter(id__in=activities, tags__tag="Music")
    if "sports" in condition:
        activities = Activity.objects.filter(id__in=activities, tags__tag="Sports")
    context['activities'] = activities.order_by('-event_date')
    return render(request, 'act.json', context, content_type='application/json')


@login_required
def join_activity(request, activity_id):
    try:
        this_act = Activity.objects.get(id=activity_id)
    except ObjectDoesNotExist:
        raise Http404
    this_act.joinedBy.add(request.user)
    this_act.save()

    storage = DjangoORMStorage(CredentialsModel, 'id', request.user, 'credential')
    credential = storage.get()
    if credential is None or credential.invalid == True:
        FLOW.params['state'] = xsrfutil.generate_token(settings.SECRET_KEY, request.user)
        authorize_url = FLOW.step1_get_authorize_url()
        return HttpResponseRedirect(authorize_url)
    else:
        http = httplib2.Http()
        http = credential.authorize(http)
        service = build("calendar", "v3", http=http)

        this_act.calendar_event_id = str(random.randint(1, 9999999999))
        this_act.save()
        event = {
          'id': this_act.calendar_event_id,
          'summary': this_act.title,
          'location': this_act.address,
          'description': this_act.content,
          'start': {
            'dateTime': this_act.event_date.isoformat()+"T"+this_act.event_time.isoformat(),
            'timeZone': 'America/New_York',
          },
          'end': {
            'dateTime': this_act.event_end_date.isoformat()+"T"+this_act.event_end_time.isoformat(),
            'timeZone': 'America/New_York',
          },
        }
        event = service.events().insert(calendarId='primary', body=event).execute()
        return render(request, 'dump.json', content_type='application/json')

@login_required
def unjoin_activity(request, activity_id):
    try:
        this_act = Activity.objects.get(id=activity_id)
    except ObjectDoesNotExist:
        raise Http404

    storage = DjangoORMStorage(CredentialsModel, 'id', request.user, 'credential')
    credential = storage.get()
    if credential is None or credential.invalid == True:
        FLOW.params['state'] = xsrfutil.generate_token(settings.SECRET_KEY, request.user)
        authorize_url = FLOW.step1_get_authorize_url()
        return HttpResponseRedirect(authorize_url)
    else:
        http = httplib2.Http()
        http = credential.authorize(http)
        service = build("calendar", "v3", http=http)


        service.events().delete(calendarId='primary', eventId=this_act.calendar_event_id).execute()
        this_act.joinedBy.remove(request.user)
        this_act.save()
        return render(request, 'dump.json', content_type='application/json')

@login_required
def getChartData(request):
    context = {}
    joinedActLen = []
    for i in range(7):
        joinedActLen.append(len(Activity.objects.filter(joinedBy=request.user, event_date__startswith=datetime.datetime.utcnow().date()-datetime.timedelta(days=6 - i))))
    context['joinedActLen'] = joinedActLen

    postedActLen = []
    for i in range(7):
        postedActLen.append(len(Activity.objects.filter(user=request.user, time__startswith=datetime.datetime.utcnow().date()-datetime.timedelta(days=6 - i))))
    context['postedActLen'] = postedActLen

    day = []
    for i in range(7):
        s = str(datetime.datetime.utcnow().date()-datetime.timedelta(days=6-i))
        s = s.split('-')
        day.append(int(s[2]))
    context['day'] = day
    return render(request, 'chartData.json', context, content_type='application/json')

@login_required
def getall_act(request):
    context = {}
    activities = Activity.objects.all().order_by('-time')
    context['activities'] = activities
    return render(request, 'act.json', context, content_type='application/json')

@login_required
def trace(request):
    context = dict()
    # footprints = Activity.objects.filter(user=request.user)
    # context['trace_activity'] = footprints
    return render(request, 'hypermap/trace.html', context)

@login_required
def activity_detail(request, activity_id):
    context = {}
    # activity = get_object_or_404(Activity, id=activity_id)
    try:
        activity = Activity.objects.get(id=activity_id)
    except ObjectDoesNotExist:
        print("-------------")
        context["err"] = 1
        return render(request, 'detailError.json', context, content_type='application/json')
    
    context['activity'] = activity

    if Activity.objects.filter(joinedBy=request.user, id=activity_id):
        joined = 1
    else:
        joined = 0
    context['joined'] = joined
    return render(request, 'each_activity_detail.json', context, content_type='application/json')

@login_required
def delete_activity(request, activity_id):
    # unjoin_activity(request, activity_id)
    Activity.objects.filter(id=activity_id).delete()
    context = {}
    context['dump'] = 1
    return render(request, 'dump.json', context, content_type='application/json')


@login_required
def get_photo(request, activity_id):
    activity = get_object_or_404(Activity, id=activity_id)
    if not activity.picture:
        raise Http404
    content_type = guess_type(activity.picture.name)
    return HttpResponse(activity.picture, content_type=content_type)


@login_required
def get_video(request, activity_id):
    activity = get_object_or_404(Activity, id=activity_id)
    if not activity.videos:
        raise Http404
    content_type = guess_type(activity.videos.name)
    return HttpResponse(activity.videos, content_type=content_type)

