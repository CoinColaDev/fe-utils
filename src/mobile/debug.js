const CONSOLE_SCRIPT_URL = 'https://files-alocnioc-1251297012.cos.ap-hongkong.myqcloud.com/libs/eruda.js'

const WEINRE_SCRIPT_PATH = '/target/target-script-min.js#anonymous'

function injectScript (url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.async = true
    script.src = url
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      reject(new Error(`Load script error: ${url}`))
    }
    document.head.appendChild(script)
  })
}

export default function debug (weinreDomain) {
  injectScript(CONSOLE_SCRIPT_URL).then(() => {
    window.eruda.init()
  })
  injectScript(`${weinreDomain}${WEINRE_SCRIPT_PATH}`)
}
