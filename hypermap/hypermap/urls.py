"""team279 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from hypermap import views
from django.contrib.auth import views as auth_views


urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^login$', auth_views.login, {'template_name':'hypermap/login.html'}, name='login'),
    url(r'^logout$', auth_views.logout_then_login, name='logout'),
    url(r'^register$', views.register, name='register'),
    url(r'^registration_confirmation/(?P<username>[a-zA-Z0-9_@\+\-]+)/(?P<token>[a-z0-9\-]+)/$', views.registration_confirmation, name='registration_confirmation'),
    url(r'^add-activity$', views.add_activity, name='add_activity'),
    # url(r'^add-footprint$', views.add_footprint, name='add_footprint'),

    # url(r'^search-study$', views.search_study),
    # url(r'^search-music$', views.search_music),
    # url(r'^search-sports$', views.search_sports),
    # url(r'^search-footprint$', views.search_footprint, name='search_footprint'),
    url(r'^get-tag-time/(?P<condition>\w+)$', views.get_tag_time, name='get_tag_time'),
    url(r'^get-past$', views.get_past, name='get_past'),
    url(r'^get-now$', views.get_now, name='get_now'),
    url(r'^get-future$', views.get_future, name='get_future'),
    url(r'^trace$', views.trace, name='trace'),
    url(r'^join-activity/(?P<activity_id>\d+)$', views.join_activity, name='join-activity'),
    url(r'^unjoin-activity/(?P<activity_id>\d+)$', views.unjoin_activity, name='unjoin-activity'),
    url(r'^get-activity/(?P<activity_lat>.*)/(?P<activity_lng>.*)$', views.get_activity, name='get-activity'),
    # url(r'^get-footprint/(?P<footprint_lat>.*)/(?P<footprint_lng>.*)$', views.get_footprint, name='get-footprint'),
    url(r'^getChartData$', views.getChartData, name='getChartData'),
    url(r'^activity-detail/(?P<activity_id>\d+)$', views.activity_detail, name='activity_detail'),
    url(r'^delete-activity/(?P<activity_id>\d+)$', views.delete_activity),
    url(r'^photo/(?P<activity_id>\d+)$', views.get_photo, name='photo'),
    url(r'^video/(?P<activity_id>\d+)$', views.get_video, name='video'),
    # url(r'^get-past_ftp$', views.get_past_ftp, name='get_past_ftp'),
    # url(r'^get-now_ftp$', views.get_now_ftp, name='get_now_ftp'),
    # url(r'^get-future_ftp$', views.get_future_ftp, name='get_future_ftp'),
    url(r'^getall_act$', views.getall_act, name='getall_act'),
    url(r'^check_login$', views.check_login, name='check_login'),

    url(r'^oauth2callback', views.auth_return),
]
