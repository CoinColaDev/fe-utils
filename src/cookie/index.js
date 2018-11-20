export function get (key) {
  let reg = new RegExp(key + '=([^;]*)')
  try {
    return document.cookie.match(reg)[1]
  } catch (e) {
    return false
  }
}

export function set (key, value, expires) {
  let exp = ''
  if (expires) {
    exp = new Date(new Date().getTime() + expires).toGMTString()
  } else {
    exp = 'Session'
  }
  document.cookie = key + '=' + value + ';path=/; expires=' + exp
}

export function del (key) {
  let expires = new Date()
  expires.setTime(expires.getTime() - 1000)
  document.cookie = key + '=xxx;path=/;expires=' + expires.toGMTString()
}
