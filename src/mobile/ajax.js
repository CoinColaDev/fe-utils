import ccbridge from './ccbridge'

const isInApp = ccbridge.env.isInApp()
/**
 * 生产环境的 basePath 请设置为 https://coincola-app.azureedge.net
 * A 站的 basePath 为 https://app.alocnioc.com
 */
let basePath = ''
let globalAjaxHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'X-Requested-With': 'XMLHttpRequest'
}
let globalAjaxParams = {}
const mockState = {
  get: {},
  post: {}
}

function mock (url, method, res) {
  mockState[method.toLowerCase()][url] = res
}

mock.delay = 500

export function serialize (obj) {
  return Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&')
}

function nativeRequest ({url, params = {}, method = 'POST'}) {
  return new Promise((resolve, reject) => {
    const mockData = mockState[method.toLocaleLowerCase()][url]
    if (mockData) {
      setTimeout(function () {
        resolve(typeof mockData === 'function' ? mockData(params) : mockData)
      }, mock.delay)
      return
    }

    const jsbridge = ccbridge.jsbridge
    if (!jsbridge || !jsbridge.data || !jsbridge.data.ajax) {
      reject(new Error(`No jsbridge found on url: ${window.location.href}`))
      return
    }

    jsbridge.data.ajax(basePath + url, method, params, function (json = {}) {
      if (json && json.code === 0) {
        resolve(json)
      } else {
        const error = new Error(json.message || `${method} error for url ${basePath + url}`)
        if (json.code) {
          error.code = json.code
        }
        reject(error)
      }
    })
  })
}

function webRequest ({url, params = {}, method = 'POST'}) {
  if (!url) {
    return Promise.reject(new Error('Arguments Error'))
  }

  return new Promise((resolve, reject) => {
    const mockData = mockState[method.toLocaleLowerCase()][url]
    if (mockData) {
      setTimeout(function () {
        resolve(typeof mockData === 'function' ? mockData(params) : mockData)
      }, mock.delay)
      return
    }

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

ajax.mock = mock

export default ajax