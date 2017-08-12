module.exports = function(url, data) {
  $.ajax({
    type: 'POST',
    url: '/api/' + url,
    data: JSON.stringify({
        'target': target,
        'access_token': '2bu4zWELqk0AFogbYeDDae2xvl',
     }),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
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
