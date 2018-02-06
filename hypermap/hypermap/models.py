# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# User class for built-in authentication module
from django.contrib.auth.models import User
from django.template.loader import render_to_string
from django.utils.translation import gettext as _

from django.contrib import admin
from django.contrib.auth.models import User
from django.db import models

from oauth2client.contrib.django_util.models import CredentialsField

class CredentialsModel(models.Model):
  id = models.ForeignKey(User, primary_key=True)
  credential = CredentialsField()


class CredentialsAdmin(admin.ModelAdmin):
    pass

# Create your models here.
class ActivityTag(models.Model):
	tag = models.CharField(max_length=200)

class Activity(models.Model):
	title = models.CharField(max_length=200)
	content = models.CharField(max_length=200)
	user = models.ForeignKey(User)
	joinedBy = models.ManyToManyField(User,
                                      symmetrical=False,
                                      related_name='related_to')
	time = models.DateTimeField(auto_now_add=True)
	event_date = models.DateField(max_length=200)
	event_time = models.TimeField()
	event_end_date = models.DateField(max_length=200)
	event_end_time = models.TimeField()
	lat = models.FloatField(_('Latitude'), blank=True, null=True)
	lng = models.FloatField(_('Longitude'), blank=True, null=True)
	picture = models.ImageField(upload_to="avator", blank=True)   # specify the folder to store the picture
	videos = models.FileField(upload_to="videos", blank=True)
	tags = models.ManyToManyField(ActivityTag, symmetrical=False)
	address = models.CharField(max_length=200, blank=True)
	calendar_event_id = models.CharField(max_length=200, null=True)

	def __unicode__(self):
		return self.title

	def html(self):
		return render_to_string("activity.html", {"id": self.id,"user": self.user, "title": self.title, "content": self.content, "time": self.event_date, "tags": self.tags}).replace("\n", "");
	
	def profile_html(self):
		return render_to_string("profile_activity.html", {"id": self.id, "user": self.user, "title": self.title, "tags": self.tags}).replace("\n", "");
	
	def detail_html(self):
		return render_to_string("each_activity_detail.html", {"id": self.id,
															"user": self.user,
															"title": self.title,
															"content": self.content,
															"start_date": self.event_date,
															"start_time": self.event_time,
															"end_date": self.event_end_date,
															"end_time":self.event_end_time,
															"activity_id": self.id,
															"tags": self.tags,
															"picture": self.picture,
															"videos": self.videos,
															"address": self.address}).replace("\n", "");

