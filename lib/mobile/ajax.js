"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serialize = serialize;
exports.default = void 0;

var _ccbridge = _interopRequireDefault(require("./ccbridge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isInApp = _ccbridge.default.env.isInApp();
/**
 * 生产环境的 basePath 请设置为 https://coincola-app.azureedge.net
 * A 站的 basePath 为 https://app.alocnioc.com
 */


var noop = function noop() {};

var basePath = '';
var globalAjaxHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'X-Requested-With': 'XMLHttpRequest'
};
var globalAjaxParams = {};
var globalBeforeSend = noop;
var mockState = {
  get: {},
  post: {}
};

function mock(url, method, res) {
  mockState[method.toLowerCase()][url] = res;
}

mock.delay = 500;

function serialize(obj) {
  return Object.keys(obj).map(function (key) {
    return "".concat(key, "=").concat(obj[key]);
  }).join('&');
}

function nativeRequest(_ref) {
  var url = _ref.url,
      _ref$params = _ref.params,
      params = _ref$params === void 0 ? {} : _ref$params,
      _ref$method = _ref.method,
      method = _ref$method === void 0 ? 'POST' : _ref$method;
  return new Promise(function (resolve, reject) {
    var mockData = mockState[method.toLocaleLowerCase()][url];

    if (mockData) {
      setTimeout(function () {
        resolve(typeof mockData === 'function' ? mockData(params) : mockData);
      }, mock.delay);
      return;
    }

    var jsbridge = _ccbridge.default.jsbridge;

    if (!jsbridge || !jsbridge.data || !jsbridge.data.ajax) {
      reject(new Error("No jsbridge found on url: ".concat(window.location.href)));
      return;
    }

    jsbridge.data.ajax(basePath + url, method, params, function () {
      var json = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (json && json.code === 0) {
        resolve({
          data: json
        });
      } else {
        var error = new Error(json.message || "".concat(method, " error for url ").concat(basePath + url));

        if (json.code) {
          error.code = json.code;
        }

        reject(error);
      }
    });
  });
}

function webRequest(_ref2) {
  var url = _ref2.url,
      _ref2$params = _ref2.params,
      params = _ref2$params === void 0 ? {} : _ref2$params,
      _ref2$method = _ref2.method,
      method = _ref2$method === void 0 ? 'POST' : _ref2$method;

  if (!url) {
    return Promise.reject(new Error('Arguments Error'));
  }

  return new Promise(function (resolve, reject) {
    globalBeforeSend && globalBeforeSend();
    var mockData = mockState[method.toLocaleLowerCase()][url];

    if (mockData) {
      setTimeout(function () {
        resolve(typeof mockData === 'function' ? mockData(params) : mockData);
      }, mock.delay);
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open(method, basePath + url, true);
    Object.keys(globalAjaxHeaders).forEach(function (key) {
      xhr.setRequestHeader(key, globalAjaxHeaders[key]);
    });

    xhr.onload = function (e) {
      try {
        var json = JSON.parse(this.responseText);

        if (json && json.code === 0) {
          resolve(json);
        } else {
          var error = new Error(json.message);

          if (json.code) {
            error.code = json.code;
          }

          reject(error);
        }
      } catch (e) {
        reject(e);
      }
    };

    xhr.onerror = function (e) {
      reject(e);
    };

    xhr.send(method === 'POST' ? serialize(_objectSpread({}, params, globalAjaxParams)) : null);
  });
}

var ajax = isInApp ? nativeRequest : webRequest;

ajax.setBasePath = function (base) {
  basePath = base;
};

ajax.get = function (url) {
  return ajax({
    url: url,
    method: 'GET'
  });
};

ajax.post = function (url, params) {
  return ajax({
    url: url,
    params: params,
    method: 'POST'
  });
};

ajax.setup = function (_ref3) {
  var _ref3$params = _ref3.params,
      params = _ref3$params === void 0 ? {} : _ref3$params,
      _ref3$headers = _ref3.headers,
      headers = _ref3$headers === void 0 ? {} : _ref3$headers,
      beforeSend = _ref3.beforeSend;
  globalAjaxParams = _objectSpread({}, globalAjaxParams, params);
  globalAjaxHeaders = _objectSpread({}, globalAjaxHeaders, headers);
  beforeSend && (globalBeforeSend = beforeSend);
};

ajax.mock = mock;
var _default = ajax;
exports.default = _default;