import router from './router'
import useUserStore from '@/store/modules/users'
import usePermissionStore from '@/store/modules/permission'
import { getToken } from '@/utils/auth'

import getPageTitle from '@/utils/getPageTitle'

import NProgress from '@/plugins/progress'

const whiteList = ['/login']
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (permissionStore.asyncRoutesRequested) {
        next()
      } else {
        try {
          await userStore.getUserInfo()
          await permissionStore.getMenus()
          if (permissionStore.generateRoutes.length > 0) {
            permissionStore.generateRoutes.forEach((route) => {
              router.addRoute(route.name, route)
            })

            /* // 这个方式需要使用hash模式 不然404页面进不去
            const pathList = getPathList(store.generateRoutes)
            // 如果不包含直接跳转路由数组里的第一个
            if (!pathList.includes(to.path)) {
              // to.path = pathList[0]
              console.log(pathList)
              return {
                ...to,
                path: pathList[0],
                replace: true,
              }
            } else {
              return { ...to, replace: true }
            }*/
            // 当没有 / 时，重定向到第一个路由
            router.addRoute({
              path: '/',
              name: 'Index',
              redirect: permissionStore.generateRoutes[0].path,
            })
          }

          next({ ...to, replace: true })
        } catch (error) {
          await userStore.resetInfo()
          next('/login')
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`)
    }
  }
})

router.afterEach((to) => {
  NProgress.done()
  document.title = getPageTitle(to.meta?.title)
})
