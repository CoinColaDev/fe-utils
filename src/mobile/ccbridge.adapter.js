/**
 * Adapter for web
 */

import ccbridge, { modules } from "./ccbridge"

const noop = (modName, methodName) => {
  console.log(
    `**** Adpater for ccbrige.jsbridge.${modName}.${methodName} ****`
  )
  return function() {
    console.log(`**** ccbridge adapter method ****`)
    console.log(modName, methodName, arguments)
  }
}

ccbridge.onReady(injected => {
  if (injected === false) {
    const { jsbridge } = ccbridge
    modules.forEach(mod => {
      mod.methods.forEach(method => {
        if (!jsbridge[mod.name]) {
          jsbridge[mod.name] = {}
        }
        jsbridge[mod.name][method] = noop(mod.name, method)
      })
    })

    jsbridge.ui.setPageTitle = title => (document.title = title)
    jsbridge.ui.openWebPage = url => (window.location.href = url)
  }
})
