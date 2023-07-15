// 本地写好的路由  src/router/routes.js里的 asyncRoutes
import Layout from "@/layout/index.vue";
const data =  [
  {
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
        path: '/table/table1',
        name: 'Table1',
        component: () => import('@/views/table/table1'),
        meta: {
          title: '表格1',
          noCache: false,
        },
      },
      {
        path: '/table/table2',
        name: 'Table2',
        component: () => import('@/views/table/table2'),
        meta: {
          title: '表格2',
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
  },
  {
    path: '/external-link',
    name: 'ExternalLink',
    component: Layout,
    search: true,
    meta: { title: '外链', icon: 'outside' },
    children: [
      {
        path: 'https://github.com/mvpyb/vite-element-admin',
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
