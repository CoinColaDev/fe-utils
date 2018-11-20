"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getLogger;

function getLogger() {
  var label = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';

  function log(title) {
    for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    if (rest.length) {
      var obj = rest.length > 1 ? rest : rest[0]; // 输出数组格式方便一点

      console.log("[".concat(label, "]"), title, obj);
    } else {
      console.log("[".concat(label, "]"), title);
    }
  }

  log.error = function (title) {
    for (var _len2 = arguments.length, rest = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      rest[_key2 - 1] = arguments[_key2];
    }

    if (rest.length) {
      var obj = rest.length > 1 ? rest : rest[0]; // 输出数组格式方便一点

      console.error("[".concat(label, "]"), title, obj);
    } else {
      console.error("[".concat(label, "]"), title);
    }
  };

  return log;
} // const logger = getLogger('utils/logger')
// logger('info')
// logger.error('errored')