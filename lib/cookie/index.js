"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.set = set;
exports.del = del;

function get(key) {
  var reg = new RegExp(key + '=([^;]*)');

  try {
    return document.cookie.match(reg)[1];
  } catch (e) {
    return false;
  }
}

function set(key, value, expires) {
  var exp = '';

  if (expires) {
    exp = new Date(new Date().getTime() + expires).toGMTString();
  } else {
    exp = 'Session';
  }

  document.cookie = key + '=' + value + ';path=/; expires=' + exp;
}

function del(key) {
  var expires = new Date();
  expires.setTime(expires.getTime() - 1000);
  document.cookie = key + '=xxx;path=/;expires=' + expires.toGMTString();
}