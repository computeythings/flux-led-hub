var exports = module.exports = {};

exports.turnOn = function (socket) {
  var buffer = new Buffer([0x71, 0x23, 0x0f, 0xa3]);
  socket.write(buffer);
}

exports.turnOff = function (socket) {
  var buffer = new Buffer([0x71, 0x24, 0x0f, 0xa4]);
  socket.write(buffer);
}
