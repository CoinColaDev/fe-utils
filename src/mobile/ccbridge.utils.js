/**
 * 2019-01-05
 * NOTE 未测试，谨慎使用
 */
import ccbridge from './ccbridge'

const { env } = ccbridge
const isInApp = env.isInApp()
const isIOS =  env.isIOS()
const isAndroid =  env.isAndroid()
const loginApiUrl = '/v1/user/profile'
// 生产环境接口地址
export const AZURE_DOMAIN = 'https://coincola-app.azureedge.net'
// A 站接口地址
export const ALOC_DOMAIN = 'https://app.alocnioc.com'

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
  ccbridge.jsbridge.ui.showTips(String(msg), 3000)
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
   * Android: name, bitmap
   * iOS: imageName, thumbData
   * standard: eventName, bitmap
   */
  if (type === 2) {
    if (isAndroid) {
      params.name = params.eventName
    }

    if (isIOS) {
      params = {
        ...params,
        url: '',
        thumbData: params.bitmap,
        imageName: params.eventName
      }
    }
  } else if (type === 3) {
    // Android: desc, iOS: description, standard: description
    if (isAndroid) {
      params.desc = params.description
    }
  }

  ccbridge.jsbridge.ui.showShareMenu(type, params)
}

// https://segmentfault.com/a/1190000007616673
export function copyToClipboard (text) {
  var aux = document.createElement('input')
  aux.setAttribute('value', text)
  document.body.appendChild(aux)
  aux.select()
  document.execCommand('copy')
  document.body.removeChild(aux)
}
