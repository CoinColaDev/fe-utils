import request from 'superagent/lib/client'
import getLogger from '../logger'

const log = getLogger('utils/ajax')
const noop = function () {}
const settings = {
  baseUrl: '',
  // 处理函数
  url: null,
  // 处理函数
  headers: noop,
  success: noop
}

export const ajax = (method, dataMethod, contentType) => {
  return (url, params = {}, headers = {}) => {
    return new Promise((resolve, reject) => {
      url = settings.url ? settings.url(url) : url
      headers = {
        ...settings.headers(),
        ...headers
      }
      request[method](`${settings.baseUrl}${url}`)
        .timeout({
          response: 30000,
          deadline: 60000
        })
        .type(contentType)[dataMethod](params)
        .set(headers)
        .end((err, res) => {
          if (err) {
            log(err)
            // request aborted or server is down
            if (err.crossDomain) {
              return
            }

            return reject(err)
          }

          // backend down
          if (!res.body) {
            return reject(new Error('Code: BACKEND_ERROR'))
          }

          res.data = res.body
          // 返回错误对象则 reject
          const result = settings.success({ response: res, url, params, headers })
          if (result) {
            reject(result)
            return
          }

          resolve(res)
        })
    })
  }
}

export const post = ajax('post', 'send', 'form')

export const get = ajax('get', 'query', 'json')

export const postJson = ajax('post', 'send', 'application/json')

export const setup = opts => {
  Object.assign(settings, opts)
}
