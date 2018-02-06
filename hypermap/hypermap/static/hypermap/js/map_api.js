/**
 * Created by Tristan on 10/26/17.
 */
var map;
var markers = [];
var marker;
var markers_act = [];
var infowindows_act = [];

var activity_markers = [];
var foot_markers = [];
var markerCluster;
var heatmap;
var heat = [];

var directionsService;
var directionsDisplay;
var handler_array = [];
var ms;

$(document).ready(function() {
    ms = $('#magicsuggest').magicSuggest({
        placeholder: 'Search by tags',
        allowFreeEntries: false, // configuration options
        editable: false,
        data: ['Study', 'Music', 'Sports']
      });

    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    });
    // try{
    //   var socket = new WebSocket("ws://" + window.location.host);
    // }
    // catch(e){
    //   var socket = new WebSocket("ws://" + window.location.host);
    // }
    // socket.onopen = function (evt) {
    //     socket.send("hello");
    // };
    // socket.addEventListener("message", function (data) {
    //     content = JSON.parse(data.data) 
    //     var new_item = $(content.html);

    //     var myDate = new Date(content.time);
    //     var year = new Date().getFullYear();
    //     var month = new Date().getMonth();
    //     var date = new Date().getDate();
    //     var today = new Date(year, month, date);
    //     if (document.getElementById("get_past").classList.contains('active') && myDate.getTime() < today.getTime()) {
    //       $(".top").prepend(new_item);
    //     }
    //     if (document.getElementById("get_now").classList.contains('active') && myDate.getTime() == today.getTime()) {
    //       $(".top").prepend(new_item);
    //     }
    //     if (document.getElementById("get_future").classList.contains('active') && myDate.getTime() > today.getTime()) {
    //       $(".top").prepend(new_item);
    //     }
    // });
    animationHover(".img1","bounce");
    animationHover(".img2","bounce");
    animationHover(".img3","bounce");
    animationHover(".img4","bounce");
    animationHover(".img5","bounce");
    getPresent();

    $("#activity").click(function () {
      $(".addActHeader").css("display", "block");
      navigator.geolocation.getCurrentPosition(function(position) {
          pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
          };
          map.panTo(new google.maps.LatLng(pos.lat, pos.lng));
          map.setCenter(pos);
          map.setZoom(17);
          $("#floating-dialog").show(1500);
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(pos.lat, pos.lng),
            map: map,
            title: 'new share',
            animation: google.maps.Animation.DROP,
            draggable: true,
          });
      });
  });

    $("#submitAct").click(function () {
        addActivity(marker);
        $("#activity").removeClass("diss");
        $(".addActHeader").css("display", "none");
      });
    $("#cancelAct").click(function () {
      $("#floating-dialog").hide(500);
      $("#activity").removeClass("diss");
      $(".addActHeader").css("display", "none");

        var title = $("#id_title");
        var content= $("#id_content");

        var event_month= $("#id_event_date_month")
        var event_day= $("#id_event_date_day")
        var event_year= $("#id_event_date_year")
        var event_time= $("#id_event_time")

        var event_end_month= $("#id_event_end_date_month")
        var event_end_day= $("#id_event_end_date_day")
        var event_end_year= $("#id_event_end_date_year")
        var event_end_time= $("#id_event_end_time")

        $(".error").html('');
        title.val("");
        event_time.val("");
        event_end_time.val("");
        event_day.val("1");
        event_month.val("1");
        event_year.val("2017");
        event_end_month.val("1");
        event_end_day.val("1");
        event_end_year.val("2017");
        marker.setMap(null);
      });

    $("#get_past").click(getPast);
    $("#get_now").click(getPresent);
    $("#get_future").click(getFuture);

    $("#heatmap").click(heatmap);
    $("#find_path").click(find_path);

    $(".img1").click(function () {
       map.setCenter(new google.maps.LatLng(40.4456,-79.9277));

    });
     $('.img2').click(function () {
         map.setCenter(new google.maps.LatLng(40.4428,-79.9430));
         // return false;
    });
     $('.img3').click(function () {
          map.setCenter(new google.maps.LatLng(40.4415,-80.0096));
          // return false;
     });
     $('.img4').click(function () {
          map.setCenter(new google.maps.LatLng(40.4407,-80.0026));
          // return false;
      });
     $('.img5').click(function () {
         map.setCenter(new google.maps.LatLng(40.4444,-79.9608));
         // return false;
    });

      $("a[href*=\\#]").click(function(event) {
          $("#st-control-2").prop("checked", true);
          // var targetId = $("#mapPage");
          var targetId = $(this).attr('href').replace(/\w+.html/,'');
          $("html,body").animate({scrollTop: $(targetId).offset().top}, 1000);
      });

      $('#st-control-1').click(function () {
          $("#st-control-1").prop("checked", true);
          var targetId = $("#roll");
          $("html,body").animate({scrollTop: targetId.offset().top}, 1000);
          // return false;
      });
      $('#st-control-2').click(function () {
          $("#st-control-2").prop("checked", true);
          var targetId = $("#mapPage");
          $("html,body").animate({scrollTop: targetId.offset().top}, 1000);
          // return false;
      });
      $('#st-control-3').click(function () {
          $("#st-control-3").prop("checked", true);
          var targetId = $("#userProfile");
          $("html,body").animate({scrollTop: targetId.offset().top}, 1000);
          // $('html,body').animate({scrollTop: targetId.offset().top},'slow');
          // window.location = window.location.href + "#userProfile";
          setTimeout(window.location.reload.bind(location), 800);
          $('html,body').animate({scrollTop: targetId.offset().top},'slow');
          // return false;
      });
      
      $(ms).on('selectionchange', function(){
        // alert(JSON.stringify(this.getSelection()));
        searchByTag(JSON.stringify(this.getSelection()))
      });
});

