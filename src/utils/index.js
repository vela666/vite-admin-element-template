import { validPhone } from './validate'
import { firstAndLastSlash } from './regExp'
// 单词首字母转大写
export function toUpperCaseWord(val) {
  if (!val) return ''
  return val.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function encryptionPhone(val) {
  const phone = val + ''
  if (!validPhone(phone)) {
    return ''
  }
  const reg = /^(\d{3})\d{4}(\d{4})$/
  return phone.replace(reg, '$1****$2')
}

// 匹配倒数第二个斜杠之间的内容 path = '/nested/menu1/menu1-2'
export function getPreviousContent(path) {
  const regex = /\/([^/]+)\/[^/]+$/
  const match = path.match(regex)
  // return match ? '/' + match[1] + '/' : ''
  // return match ? match[1] : path.replace(firstAndLastSlash, '')
  return match ? match[1] : path
}

/**
 * 使用canvas获取文本实际宽度
 * @param {string} text
 * @param {object} options {}
 * @returns number
 */
export function getActualWidthOfChars(text = '', options = {}) {
  const { size = 12, family = 'Microsoft YaHei' } = options
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.font = `${size}px ${family}`
  const metrics = ctx.measureText(text)
  return (
    Math.abs(metrics.actualBoundingBoxLeft) +
    Math.abs(metrics.actualBoundingBoxRight)
  )
}
