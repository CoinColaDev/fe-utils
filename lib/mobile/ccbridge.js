"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var __inited__ = false;
var jsbridge = {};
var env = {
  isAndroid: function isAndroid() {
    return /android/i.test(navigator.userAgent);
  },
  isIOS: function isIOS() {
    return /iPhone|iPad/i.test(navigator.userAgent);
  },
  isInApp: function isInApp() {
    return /CoinCola/i.test(navigator.userAgent);
  }
};

function setupWebViewJavascriptBridge(callback) {
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }

  window.WVJBCallbacks = [callback];
  var WVJBIframe = d.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  d.documentElement.appendChild(WVJBIframe);
  setTimeout(function () {
    d.documentElement.removeChild(WVJBIframe);
  }, 0);
}

function initModules(modules, NativeBridge, cc, signature) {
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
          var callback;

          if (sigs) {
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

var modules = [{
  name: 'app',
  methods: ['checkAppInstalled', 'launchExternalApp']
}, {
  name: 'data',
  methods: ['setClipboard', 'saveImage', 'ajax', 'getUserProfile', 'isLoggedIn']
}, {
  name: 'device',
  methods: ['getDeviceInfo', 'getPlatform']
}, {
  name: 'ui',
  methods: ['openWebPage', 'openAppPage', 'showShareMenu', 'showTips', 'showActionSheet', 'showDialog', 'setPageTitle']
}];

function onReady(fn) {
  if (__inited__) {
    fn();
    return;
  } // 只有在 app 中才会有


  if (env.isInApp()) {
    if (env.isAndroid()) {
      window.onCcBridgeReady = function () {
        initModules(modules, window.CcBridge, jsbridge);
        fn(true);
      };
    } else if (env.isIOS()) {
      var methodSignatureMap = {
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
        setPageTitle: ['title']
      };
      setupWebViewJavascriptBridge(function () {
        initModules(modules, window.WebViewJavascriptBridge, jsbridge, methodSignatureMap);
        fn(true);
      });
    }
  } else {
    // 不在 app 中直接执行
    __inited__ = true;
    fn(false);
  }
}

var _default = {
  env: env,
  onReady: onReady,

  get jsbridge() {
    return jsbridge;
  }

};
exports.default = _default;