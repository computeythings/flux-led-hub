"use strict"
const ALPHANUM = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

module.exports = function(size) {
  var key = '';
  for(var i = 0; i < size; i++) {
    key += ALPHANUM[parseInt(Math.random() * ALPHANUM.length)];
  }
  return key;
}
