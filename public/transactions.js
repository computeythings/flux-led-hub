function lightPost(element,url) {
  var clickedButton = element;
  $.ajax({
    type: "POST",
    url: "/api/" + url,
    access_token: $("#access_token").val(),
    success: function(result) {
      console.log(result);
    },
    error: function(result){
      console.log(result);
    }
  });
}

$(document).ready(function() {
  $("#on-btn").click(function(e) {
    e.preventDefault();
    lightPost($(this), 'on/');
  });

  $("#off-btn").click(function(e) {
    e.preventDefault();
    lightPost($(this), 'off/');
  });
});
