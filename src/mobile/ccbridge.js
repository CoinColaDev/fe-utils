let __inited__ = false

export const SIG_MAP = {
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
}

export const modules = [
  {name: 'app', methods: ['checkAppInstalled', 'launchExternalApp']},
  {name: 'data', methods: ['setClipboard', 'saveImage', 'ajax', 'getUserProfile', 'isLoggedIn','setAuthResult']},
  {name: 'device', methods: ['getDeviceInfo', 'getPlatform']},
  {name: 'ui', methods: ['openWebPage', 'openAppPage', 'setShareMenuInfo', 'showShareMenu', 'showTips', 'showActionSheet', 'showDialog', 'setPageTitle']}
]

const jsbridge = {}

const env = {
  /**
   * 非 ios 都当做安卓
   */
  isAndroid: function () {
    return /iPhone|iPad/i.test(navigator.userAgent) === false
  },
  isIOS: function () {
    return /iPhone|iPad/i.test(navigator.userAgent)
  },
  isInApp: function () {
    return /CoinCola/i.test(navigator.userAgent) || window.location.protocol === 'file:'
  }
}

function setupWebViewJavascriptBridge (callback) {
  if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback) }
  window.WVJBCallbacks = [callback]
  var WVJBIframe = document.createElement('iframe')
  WVJBIframe.style.display = 'none'
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
}

function initModules (NativeBridge, cc, signature) {
  if (__inited__) {
    return
  }

  // 优先使用原生信息提示
  let onError = function (msg) {
    if (!NativeBridge) {
      return alert(msg)
    }

    if (NativeBridge.callHandler) {
      NativeBridge.callHandler('showTips', {duration: 5000, text: msg})
    } else {
      NativeBridge.ui.showTips(msg, 5000)
    }
  }

  modules.forEach(function (mod) {
    let exposed = {}
    mod.methods.forEach(function (method) {
      exposed[method] = function () {
        if (!NativeBridge) {
          onError('NativeBridge not found')
          return
        }

        // 根据签名重新组织为 iOS 的对象
        if (NativeBridge.callHandler) {
          let params = {}
          let sigs = signature[method]
          let callback
          // 组织参数对象
          if (sigs && sigs.length) {
            for (let i = 0; i < sigs.length; i += 1) {
              let key = sigs[i]
              if (key !== 'callback') {
                params[sigs[i]] = arguments[i]
              } else {
                callback = arguments[i]
              }
            }
          }
          return NativeBridge.callHandler(method, params, callback)
        } else if (NativeBridge[mod.name]) {
          let func = NativeBridge[mod.name][method]
          if (!func) {
            onError('NativeBridge method not found:' + method)
            return
          }
          return func.apply(null, arguments)
        } else {
          onError('Unknown platform')
        }
      }
    })

    cc[mod.name] = exposed
  })

  __inited__ = true
}

function onReady (fn) {
  if (__inited__) {
    fn(false)
    return
  }

  // 只有在 app 中才会有
  if (env.isInApp()) {
    if (env.isAndroid()) {
      const ready = function () {
        initModules(window.CcBridge, jsbridge)
        fn(true)
      }
      /**
       * 有可能已经注入成功了
       */
      if (window.CcBridge) {
        ready()
        return
      }

      window.onCcBridgeReady = ready
    } else if (env.isIOS()) {
      setupWebViewJavascriptBridge(function () {
        initModules(window.WebViewJavascriptBridge, jsbridge, SIG_MAP)
        fn(true)
      })
    }
  } else {
    // 不在 app 中直接执行
    __inited__ = true
    fn(false)
  }
}

let matches = navigator.userAgent.match(/CoinCola\/(\d+\.\d+\.\d+)/i)
let versionText = matches ? matches[1] : ''
let versionNumber = getVersionNumber(versionText)

function getVersionNumber (text) {
  if (!text) {
    return 0
  }

  const parts = text.split('.')
  return (parts[0] || 0) * 10000 + (parts[1] || 0) * 100 + (parts[2] || 0) * 1
}

const version = {
  text: versionText,
  number: versionNumber,
  compare: function (vText) {
    return versionNumber - getVersionNumber(vText)
  }
}

export default {
  env,
  onReady,
  get jsbridge () {
    return jsbridge
  },
  version
}

