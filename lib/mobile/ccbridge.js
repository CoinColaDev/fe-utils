"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.modules = exports.SIG_MAP = void 0;
var __inited__ = false;
var SIG_MAP = {
  setShareMenuInfo: ['type', 'campaign', 'params'],
  showShareMenu: ['type', 'params', 'callback'],
  getUserProfile: ['callback'],
  isLoggedIn: ['callback'],
  // GET 请求不支持传入data，填空对象。自行在url中拼接好
  ajax: ['url', 'method', 'data', 'callback'],
  checkAppInstalled: ['name', 'callback'],
  launchExternalApp: ['name', 'callback'],
  setClipboard: ['name', 'callback'],
  getDeviceInfo: ['callback'],
  getPlatform: ['callback'],
  openAppPage: ['page', 'extra'],
  openWebPage: ['url', 'target'],
  // 不需要某个按钮则传空字符串
  showTips: ['text', 'duration'],
  showActionSheet: ['title', 'items', 'cancelText', 'callback'],
  showDialog: ['title', 'content', 'okText', 'cancelText', 'callback'],
  setPageTitle: ['title'],
  setAuthResult: ['result']
};
exports.SIG_MAP = SIG_MAP;
var modules = [{
  name: 'app',
  methods: ['checkAppInstalled', 'launchExternalApp']
}, {
  name: 'data',
  methods: ['setClipboard', 'saveImage', 'ajax', 'getUserProfile', 'isLoggedIn', 'setAuthResult']
}, {
  name: 'device',
  methods: ['getDeviceInfo', 'getPlatform']
}, {
  name: 'ui',
  methods: ['openWebPage', 'openAppPage', 'setShareMenuInfo', 'showShareMenu', 'showTips', 'showActionSheet', 'showDialog', 'setPageTitle']
}];
exports.modules = modules;
var jsbridge = {};
var env = {
  /**
   * 非 ios 都当做安卓
   */
  isAndroid: function isAndroid() {
    return /iPhone|iPad/i.test(navigator.userAgent) === false;
  },
  isIOS: function isIOS() {
    return /iPhone|iPad/i.test(navigator.userAgent);
  },
  isInApp: function isInApp() {
    // ios本地打包的页面和url直接打开的页面携带的ua不同，android全部相同
    // ios本地打包的页面不携带Coincola字段，状态：未修正，当前版本4.4.2
    // 此版本前未出现问题是因为上报脚本修改了ua,而上报脚本携带了coincola字段，修改了上报地址后ua中不存在coincola字段，因此报错
    return /CoinCola/i.test(navigator.userAgent) || window.location.protocol === 'file:';
  }
};

function setupWebViewJavascriptBridge(callback) {
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }

  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function () {
    document.documentElement.removeChild(WVJBIframe);
  }, 0);
}

function initModules(NativeBridge, cc, signature) {
  if (__inited__) {
    return;
  } // 优先使用原生信息提示


  var onError = function onError(msg) {
    if (!NativeBridge) {
      return alert(msg);
    }

    if (NativeBridge.callHandler) {
      NativeBridge.callHandler('showTips', {
        duration: 5000,
        text: msg
      });
    } else {
      NativeBridge.ui.showTips(msg, 5000);
    }
  };

  modules.forEach(function (mod) {
    var exposed = {};
    mod.methods.forEach(function (method) {
      exposed[method] = function () {
        if (!NativeBridge) {
          onError('NativeBridge not found');
          return;
        } // 根据签名重新组织为 iOS 的对象


        if (NativeBridge.callHandler) {
          var params = {};
          var sigs = signature[method];
          var callback; // 组织参数对象

          if (sigs && sigs.length) {
            for (var i = 0; i < sigs.length; i += 1) {
              var key = sigs[i];

              if (key !== 'callback') {
                params[sigs[i]] = arguments[i];
              } else {
                callback = arguments[i];
              }
            }
          }

          return NativeBridge.callHandler(method, params, callback);
        } else if (NativeBridge[mod.name]) {
          var func = NativeBridge[mod.name][method];

          if (!func) {
            onError('NativeBridge method not found:' + method);
            return;
          }

          return func.apply(null, arguments);
        } else {
          onError('Unknown platform');
        }
      };
    });
    cc[mod.name] = exposed;
  });
  __inited__ = true;
}

function onReady(fn) {
  if (__inited__) {
    fn(false);
    return;
  } // 只有在 app 中才会有


  if (env.isInApp()) {
    if (env.isAndroid()) {
      var ready = function ready() {
        initModules(window.CcBridge, jsbridge);
        fn(true);
      };
      /**
       * 有可能已经注入成功了
       */


      if (window.CcBridge) {
        ready();
        return;
      }

      window.onCcBridgeReady = ready;
    } else if (env.isIOS()) {
      setupWebViewJavascriptBridge(function () {
        initModules(window.WebViewJavascriptBridge, jsbridge, SIG_MAP);
        fn(true);
      });
    }
  } else {
    // 不在 app 中直接执行
    __inited__ = true;
    fn(false);
  }
}

var matches = navigator.userAgent.match(/CoinCola\/(\d+\.\d+\.\d+)/i);
var versionText = matches ? matches[1] : '';
var versionNumber = getVersionNumber(versionText);

function getVersionNumber(text) {
  if (!text) {
    return 0;
  }

  var parts = text.split('.');
  return (parts[0] || 0) * 10000 + (parts[1] || 0) * 100 + (parts[2] || 0) * 1;
}

var version = {
  text: versionText,
  number: versionNumber,
  compare: function compare(vText) {
    return versionNumber - getVersionNumber(vText);
  }
};
var _default = {
  env: env,
  onReady: onReady,

  get jsbridge() {
    return jsbridge;
  },

  version: version
};
exports.default = _default;