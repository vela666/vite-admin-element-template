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

/**
 * @description 映射枚举对象
 * @param data {Array} 枚举数据
 * [
 *   {
 *     type: 0,
 *     label: '正常',
 *     class: 'success-status',
 *   },
 *   {
 *     type: 1,
 *     label: '禁用',
 *   }
 * ]
 * @param valueKey {String} 对象键
 * @param labelKey {String} 对象值
 * @param needObjValue {Boolean}
 * @returns {Object}
 * objValue false
 * {
 *     "0": "正常",
 *     "1": "禁用",
 * }
 * objValue true
 * {
 *     "0": {
 *         "type": 0,
 *         "label": "正常",
 *         "class": "success-status"
 *     },
 *     "1": {
 *         "type": 1,
 *         "label": "禁用"
 *     },
 * }
 */
export function getEnum({
  data = [],
  valueKey = 'type',
  labelKey = 'label',
  needObjValue = false,
}) {
  return data.reduce((acc, cur) => {
    acc[cur[valueKey]] = needObjValue ? cur : cur[labelKey]
    return acc
  }, {})
}
