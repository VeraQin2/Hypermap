/**
 * Created by Tristan on 11/18/17.
 */
/**
 * Created by Tristan on 11/18/17.
 */
var map;
var activity_markers = [];
var foot_markers = [];
var activity_trace = [];
var foot_trace = [];
var markers = [];
var count = 1;
var directionsService;
var directionsDisplay;
var showlist = [];
$(document).ready(function () {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    for(i = 0; i < activity_markers.length; i++) {
        activity_markers[i].setMap(map)
    };
    $("#traces").click(function () {
        route();
        showlist.push(directionsDisplay);
        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map);
        directionsDisplay.setOptions( { suppressMarkers: true } );
    });
});

function route() {
    // if(activity_markers.length <= 1) {
    //     return
    // }
    var start = activity_trace[count%activity_trace.length];
    count++;
    var end = activity_trace[count%activity_trace.length];
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
    //google.maps.event.addDomListener(window,'load',initialize);
}