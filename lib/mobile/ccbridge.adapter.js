"use strict";

var _ccbridge = _interopRequireWildcard(require("./ccbridge"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
 * Adapter for web
 */
var noop = function noop(modName, methodName) {
  console.log("**** Adpater for ccbrige.jsbridge.".concat(modName, ".").concat(methodName, " ****"));
  return function () {
    console.log("**** ccbridge adapter method ****");
    console.log(modName, methodName, arguments);
  };
};

_ccbridge.default.onReady(function (injected) {
  if (injected === false) {
    var jsbridge = _ccbridge.default.jsbridge;

    _ccbridge.modules.forEach(function (mod) {
      mod.methods.forEach(function (method) {
        if (!jsbridge[mod.name]) {
          jsbridge[mod.name] = {};
        }

        jsbridge[mod.name][method] = noop(mod.name, method);
      });
    });

    jsbridge.ui.setPageTitle = function (title) {
      return document.title = title;
    };

    jsbridge.ui.openWebPage = function (url) {
      return window.location.href = url;
    };
  }
});