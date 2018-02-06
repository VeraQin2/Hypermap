function user_login() {
	var username = $("#inputUsername");
	var password = $("#inputPassword");
    $.post("/hypermap/login", {"username": username.val(), "password":password.val()})
      .done(function(data) {
        if (data.indexOf("User-Page") == -1) {
          $("#modal_trigger").click();
        } else {
          window.location.href='/';
        } 
      });
}

function user_register() {
 $(".error").html('')
 $("#hint").html('')
 var username = $("#id_username");
 var firstname = $("#id_firstname");
 var lastname = $("#id_lastname");
 var email = $("#id_email");
 var password1 = $("#id_password1");
 var password2 = $("#id_password2");
    $.post("/hypermap/register", {"username": username.val(), "firstname": firstname.val(), "lastname": lastname.val(), "email": email.val(), "password1":password1.val(), "password2":password2.val()})
      .done(function(data) {
        if (typeof(data) == 'string') {
          username.val("");
          firstname.val("");
          lastname.val("");
          email.val("");
          password1.val("");
          password2.val("");
          $("#hint").text("A confirmation email has been sent to your email. Please click the link in that email to confirm your email address and complete your registration for Hypermap.");
        } else {
          if (data.__all__ != undefined) {
            $("#errors_register").append(data.__all__[0].message+"<br />");
          }
          if (data.email != undefined) {
            $("#errors_email").append(data.email[0].message+"<br />");
          }
          if (data.username != undefined) {
            $("#errors_username").append(data.username[0].message+"<br />");
          }
          if (data.lastname != undefined) {
            $("#errors_lastname").append(data.lastname[0].message+"<br />");
          }
          if (data.firstname != undefined) {
            $("#errors_firstname").append(data.firstname[0].message+"<br />");
          }
          if (data.password1 != undefined) {
            $("#errors_password1").append(data.password1[0].message+"<br />");
          }
          if (data.password1 != undefined) {
            $("#errors_password2").append(data.password1[0].message+"<br />");
          }
        }
      });
}

$(document).ready(function () {
	$.get("/hypermap/check_login")
	  .done(function(data) {
	      if (data.logedin == 0) {
	      	$("#modal_trigger").click();
	      }
	  });

	$("#modal_trigger").leanModal({
			top: 100,
			overlay: 0.6,
			closeButton: ".modal_close",
	});

	$("#login_form").click(function() {
			$(".social_login").hide();
			$(".user_login").show();
			return false;
	});

	// Calling Register Form
	$("#register_form").click(function() {
			$(".social_login").hide();
			$(".user_register").show();
			$(".header_title").text('Register');
			return false;
	});

	// Going back to Social Forms
	$(".back_btn").click(function() {
			$(".user_login").hide();
			$(".user_register").hide();
			$(".social_login").show();
			$(".header_title").text('Login');
			return false;
	});

	$("#submit_login").click(function () {
	        user_login();
	});

	$("#submit_register").click(function () {
	        user_register();
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