function myMap() {
  var mapProp= {
      center:new google.maps.LatLng(40.444663,-79.945039),
      zoom:16,
  };
  map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
}

function addActivity(marker){
  $.validator.addMethod("time24", function(value, element) {
    if (!/^\d{2}:\d{2}:\d{2}$/.test(value)) return false;
    var parts = value.split(':');
    if (parts[0] > 23 || parts[1] > 59 || parts[2] > 59) return false;
    return true;
  }, "Invalid time format.");
  

  $.validator.addMethod("dayValid", function(value, element) {
    year = $("#id_event_date_year").val();
    month = $("#id_event_date_month").val();
    isValid = month > 0 && month < 13 && year > 0 && year < 32768 && value > 0 && value <= (new Date(year, month, 0)).getDate()
    if (isValid) return true;
    return false;
  }, "Invalid date");

  $.validator.addMethod('filesize', function (value, element, param) {
    return this.optional(element) || (element.files[0].size <= param)
  }, 'Video size need be less than 200MB.');

  $.validator.addMethod("greaterThan", function(value, element) {
    start_year = $("#id_event_date_year").val();
    start_month = $("#id_event_date_month").val();
    start_day = $("#id_event_date_day").val();
    start_time = $("#id_event_time").val();

    end_year = $("#id_event_end_date_year").val();
    end_month = $("#id_event_end_date_month").val();
    end_day = $("#id_event_end_date_day").val();
    startDateTime = start_month + "/" + start_day + "/" + start_year + " " + start_time;
    endDateTime = end_month + "/" + end_day + "/" + end_year + " " + value;
    if(Date.parse(endDateTime) < Date.parse(startDateTime)) return false;
    return true;
  }, "End time should greater than start time.");


  var form = $('#activityForm').validate({
    onkeyup: false,
    rules: {
        title: {
            required: true
        },
        content: {
            required: true
        },
        event_date_day: {
          required:true,
          dayValid: true
        },
        event_time : {
            required: true,
            time24: true
        },
        event_end_time: {
            required: true,
            time24: true,
            greaterThan: true
        },
        picture: {
          accept: "jpg|jpeg|png|bmp|gif"
        },
        videos: {
          filesize: 200000000, // max size for video is 200Mb
          accept: "mov|mp4|avi|rmvb|wmv|dat|mpeg"
        }
    }
  });

  if ($('#activityForm').valid()) {
        $("#floating-dialog").hide(500);
        marker.setDraggable(false);
        markers.push(marker);
        if(markers.length == 1) {
            merge()
        } else {
            markerCluster.addMarkers(markers);
        }
        var title = $("#id_title");
        var content= $("#id_content");

        var event_month= $("#id_event_date_month")
        var event_day= $("#id_event_date_day")
        var event_year= $("#id_event_date_year")
        var event_time= $("#id_event_time")

        var event_end_month= $("#id_event_end_date_month")
        var event_end_day= $("#id_event_end_date_day")
        var event_end_year= $("#id_event_end_date_year")
        var event_end_time= $("#id_event_end_time")


        var lat=marker.position.lat();
        var lng=marker.position.lng();

        var picture = $("#id_picture").prop('files');
        var video = $("#id_videos").prop('files');

        formData = new FormData();
        if (picture.length > 0) {
          formData.append("picture",picture[0]);
        }
        if (video.length > 0) {
          formData.append("videos",video[0]);
        }

        var tag1 = $("#id_tag1:checked").val();
        var tag2 = $("#id_tag2:checked").val();
        var tag3 = $("#id_tag3:checked").val();
        if (tag1) {
          formData.append("tag1", tag1);
        }
        if (tag2) {
          formData.append("tag2", tag2);
        }
        if (tag3) {
          formData.append("tag3", tag3);
        }

        formData.append("title", title.val());
        formData.append("content", content.val());
        formData.append("event_time", event_time.val());
        formData.append("event_date", event_year.val()+"-"+event_month.val()+"-"+event_day.val());
        formData.append("event_end_time", event_end_time.val());
        formData.append("event_end_date", event_end_year.val()+"-"+event_end_month.val()+"-"+event_end_day.val());

        formData.append("lat",lat);
        formData.append("lng", lng);
        var geocoder = new google.maps.Geocoder;
        latlng = marker.position;
        geocoder.geocode({'location': latlng}, function(results, status) {
            add = results[0].formatted_address
            formData.append("address",add);
            $.ajax({
            url: "/hypermap/add-activity",
            type: 'POST',
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            success: function(data){
              var new_item = $(data.html);

              var today = new Date();
              var myDate = new Date();
              myDate.setFullYear(event_end_year.val(),event_end_month.val() - 1,event_end_day.val());
              if (document.getElementById("get_past").classList.contains('active') && myDate.getTime() < today.getTime()) {
                $(".top").prepend(new_item);
              }
              if (document.getElementById("get_now").classList.contains('active') && myDate.getTime() == today.getTime()) {
                $(".top").prepend(new_item);
              }
              if (document.getElementById("get_future").classList.contains('active') && myDate.getTime() > today.getTime()) {
                $(".top").prepend(new_item);
              }

              title.val("");
              event_time.val("");
              event_end_time.val("");
              event_day.val("1");
              event_month.val("1");
              event_year.val("2017");
              event_end_month.val("1");
              event_end_day.val("1");
              event_end_year.val("2017");

              $(".profileActivity").prepend($(data.profile_html))
              $("#profileHeader").css("display", "none");

              infowindow = new google.maps.InfoWindow({});
              infowindow.setContent(data.html)

              marker.addListener('click', function() {
                infowindow.open(map, marker);
              });
              markers.push(marker);
            }
          });
      });
  }
}

