"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = exports.postJson = exports.get = exports.post = exports.ajax = void 0;

var _client = _interopRequireDefault(require("superagent/lib/client"));

var _logger = _interopRequireDefault(require("../logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var log = (0, _logger.default)('utils/ajax');

var noop = function noop() {};

var settings = {
  baseUrl: '',
  // 处理函数
  url: null,
  // 处理函数
  headers: noop,
  success: noop
};

var ajax = function ajax(method, dataMethod, contentType) {
  return function (url) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return new Promise(function (resolve, reject) {
      url = settings.url ? settings.url(url) : url;
      headers = _objectSpread({}, settings.headers(), headers);

      _client.default[method]("".concat(settings.baseUrl).concat(url)).timeout({
        response: 30000,
        deadline: 60000
      }).type(contentType)[dataMethod](params).set(headers).end(function (err, res) {
        if (err) {
          log(err); // request aborted or server is down

          if (settings.error) {
            settings.error({
              response: res,
              url: url,
              params: params,
              headers: headers
            });
          }

          if (err.crossDomain) {
            return;
          }

          return reject(res && res.body && res.body.message ? new Error(res.body.message) : err);
        } // backend down


        if (!res.body) {
          return reject(new Error('Code: BACKEND_ERROR'));
        }

        res.data = res.body; // 返回错误对象则 reject

        var result = settings.success({
          response: res,
          url: url,
          params: params,
          headers: headers
        });

        if (result) {
          reject(result);
          return;
        }

        resolve(res);
      });
    });
  };
};

exports.ajax = ajax;
var post = ajax('post', 'send', 'form');
exports.post = post;
var get = ajax('get', 'query', 'json');
exports.get = get;
var postJson = ajax('post', 'send', 'application/json');
exports.postJson = postJson;

var setup = function setup(opts) {
  Object.assign(settings, opts);
};

exports.setup = setup;