"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gotoLoginPage = gotoLoginPage;
exports.showShareMenu = showShareMenu;
exports.copyToClipboard = copyToClipboard;
exports.alert = exports.isLoggedIn = exports.ALOC_DOMAIN = exports.AZURE_DOMAIN = void 0;

var _ccbridge = _interopRequireDefault(require("./ccbridge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var env = _ccbridge.default.env;
var isInApp = env.isInApp();
var isIOS = env.isIOS();
var isAndroid = env.isAndroid();
var loginApiUrl = '/v1/user/profile'; // 生产环境接口地址

var AZURE_DOMAIN = 'https://coincola-app.azureedge.net'; // A 站接口地址

exports.AZURE_DOMAIN = AZURE_DOMAIN;
var ALOC_DOMAIN = 'https://app.alocnioc.com';
exports.ALOC_DOMAIN = ALOC_DOMAIN;

function getUserProfile() {
  if (!loginApiUrl) {
    return Promise.reject(new Error('Login url is missing.'));
  }

  return ajax.post(loginApiUrl).then(function (json) {
    return json;
  }).catch(function (err) {
    return false;
  });
}

function nativeIsLoggedIn() {
  return new Promise(function (resolve, reject) {
    _ccbridge.default.jsbridge.data.isLoggedIn(function (result) {
      resolve(!!result);
    });
  });
} // 是否已经登录


var isLoggedIn = isInApp ? nativeIsLoggedIn : getUserProfile;
exports.isLoggedIn = isLoggedIn;
var alert = isInApp ? function (msg) {
  _ccbridge.default.jsbridge.ui.showTips(String(msg), 3000);
} : window.alert; // 跳转到登录页

exports.alert = alert;

function gotoLoginPage() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/login/phone';

  if (isInApp) {
    _ccbridge.default.jsbridge.ui.openAppPage('login', '');
  } else {
    window.location.href = url;
  }
} // 打开分享菜单


function showShareMenu(type, params) {
  /**
   * 分享图片需要兼容
   * Android: name, bitmap
   * iOS: imageName, thumbData
   * standard: eventName, bitmap
   */
  if (type === 2) {
    if (isAndroid) {
      params.name = params.eventName;
    }

    if (isIOS) {
      params = _objectSpread({}, params, {
        url: '',
        thumbData: params.bitmap,
        imageName: params.eventName
      });
    }
  } else if (type === 3) {
    // Android: desc, iOS: description, standard: description
    if (isAndroid) {
      params.desc = params.description;
    }
  }

  _ccbridge.default.jsbridge.ui.showShareMenu(type, params);
} // https://segmentfault.com/a/1190000007616673


function copyToClipboard(text) {
  var aux = document.createElement('input');
  aux.setAttribute('value', text);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand('copy');
  document.body.removeChild(aux);
}