function searchByTag(tags) {
    var list_act = $(".top");
    list_act.html('');
    var tagStr = "";
    for(var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }
    if(markers.length != 0) {
        markerCluster.clearMarkers();
    }
    if (~tags.indexOf("Study")) {
      tagStr = tagStr.concat("study");
    }
    if (~tags.indexOf("Music")) {
      tagStr = tagStr.concat("music");
    }
    if (~tags.indexOf("Sports")) {
      tagStr = tagStr.concat("sports");
    }
    if (document.getElementById("get_past").classList.contains('active') ) {
      tagStr = tagStr.concat("past");
    }
    if (document.getElementById("get_now").classList.contains('active') ) {
      tagStr = tagStr.concat("present");
    }
    if (document.getElementById("get_future").classList.contains('active') ) {
      tagStr = tagStr.concat("future");
    }
    $.get("/hypermap/get-tag-time/" + tagStr)
      .done(function(data) {
          display_marker(data,list_act);
          merge()
    });
}

function getActivityDetail(activity_id) {
    // Get the modal
    $("#exampleModalLong").find(".modal-footer").html('');
    $("#exampleModalLong").find(".modal-body").html('');
    $("#exampleModalLong").find(".modal-title").html('');

    $("#exampleModalLong").find(".modal-footer").append("<button id='btn_unjoin' class='button button-glow button-caution button-rounded'>Unjoin</button> ");
    $("#exampleModalLong").find(".modal-footer").append("<button id='btn_join' class='button button-glow button-caution button-rounded'>Join</button> ");
    $('#btn_unjoin').click(function () {
        $.get("/hypermap/unjoin-activity/"+activity_id).done(function(data) {});
        $("#btn_unjoin").css("display", "none");
        $("#btn_join").css("display", "block");
        $("#hint_join").css("display", "none");
        $("#exampleModalLong").find(".modal-footer").prepend("<p id='hint_join'>The activity is deleted from your calendar.</p >");
    });
    $('#btn_join').click(function () {
        $.get("/hypermap/join-activity/"+activity_id).done(function(data) {});
        $("#btn_join").css("display", "none");
        $("#btn_unjoin").css("display", "block");
        $("#hint_join").css("display", "none");
        $("#exampleModalLong").find(".modal-footer").prepend("<p id='hint_join'>The activity is added to your calendar.</p >");
    });
    $.get("/hypermap/activity-detail/" + activity_id)
    .done(function(data) {
      if (data.errors) {
        $("#btn_join").css("display", "none");
        $("#btn_unjoin").css("display", "none");
        $("#exampleModalLong").find(".modal-body").append("Sorry! The activity has been deleted. Please refresh your page.");
        return
      }
      var new_activity = $(data.html);
      var title = data.title;
      var lat = data.lat;
      var lng = data.lng;
      $("#exampleModalLong").find(".modal-body").append(new_activity);
      $("#exampleModalLong").find(".modal-title").append(title);
      if (data.joined == 1) {
        $("#btn_join").css("display", "none");
      } else {
        $("#btn_unjoin").css("display", "none");
      }
      map.setCenter(new google.maps.LatLng(lat,lng));
    });
}

