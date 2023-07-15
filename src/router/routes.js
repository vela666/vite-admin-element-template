import Layout from '@/layout'
import viewsRoutes from './autoImportViews'
/**
 * hidden: true                  如果设置为true，项目将不会显示在侧边栏中（默认为false）
 * search: true                  如果设置为true将不会右上角搜索菜单结果中显示（默认为false）
 * redirect: noRedirect           如果设置为noRedirect，则面包屑中将不会重定向
 * name:'router-name'             该名称由＜keep-alive＞使用（必须设置！！！）
 * meta : {
    roles: ['admin','editor']    控制页面角色（可以设置多个角色） 可不用
    title: 'title'               侧边栏和面包屑中显示的名称
    icon: 'svg-name'/'el-icon-x' 显示的图标
    noCache: true                如果设置为true，则不会缓存页面（默认值为false）
    affix: true                  如果设置为true，则标签将粘贴在标签视图中 tagsView里 一直保持第一个
    alwaysShow: true               如果设置为true，将始终显示根菜单  如果不设置alwaysShow，当项目有多个子路由时，它将变为嵌套模式，否则不显示根菜单
    breadcrumb: false            如果设置为false，则该项将隐藏在面包屑中（默认值为true）
    activeMenu: '/example/list'  如果设置了路径，侧边栏将突出显示您设置的路径
  }
 */

export const constantRoutes = [
  {
    path: '/reolad',
    name: 'Reolad',
    component: Layout,
    hidden: true,
    meta: {
      title: 'Reolad',
    },
    children: [
      {
        path: '/reolad/:path(.*)',
        name: 'Reolad',
        component: () => import('@/views/reolad'),
        meta: {
          title: '重新加载',
          hidden: true,
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    hidden: true,
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true,
      title: '登录',
    },
  },
  {
    path: '/401',
    name: 'Error401',
    hidden: true,
    component: () => import('@/views/error/401.vue'),
    meta: {
      title: '401',
    },
  },
  {
    path: '/500',
    name: 'Error500',
    component: () => import('@/views/error/500.vue'),
    hidden: true,
    meta: {
      title: '500',
    },
  },
]

export const asyncRoutes = [
  ...viewsRoutes,
  /* {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Home',
    meta: { title: '主页', icon: 'dashboard' },
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/home'),
        name: 'Dashboard',
        meta: { title: '主页', icon: 'dashboard', affix: true },
      },
    ],
  },
  {
    path: '/table',
    name: 'Table',
    component: Layout,
    redirect: '/table/table1',
    meta: {
      title: '表格相关',
      icon: 'table',
      noCache: false,
    },
    children: [
      {
        path: '/table/merge1',
        name: 'Table2',
        component: () => import('@/views/table/merge1'),
        meta: {
          title: '合并1',
          noCache: false,
        },
      },
      {
        path: '/table/merge2',
        name: 'Table2',
        component: () => import('@/views/table/merge2'),
        meta: {
          title: '合并2',
          noCache: false,
        },
      },
    ],
  },
  {
    path: '/nested',
    name: 'Nested',
    component: Layout,
    redirect: '/nested/menu1/menu1-1',
    meta: {
      title: '嵌套路由',
      icon: 'nested',
      noCache: false,
      roles: ['admin'],
    },
    children: [
      {
        path: '/nested/menu1',
        name: 'Menu1',
        component: () => import('@/views/nested/menu1'),
        meta: {
          title: 'menu1',
          noCache: false,
        },
        redirect: '/nested/menu1/menu1-1',
        children: [
          {
            path: '/nested/menu1/menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: {
              title: 'menu1-1',
              noCache: false,
            },
          },
          {
            path: '/nested/menu1/menu1-2',
            name: 'Menu1-2',
            redirect: '/nested/menu1/menu1-2/menu1-2-1',
            component: () => import('@/views/nested/menu1/menu1-2'),
            meta: {
              title: 'menu1-2',
              noCache: false,
            },
            children: [
              {
                path: '/nested/menu1/menu1-2/menu1-2-1',
                component: () =>
                  import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: {
                  title: 'menu1-2-1',
                  noCache: false,
                },
              },
              {
                path: '/nested/menu1/menu1-2/menu1-2-2',
                component: () =>
                  import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: {
                  title: 'menu1-2-2',
                  noCache: false,
                },
              },
            ],
          },
        ],
      },
      {
        path: '/nested/menu2',
        name: 'Menu2',
        component: () => import('@/views/nested/menu2'),
        meta: {
          title: 'menu2',
          noCache: false,
          // icon : 'devices',
          roles: ['admin'],
        },
      },
      {
        path: '/nested/menu3',
        name: 'Menu3',
        component: () => import('@/views/nested/menu3'),
        meta: {
          title: 'menu3',
          noCache: false,
          // icon : 'devices',
          roles: ['admin'],
        },
      },
    ],
  },*/
  {
    path: '/external-link',
    name: 'ExternalLink',
    component: Layout,
    search: true,
    meta: { title: '外链', icon: 'outside' },
    children: [
      {
        path: 'https://github.com/vela666/vite-admin-template',
        name: 'Github',
        meta: { title: 'github' },
      },
      {
        path: 'https://staging-cn.vuejs.org/',
        name: 'VUE3',
        meta: { title: 'VUE3' },
      },
    ],
  },
]

export const notFoundRoute = {
  path: '/:pathMatch(.*)*',
  // 不要写name不然动态路由 页面刷新就在404页面
  // name: 'Redirect404',
  hidden: true,
  meta: {
    title: '404',
  },
  component: () => import('@/views/error/404'),
}
