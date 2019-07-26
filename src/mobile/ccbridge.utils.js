/**
 * 2019-01-05
 * NOTE 未测试，谨慎使用
 */
import ccbridge from './ccbridge'
import ajax from './ajax'

const { env } = ccbridge
const isInApp = env.isInApp()
const isIOS =  env.isIOS()
const isAndroid =  env.isAndroid()
const loginApiUrl = '/v1/user/profile'

function getUserProfile () {
  if (!loginApiUrl) {
    return Promise.reject(new Error('Login url is missing.'))
  }

  return ajax.post(loginApiUrl).then(json => {
    return json
  }).catch(err => {
    return false
  })
}

function nativeIsLoggedIn () {
  return new Promise((resolve, reject) => {
    ccbridge.jsbridge.data.isLoggedIn(result => {
      resolve(!!result)
    })
  })
}

// 是否已经登录
export const isLoggedIn = isInApp ? nativeIsLoggedIn : getUserProfile

export const alert = isInApp ? (msg) => {
  ccbridge.jsbridge.ui.showTips(String(msg), 2000)
} : window.alert

// 跳转到登录页
export function gotoLoginPage (url = '/login/phone') {
  if (isInApp) {
    ccbridge.jsbridge.ui.openAppPage('login', '')
  } else {
    window.location.href = url
  }
}

// 打开分享菜单
export function showShareMenu (type, params) {
  /**
   * 分享图片需要兼容
   * iOS/Android: name, bitmap
   * standard: eventName, bitmap
   */
  if (type === 2) {
    params.name = params.eventName
    // iOS 3.6.6 以下不支持分享图片（具体版本未知，暂定）
  } else if (type === 3) {
    // Android: desc, iOS: description, standard: description
    if (isAndroid) {
      params.desc = params.description
    }
  }

  if (isAndroid) {
    ccbridge.jsbridge.ui.showShareMenu(type, params)
  } else {
    // ios eventName 层级错乱
    window.WebViewJavascriptBridge.callHandler && window.WebViewJavascriptBridge.callHandler('showShareMenu', {
      type,
      params,
      eventName: params.eventName,
      campaign: params.campaign
    })
  }
}

/**
 * 3.15 开始支持
 */
export function setShareMenuInfo (params) {
  if (ccbridge.version.compare('3.15.0') >= 0) {
    if (!isAndroid) {
      ccbridge.jsbridge.ui.setShareMenuInfo(3, params.campaign, params)
      return
    }
  
    ccbridge.jsbridge.ui.setShareMenuInfo(params)
  }
}
