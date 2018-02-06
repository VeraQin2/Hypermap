/**
 * Created by Tristan on 11/18/17.
 */
var map;
var activity_markers = [];
var foot_markers = [];
var markers = [];
var heatmap;
var heat = [];

$(document).ready(function () {
    $('#activity_heatmap').click(function () {
        getheat(activity_markers)
    });

    $('#footprint_heatmap').click(function() {
        getheat(foot_markers)
    });
});

function myMap() {
  var mapProp= {
      center:new google.maps.LatLng(40.444663,-79.945039),
      zoom:16,
  };
  map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
}

function getheat(markers) {
    if(heat.length != 0) {
        heatmap.setMap(null);
    }
    heat=[];
    for(i = 0; i < markers.length;i++) {
        heat.push(markers[i].position)
    }
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heat,
        map: map,
        radius:50,
    });
}