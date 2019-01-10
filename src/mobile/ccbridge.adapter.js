/**
 * Adapter for web
 */

import ccbridge, { modules } from "./ccbridge"

if (process.env.NODE_ENV === 'development') {
  const noop = (modName, methodName) => {
    console.log(
      `[Adpater Init] ccbrige.jsbridge.${modName}.${methodName}`
    )
    return function() {
      console.log(`[Adpater Invoke] ccbridge.jsbridge.${modName}.${methodName}`, arguments)
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
}
