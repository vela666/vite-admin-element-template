// 获取数据类型字符串
export function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}
// getType(42) // "number"
// getType('Hello') // "string"
// getType(true) // "boolean"
// getType(undefined) // "undefined"
// getType(null) // "null"
// getType([]))// "array"
// getType({}) // "object"
// getType(function () {}) // "function"

export function isObject(arg) {
  return getType(arg) === 'object'
}

/**
 * @param {Object} arg
 * @returns {Boolean}
 */
export function isDate(arg) {
  return getType(arg) === 'date'
}

/**
 * @param {Object} arg
 * @returns {Boolean}
 */
export function isNumber(arg) {
  return getType(arg) === 'number'
}

/**
 * @param {Object} arg
 * @returns {Boolean}
 */
export function isPromise(value) {
  return value instanceof Promise
}
// isPromise(Promise.resolve()) // true
// isPromise(new Promise(() => {})) // true
// isPromise({}))// false
// isPromise('Hello') // false

/**
 * @param {string} arg
 * @returns {Boolean}
 */
export function isString(arg) {
  return getType(arg) === 'string'
}

/**
 * @param {Object} arg
 * @returns {Boolean}
 */
export function isFunction(arg) {
  return getType(arg) === 'function'
}

/**
 * @param {Object} arg
 * @returns {Boolean}
 */
export function isBoolean(arg) {
  return getType(arg) === 'boolean'
}

/**
 * @param {Object} arg
 * @returns {Boolean}
 */
export function isRegExp(arg) {
  return getType(arg) === 'regexp'
}

export function isElement(arg) {
  return isObject(arg) && !!arg.tagName
}

export function isMap(arg) {
  return getType(arg) === 'map'
}

/**
 * @param {string} arg
 * @returns {Boolean}
 */
export function isExternal(arg) {
  // return /^(https?:|mailto:|tel:)/.test(arg)
  return /(https?:|mailto:|tel:)/.test(arg)
}
// 获取 '/external-link/https://staging-cn.vuejs.org/aaa/asdasdwr'中的 https://staging-cn.vuejs.org
export function getUrl(link) {
  return link.match(/(https?:|mailto:|tel:)\/*[^/\s]*/g)
}
/**
 * @param {Object} arg
 * @returns {Boolean}
 */
export function isIterable(arg) {
  return arg != null && typeof arg[Symbol.iterator] === 'function'
}

/**
 * @param {string} arg
 * @returns {Boolean}
 */
export function validPhone(arg) {
  let pass = false
  const val = String(arg).trim()
  if (
    !/^(0|86|17951)?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9])[0-9]{8}$/i.test(
      val,
    )
  ) {
    pass = false
  } else {
    pass = true
  }
  return pass
}

/**
 * @param {string} arg
 * @returns {Boolean}
 */
export function validURL(arg) {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(arg)
}

/**
 * @param {string} arg
 * @returns {Boolean}
 */
export function validLowerCase(arg) {
  const reg = /^[a-z]+$/
  return reg.test(arg)
}

/**
 * @param {string} arg
 * @returns {Boolean}
 */
export function validUpperCase(arg) {
  const reg = /^[A-Z]+$/
  return reg.test(arg)
}

/**
 * @param {string} arg
 * @returns {Boolean}
 */
export function validAlphabets(arg) {
  const reg = /^[A-Za-z]+$/
  return reg.test(arg)
}

/**
 * @param {string} arg
 * @returns {Boolean}
 */
export function validEmail(arg) {
  const reg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(arg)
}

/**
 * @description 校验身份证号码
 * @param {string} arg
 * @returns {Boolean}
 */
export function validID(arg) {
  const reg =
    /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
  return reg.test(arg)
}

/**
 * @description 判断是不是DOM数据类型
 * @date 2022-01-12
 */
export function isDOMStringMap(val) {
  return getType(val) === 'domstringmap'
}

/**
 * @description 判断 HtmlElement
 * @param {Object} node
 * @returns {Boolean}
 * @author fengjin
 * @date 2021-07-22 09:44:58
 */
export function isHtmlElement(node) {
  return node && node.nodeType === Node.ELEMENT_NODE
}

// 检测设备类型(手机返回true,反之)
export function isMobile() {
  const sUserAgent = navigator.userAgent.toLowerCase()
  // const bIsIpad = sUserAgent.match( /ipad/i ) == 'ipad'
  const bIsIphoneOs = sUserAgent.match(/iphone os/i) == 'iphone os'
  const bIsMidp = sUserAgent.match(/midp/i) == 'midp'
  const bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4'
  const bIsUc = sUserAgent.match(/ucweb/i) == 'ucweb'
  const bIsAndroid = sUserAgent.match(/android/i) == 'android'
  const bIsCE = sUserAgent.match(/windows ce/i) == 'windows ce'
  const bIsWM = sUserAgent.match(/windows mobile/i) == 'windows mobile'
  return !!(
    bIsIphoneOs ||
    bIsMidp ||
    bIsUc7 ||
    bIsUc ||
    bIsAndroid ||
    bIsCE ||
    bIsWM
  )
}
