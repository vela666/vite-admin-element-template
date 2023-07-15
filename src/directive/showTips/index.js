import { isObject } from '@/utils/validate'
import { getActualWidthOfChars } from '@/utils'
import { autoUpdateElementPos } from '@/utils/dom'
import { throttle } from 'lodash-es'

// 单行 超出文字显示...并显示文字提示框 只需要设置元素宽即可
export default {
  // el {element} 当前元素
  mounted(el, binding) {
    const {
      delay = 300,
      place = 'top',
      className = '',
      hide = true,
    } = isObject(binding.value) ? binding.value : {}
    // 鼠标移入
    let setId = null
    let tooltipId = null
    el.classList.add('n-only-tooltip', 'ellipsis')
    let fn = throttle(function (e) {
      // mousemove 事件
      // if (e.path.some(item => /n-only-tooltip/.test(item.className))) {
      if (
        e.relatedTarget?.matches('.n-only-tooltip') &&
        e.target.matches('.n-only-tooltip')
      ) {
        clearTimeout(tooltipId)
      }
      tooltipId = setTimeout(() => {
        // mousemove 事件
        // if (!e.path.some(item => /n-only-tooltip/.test(item.className))) {
        if (
          !e.relatedTarget?.matches('.n-only-tooltip') &&
          !e.target.matches('.n-only-tooltip')
        ) {
          let tooltip = document.getElementById('tooltip')
          window.removeEventListener('mouseover', fn)
          if (tooltip) {
            tooltip.onmouseleave = null
            tooltip.remove()
          }
          clearTimeout(tooltipId)
          tooltipId = null
        }
      }, 300)
    }, 300)
    // 鼠标移入
    el.onmouseenter = function (e) {
      // scrollWidth获取总宽度 包含超出  显示提示框
      let textWidth = getActualWidthOfChars(el.innerText)
      // if (el.scrollWidth > el.offsetWidth) {
      if (
        el.innerText &&
        (textWidth > el.offsetWidth || el.scrollWidth > el.offsetWidth)
      ) {
        // el.style.cursor = 'pointer'
        clearTimeout(setId)
        setId = setTimeout(() => {
          let tooltip = document.getElementById('n-tooltip')
          tooltip && tooltip.remove()
          // 创建浮层元素并设置样式
          const div = document.createElement('div')
          const i = document.createElement('i')
          div.classList.add('n-tooltip', 'n-only-tooltip')
          i.classList.add('n-tooltip-arrow')
          // 设置id方便寻找
          div.setAttribute('id', 'tooltip')
          // 浮层中的文字
          div.innerHTML = `<div class="n-tooltip-overflow n-only-tooltip ${className}">${el.innerText}</div>`
          div.onmouseleave = function () {
            clearTimeout(tooltipId)
            tooltipId = null
            this.onmouseleave = null
            this.remove()
          }
          // 将浮层插入到body中
          div.appendChild(i)
          document.body.appendChild(div)
          // 让提示元素的位置始终保持在正确位置
          autoUpdateElementPos(this, div, i)

          clearTimeout(setId)
          setId = null
        }, delay)
      }
    }
    // 鼠标移出
    el.onmouseleave = function () {
      // el.style.cursor = 'default'
      if (hide) {
        let id = setTimeout(() => {
          // 找到浮层元素并移除
          const tooltip = document.getElementById('tooltip')
          tooltip && document.body.removeChild(tooltip)
          clearTimeout(id)
          id = null
        }, 300)
        return
      }
      window.addEventListener('mousemove', fn)
    }
  },
  // 指令与元素解绑时
  beforeUnmount(el) {
    el.onmouseenter = null
    el.onmouseleave = null
    // 找到浮层元素并移除
    let tooltip = document.getElementById('tooltip')
    tooltip && tooltip.remove()
  },
}
