"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gotoLoginPage = gotoLoginPage;
exports.showShareMenu = showShareMenu;
exports.setShareMenuInfo = setShareMenuInfo;
exports.alert = exports.isLoggedIn = void 0;

var _ccbridge = _interopRequireDefault(require("./ccbridge"));

var _ajax = _interopRequireDefault(require("./ajax"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 2019-01-05
 * NOTE 未测试，谨慎使用
 */
var env = _ccbridge.default.env;
var isInApp = env.isInApp();
var isIOS = env.isIOS();
var isAndroid = env.isAndroid();
var loginApiUrl = '/v1/user/profile';

function getUserProfile() {
  if (!loginApiUrl) {
    return Promise.reject(new Error('Login url is missing.'));
  }

  return _ajax.default.post(loginApiUrl).then(function (json) {
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
  _ccbridge.default.jsbridge.ui.showTips(String(msg), 2000);
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
   * iOS/Android: name, bitmap
   * standard: eventName, bitmap
   */
  if (type === 2) {
    params.name = params.eventName; // iOS 3.6.6 以下不支持分享图片（具体版本未知，暂定）
  } else if (type === 3) {
    // Android: desc, iOS: description, standard: description
    if (isAndroid) {
      params.desc = params.description;
    }
  }

  if (isAndroid) {
    _ccbridge.default.jsbridge.ui.showShareMenu(type, params);
  } else {
    // ios eventName 层级错乱
    window.WebViewJavascriptBridge.callHandler && window.WebViewJavascriptBridge.callHandler('showShareMenu', {
      type: type,
      params: params,
      eventName: params.eventName,
      campaign: params.campaign
    });
  }
}

function setShareMenuInfo(params) {
  if (!isAndroid) {
    _ccbridge.default.jsbridge.ui.setShareMenuInfo(3, params.campaign, params);

    return;
  }

  _ccbridge.default.jsbridge.ui.setShareMenuInfo(params);
}