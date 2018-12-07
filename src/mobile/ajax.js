import ccbridge from './ccbridge'

const isInApp = ccbridge.isInApp()
let basePath = ''

let globalAjaxHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded'
}
let globalAjaxParams = {}

export function serialize (obj) {
  return Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&')
}

function nativeRequest ({url, params = {}, method = 'POST'}) {
  return new Promise((resolve, reject) => {
    ccbridge.data.ajax(basePath + url, method, params, function (json) {
      if (json && json.code === 0) {
        resolve(json)
      } else {
        reject(new Error(json ? json.message : 'Unknown Error'))
      }
    })
  })
}

function webRequest ({url, params = {}, method = 'POST'}) {
  if (!url) {
    return Promise.reject(new Error('Arguments Error'))
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, basePath + url, true)
    Object.keys(globalAjaxHeaders).forEach(key => {
      xhr.setRequestHeader(key, globalAjaxHeaders[key])
    })
    xhr.onload = function(e) {
      try {
        const json = JSON.parse(this.responseText)
        if (json && json.code === 0) {
          resolve(json)
        } else {
          reject(new Error(json.message))
        }
      } catch (e) {
        reject(e)
      }
    }
    xhr.onerror = function (e) {
      reject(e)
    }

    xhr.send(method === 'POST' ? serialize({
      ...params,
      ...globalAjaxParams
    }) : null)
  })
}

const ajax = isInApp ? nativeRequest : webRequest

ajax.setBasePath = base => {
  basePath = base
}

ajax.get = function (url) {
  return ajax({
    url,
    method: 'GET'
  })
}

ajax.post = function (url, params) {
  return ajax({
    url,
    params,
    method: 'POST'
  })
}

ajax.setup = function ({params = {}, headers = {}}) {
  globalAjaxParams = {
    ...globalAjaxParams,
    ...params
  }
  globalAjaxHeaders = {
    ...globalAjaxHeaders,
    ...headers
  }
}

export default ajax