function deleteActivity(activity_id) {
  $("#submitDelete").click(function() {
    $.get("/hypermap/delete-activity/" + activity_id)
    .done(function() {
      location.reload()
    });
  });
}


function getPast() {
    if ( document.getElementById("get_now").classList.contains('active') ) {
        document.getElementById("get_now").classList.remove('active')
    }
    if ( document.getElementById("get_future").classList.contains('active') ) {
        document.getElementById("get_future").classList.remove('active')
    }
    document.getElementById("get_past").classList.add('active');
    ms.clear();
    var list_act = $(".top");
    list_act.html('');
    for(var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }
    if(markers.length != 0) {
        markerCluster.clearMarkers();
    }
    $.get("/hypermap/get-past")
      .done(function(data) {
          display_marker(data,list_act);
          merge()
      });
}

function getPresent() {
    
    if ( document.getElementById("get_past").classList.contains('active') ) {
        document.getElementById("get_past").classList.remove('active')
    }
    if ( document.getElementById("get_future").classList.contains('active') ) {
        document.getElementById("get_future").classList.remove('active')
    }
    document.getElementById("get_now").classList.add('active');
    ms.clear();
    var list_act = $(".top");
    list_act.html('');
    if (typeof markerCluster == 'undefined') {
      merge()
    }
    if(markers.length != 0) {
        markerCluster.clearMarkers();
    }
    for(var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }
    $.get("/hypermap/get-now")
      .done(function(data) {
          display_marker(data,list_act);
          merge()
      });
}

function getFuture() {
    if ( document.getElementById("get_now").classList.contains('active') ) {
        document.getElementById("get_now").classList.remove('active')
    }
    if ( document.getElementById("get_past").classList.contains('active') ) {
        document.getElementById("get_past").classList.remove('active')
    }
    document.getElementById("get_future").classList.add('active');
    ms.clear();
    var list_act = $(".top");
    list_act.html('');
  
    for(var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }
    if(markers.length != 0) {
        markerCluster.clearMarkers();
    }
    $.get("/hypermap/get-future")
      .done(function(data) {
          display_marker(data,list_act);
          merge()
      });
}


