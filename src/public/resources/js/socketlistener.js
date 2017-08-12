var socket = io();

socket.on('update', (data) => {
  if(data.powerState === 35) {
    $('#' + data.bulb + '-image').attr('src', '/resources/img/on.png')
  }
  else if(data.powerState === 36){
    $('#' + data.bulb + '-image').attr('src', '/resources/img/off.png')
  }
  else {
    $('#' + data.bulb + '-image').attr('src', '/resources/img/dc.png');
  }
});
