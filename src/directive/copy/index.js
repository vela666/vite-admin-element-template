import { debounce } from 'lodash-es'
import { ElMessage } from 'element-plus'
let elMessage = null
export default {
  mounted(el, { value, arg }) {
    el.$value = value || el.innerText
    if (!el.$value) return
    el.handler = debounce(() => {
      elMessage && elMessage.close()
      const input = document.createElement('input')
      input.value = el.$value
      document.body.appendChild(input)
      input.select()
      document.execCommand('Copy')
      input.remove()
      elMessage = ElMessage.success({
        message: '复制成功',
        duration: 500,
      })
    }, 300)
    // 绑定点击事件，就是所谓的一键 copy 啦
    el.addEventListener('click', (e) => {
      // 是否允许事件冒泡  true不允许( v-copy:stop="val" ) false允许( v-copy="val" )
      arg && e.stopPropagation()
      el.handler()
    })
  },
  // 当传进来的值更新的时候触发
  updated(el, { value }) {
    el.$value = value || el.innerText
  },
  // 指令与元素解绑的时候，移除事件绑定
  beforeUnmount(el) {
    el.removeEventListener('click', el.handler)
  },
}
