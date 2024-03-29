# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-02 23:17
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import oauth2client.contrib.django_util.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0008_alter_user_username_max_length'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('content', models.CharField(max_length=200)),
                ('time', models.DateTimeField(auto_now_add=True)),
                ('event_date', models.DateField(max_length=200)),
                ('event_time', models.TimeField()),
                ('event_end_date', models.DateField(max_length=200)),
                ('event_end_time', models.TimeField()),
                ('lat', models.FloatField(blank=True, null=True, verbose_name='Latitude')),
                ('lng', models.FloatField(blank=True, null=True, verbose_name='Longitude')),
                ('picture', models.ImageField(blank=True, upload_to='avator')),
                ('videos', models.FileField(blank=True, upload_to='videos')),
                ('address', models.CharField(blank=True, max_length=200)),
                ('calendar_event_id', models.CharField(max_length=200, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ActivityTag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tag', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='CredentialsModel',
            fields=[
                ('id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('credential', oauth2client.contrib.django_util.models.CredentialsField(null=True)),
            ],
        ),
        migrations.AddField(
            model_name='activity',
            name='joinedBy',
            field=models.ManyToManyField(related_name='related_to', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='activity',
            name='tags',
            field=models.ManyToManyField(to='hypermap.ActivityTag'),
        ),
        migrations.AddField(
            model_name='activity',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
