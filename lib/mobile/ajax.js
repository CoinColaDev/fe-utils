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

var basePath = '';
var globalAjaxHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'X-Requested-With': 'XMLHttpRequest'
};
var globalAjaxParams = {};
var mockState = {
  get: {},
  post: {}
};

function mock(url, method, res) {
  mockState[method.toLowerCase()][url] = res;
}

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
      resolve(typeof mockData === 'function' ? mockData(params) : mockData);
      return;
    }

    var jsbridge = _ccbridge.default.jsbridge;
    jsbridge.data.ajax(basePath + url, method, params, function (json) {
      if (json && json.code === 0) {
        resolve(json);
      } else {
        reject(new Error(json ? json.message : 'Unknown Error'));
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
    var mockData = mockState[method.toLocaleLowerCase()][url];

    if (mockData) {
      resolve(typeof mockData === 'function' ? mockData(params) : mockData);
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
          reject(new Error(json.message));
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
      headers = _ref3$headers === void 0 ? {} : _ref3$headers;
  globalAjaxParams = _objectSpread({}, globalAjaxParams, params);
  globalAjaxHeaders = _objectSpread({}, globalAjaxHeaders, headers);
};

ajax.mock = mock;
var _default = ajax;
exports.default = _default;