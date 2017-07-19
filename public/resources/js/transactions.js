function lightPost(target, url) {
  $.ajax({
    type: "POST",
    url: "/api/" + url,
    data: JSON.stringify({
        'target': target,
        'access_token': '',
     }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(result) {
      console.log(result.responseText);
    },
    failure: function(result) {
      console.log(result.responseText);
    },
    error: function(result) {
      console.log(result.responseText);
    }
  });
}

$(document).ready(function() {
  $(".light-btn").click(function(e) {
    lightPost('all', $(this).val());
  });
});
