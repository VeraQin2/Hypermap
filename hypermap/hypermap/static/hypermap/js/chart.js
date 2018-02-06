$(document).ready(function () {
  // $.get("/hypermap/get_calendar")
  // .done(function(data) {

  // }
  $.get("/hypermap/getChartData")
  .done(function(data) {
      var ctx = document.getElementById('myChart').getContext('2d');
      var chart = new Chart(ctx, {
          // The type of chart we want to create
          type: 'line',

          // The data for our dataset
          data: {
              labels: data['day'],
              datasets: [{
                  label: "Activities you posted",
                  borderColor: 'rgb(255, 99, 132)',
                  data: data['postedActLen'],
              }, {
                  label: "Activities you joined",
                  borderColor: 'rgb(132, 99, 255)',
                  data: data['joinedActLen'],
              }]
          },

          // Configuration options go here
          options: {}
      });
  });

  // CSRF set-up copied from Django docs
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
  var csrftoken = getCookie('csrftoken');
  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }
  });
});