export default function getLogger (label = 'default') {
  function log (title, ...rest) {
    if (rest.length) {
      const obj = rest.length > 1 ? rest : rest[0]
      // 输出数组格式方便一点
      console.log(`[${label}]`, title, obj)
    } else {
      console.log(`[${label}]`, title)
    }
  }

  log.error = (title, ...rest) => {
    if (rest.length) {
      const obj = rest.length > 1 ? rest : rest[0]
      // 输出数组格式方便一点
      console.error(`[${label}]`, title, obj)
    } else {
      console.error(`[${label}]`, title)
    }
  }

  return log
}

// const logger = getLogger('utils/logger')
// logger('info')
// logger.error('errored')
