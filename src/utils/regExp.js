// 匹配前后的斜杠
// '/chart-example'.replace(firstAndLastSlash, '').split('-')
export const firstAndLastSlash = /^\/+|\/+$/g
// 获取最后一个/的值且不包含后缀
// let path = './language/zh.js';
// let regex = /\/([^/]+?)(?=\.[^.\\/]+$|$)/; // 匹配最后一个斜杠前的内容
// console.log(path.match(regex))

// 获取最后一个/的值
// let path = './language/zh.js'
// let regex = /\/([^/]+)$/ // 匹配最后一个斜杠后面的内容
// console.log(path.match(regex)?.[1])
