function lightPost(target, url) {
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

function scan() {
  $.ajax({
    type: 'POST',
    url: '/api/scan',
    data: JSON.stringify({
        'access_token': '2bu4zWELqk0AFogbYeDDae2xvl',
     }),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(result) {
      console.log(result);
      $('#test-a').text(result);
      //TODO: set states here
    },
    failure: function(result) {
      console.log(result);
    },
    error: function(result) {
      console.log(result);
    }
  });
}

function setBrightness(target, level) {
  $.ajax({
    type: 'POST',
    url: '/api/brightness',
    data: JSON.stringify({
        'target': target,
        'brightness': level,
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

$(document).ready(function() {
  $('.light-btn').click(function(e) {
    lightPost('all', $(this).val());
  });
  $('.dimmer').mouseup(function(e) {
    var target = $(this).parent().attr('id');
    if(target !== Array)
      target = [target];
    console.log(target);
    setBrightness(target, $(this).val());
  })
});