function heatmap() {
  if(markers.length != 0) {
      markerCluster.clearMarkers();
  }
  for(var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
  }
    $("#get_past").addClass("diss");
    $("#get_now").addClass("diss");
    $("#get_future").addClass("diss");
    $("#magicsuggest").addClass("diss");
    $("#activity").addClass("diss");


    $("#find_path").css("display", "none");
    $("#heatmap").css("display", "none");
    $("#back").css("display", "block");
    $(".heatHeader").css("display", "block");

  $('#back').click(function () {
    heatmap.setMap(null);
    markerCluster.addMarkers(markers);
    $("#find_path").css("display", "block");
    $("#heatmap").css("display", "block");
    $("#back").css("display", "none");
    $(".heatHeader").css("display", "none");

    $("#get_past").removeClass("diss");
    $("#get_now").removeClass("diss");
    $("#get_future").removeClass("diss");
    $("#magicsuggest").removeClass("diss");
    $("#activity").removeClass("diss");

  });
    if(heat.length != 0) {
        heatmap.setMap(null);
    }
    for(i = 0; i < markers.length; i++) {
        heat.push(markers[i].position)
    }
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heat,
        map: map,
        radius: 50,
    });
}

function find_path() {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    $("#get_past").addClass("diss");
    $("#get_now").addClass("diss");
    $("#get_future").addClass("diss");
    $("#magicsuggest").addClass("diss");
    $("#activity").addClass("diss");

    $("#find_path").css("display", "none");
    $("#heatmap").css("display", "none");
    $("#back").css("display", "block");
    $(".findPathHeader").css("display", "block");
    $("#back").click(function () {
        for(var i = 0; i < handler_array.length; i++) {
            google.maps.event.removeListener(handler_array[i]);
        }
        if(directionsDisplay != null) {
            directionsDisplay.setMap(null);
            directionsDisplay = null;
        }
        $("#find_path").css("display", "block");
        $("#heatmap").css("display", "block");
        $("#back").css("display", "none");
        $(".findPathHeader").css("display", "none");

        $("#get_past").removeClass("diss");
        $("#get_now").removeClass("diss");
        $("#get_future").removeClass("diss");
        $("#magicsuggest").removeClass("diss");
        $("#activity").removeClass("diss");

        return
    });
    for(var key = 0; key < markers.length; key++) {
        hand = google.maps.event.addListener(markers[key], 'click', function() {
            clicked = this.position;
            route(clicked);
            directionsDisplay.setOptions( { suppressMarkers: true } );
        });
        handler_array.push(hand)
    };
}

function route(clicked) {
    navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        var start = new google.maps.LatLng(pos.lat,pos.lng);
        var end = clicked;
        var request = {
            origin:start,
            destination:end,
            travelMode: google.maps.TravelMode.WALKING
        };
        directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setOptions({ preserveViewport: true });
            directionsDisplay.setDirections(result);
        }
        });
    });
}


function merge() {
    markerCluster = new MarkerClusterer(map, markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}

function display_marker(data,list_act) {
    markers_act = [];
    infowindows_act = [];
    markers=[];
    for (var i = 0; i < data.activities.length; i++) {
      var item = data.activities[i];
      var new_item = $(item.html);
      list_act.prepend(new_item);
      // console.log("aaaaaa")
      // console.log(data.activities[i].lat)
      // console.log(data.activities[i].lng)
      var point = new google.maps.LatLng(data.activities[i].lat,data.activities[i].lng);
      var marker = new google.maps.Marker({
        position: point,
        map: map,
        animation: google.maps.Animation.DROP,
      });
      markers.push(marker);
      markers_act.push(marker);

      var infowindow = new google.maps.InfoWindow({});
      infowindows_act.push(infowindow);
    }

    for(var key = 0; key < markers_act.length; key++) {
        google.maps.event.addListener(markers_act[key], 'click', function(innerKey) {
          return function() {
            $.get("/hypermap/get-activity/"+markers_act[innerKey].position.lat()+"/"+markers_act[innerKey].position.lng())
            .done(function(data) {
                if (data.errors) {
                  infowindows_act[innerKey].setContent("Sorry! The activity has been deleted. Please refresh your page.")
                } else {
                  infowindows_act[innerKey].setContent(data.html)
                }
            });
            infowindows_act[innerKey].open(map, markers_act[innerKey]);
          }
        }(key));
    };
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function animationHover(element, animation){
    element = $(element);
    element.hover(
        function() {
            element.addClass('animated ' + animation);
        },
        function(){
            //wait for animation to finish before removing classes
            window.setTimeout( function(){
                element.removeClass('animated ' + animation);
            }, 2000);
        });
}
