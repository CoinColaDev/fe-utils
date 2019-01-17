"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = debug;
var CONSOLE_SCRIPT_URL = 'https://files-alocnioc-1251297012.cos.ap-hongkong.myqcloud.com/libs/eruda.js';
var WEINRE_SCRIPT_PATH = '/target/target-script-min.js#anonymous';

function injectScript(url) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.async = true;
    script.src = url;

    script.onload = function () {
      resolve(true);
    };

    script.onerror = function () {
      reject(new Error("Load script error: ".concat(url)));
    };

    document.head.appendChild(script);
  });
}

function debug(weinreDomain) {
  injectScript(CONSOLE_SCRIPT_URL).then(function () {
    window.eruda.init();
  });
  injectScript("".concat(weinreDomain).concat(WEINRE_SCRIPT_PATH));
}