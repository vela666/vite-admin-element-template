// 水印
let text = ''
let font = '16px norma'
let fillStyle = 'rgba(180, 180, 180, 0.3)'

function getDataUrl() {
  const rotate = -20
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.rotate((rotate * Math.PI) / 180)
    ctx.font = font
    ctx.fillStyle = fillStyle
    ctx.textAlign = 'left'
    ctx.fillText(text || '水印', 100, 100)
  }
  return canvas?.toDataURL('image/png')
}

// src/utils/waterMark.ts
function waterMarkStyle() {
  const waterMarkUrl = getDataUrl()
  return `background-image: url(${waterMarkUrl});position: absolute;left: 0;top: 0;width: 100%;height:100vh;pointer-events:none;background-repeat: repeat;`
}
function setWaterMark(target = document.body) {
  const waterMark = document.createElement('div')
  let style = waterMarkStyle()
  waterMark.setAttribute('id', 'js-watermarker')
  waterMark.setAttribute('style', style)
  if (target) {
    // 父元素设置相对定位
    target.setAttribute('style', 'position: relative;')
    // 将带水印的 div 添加到容器中
    target.appendChild(waterMark)
  }
}

// src/utils/waterMark.ts
const mutationConfig = {
  attributes: true,
  childList: true,
  subtree: true,
  // attributeFilter: ['style'],
  // attributeOldValue: true,
}

function callbackBody(mutationsList, observer) {
  const targetDom = document.querySelector('#js-watermarker')
  // 监听是否还有 #js-watermarker 元素
  if (!targetDom) {
    setWaterMark()
  } else {
    const curStyle = targetDom?.getAttribute('style')
    // 有元素，但是 style 内容不一致，需要重新设置 style
    let style = waterMarkStyle()
    if (curStyle !== style) {
      // 避免进入死循环
      // observerBody.disconnect()
      targetDom.setAttribute('style', style)
    }
  }
}

const observerBody = new MutationObserver(callbackBody)

export default {
  mounted(el, { value }) {
    text = value
    setWaterMark()
    observerBody.observe(document.body, mutationConfig)
  },
  // 当传进来的值更新的时候触发
  updated(el, { value }) {
    text = value
    callbackBody()
  },
  // 指令与元素解绑的时候，移除事件绑定
  beforeUnmount(el) {
    const targetDom = document.querySelector('#js-watermarker')
    targetDom && targetDom.remove()
    observerBody.disconnect()
  },
}
