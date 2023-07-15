import {
  createRouter,
  createWebHistory,
  // createWebHashHistory,
  // createMemoryHistory,
} from 'vue-router'
import { constantRoutes, notFoundRoute } from './routes'

// 配置路由信息
const router = createRouter({
  history: createWebHistory('./'),
  // createMemoryHistory 实现不管在哪个路由 始终保持 URL 不变(iframe也可)
  // history: createMemoryHistory(),
  routes: [...constantRoutes, notFoundRoute],
  // scrollBehavior: () => ({ left: 0, top: 0 }),
})
const WHITE_NAME_LIST = ['Login']
// 白名单应该包含基本静态路由
/*const getRouteNames = (array) => {
  array.forEach((item) => {
    WHITE_NAME_LIST.push(item.name)
    getRouteNames(item.children || [])
  })
}

getRouteNames()*/

export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export default router
