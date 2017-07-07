function lightPost(element,url) {
  var clickedButton = element;
  $.ajax({
    type: "POST",
    url: "/api/" + url,
    data: JSON.stringify({
       'access_token': $("#access_token").text(),
     }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(result) {
      console.log(result);
    },
    failure: function(result){
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

  $("#toggle-btn").click(function(e) {
    e.preventDefault();
    lightPost($(this), 'toggle/');
  });
});
