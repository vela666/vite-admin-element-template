import { createApp } from 'vue'
// 引入ElementPlus
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import router from './router'
import { registerStore } from '@/store'
// https://github.com/vbenjs/vite-plugin-svg-icons/blob/main/README.zh_CN.md
import 'virtual:svg-icons-register'
import './permission'

// 导入公共样式
import './styles/index.scss'

// 自定义指令
import registerDirective from '@/directive'
// 国际化
import { setupI18n } from '@/locale'
// 注册所有element icons
import { setupElementIcons } from '@/plugins/elementIcons'
// vxe表格
import useVxeTable from '@/plugins/vxe-table'

// dayjs全局配置如插件 语言等
import '@/plugins/dayjs'

// https://lottiefiles.com/web-player?lottie_url=https%3A%2F%2Fassets6.lottiefiles.com%2Fpackages%2Flf20_Kr2vAt3caT.json
const app = createApp(App)

const initApp = async () => {
  app.use(ElementPlus, {
    locale: zhCn,
    namespace: 'el',
  })
  app.use(router)
  registerStore(app)
  await router.isReady()
  registerDirective(app)
  useVxeTable(app)
  setupI18n(app)
  setupElementIcons(app)
  app.mount('#app')
}
initApp()
