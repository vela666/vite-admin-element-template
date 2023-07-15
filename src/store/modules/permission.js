import { defineStore } from 'pinia'
import { computed, markRaw, reactive, toRefs } from 'vue'
import { generateRoute1, generateRoute2, generateRoute3 } from './utils'
import { data as menuData1 } from './data/menu1.json'
import { data as menuData3 } from './data/menu3.json'
import { asyncRoutes } from '@/router/routes'

export default defineStore('permission', () => {
  const state = reactive({
    // 请求了菜单
    asyncRoutesRequested: false,
    // 原始路由即 没有只做了路由映射的
    routes: [],
  })
  const generateRoutes = computed(() => {
    return generateRoute1(asyncRoutes || [])
    // return generateRoute2(menuData1)
    // return generateRoute3(menuData3)
  })

  // 获取菜单
  const getMenus = async () => {
    /* // 根据用户类型获取当前用户菜单
    // const { data } = await getMenuInfo()
    const { data } = menuMock
    // console.log('根据用户类型获取当前用户菜单 => ', data)
    // 过滤一遍菜单，除了首页以外，其他菜单如果二级菜单为空，在移除该以及菜单
    let _data = []
    data.forEach((menu) => {
      if (menu.menu_path === '/home') {
        _data.push(menu)
      } else {
        if (Array.isArray(menu.children) && menu.children.length > 0) {
          _data.push(menu)
        }
      }
    })
    // 手动添加部分特殊页面到指定动态菜单下（不显示在菜单栏中请添加属性hidden值为true）
    const special_page_map = new Map([
      [
        '/asset/material',
        [
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2022-07-11 09:53:25',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdfe5b49f684d434466cb9731a1',
            menu_name: '待办空间',
            menu_path: '/asset/material/examine',
            menu_sort: 2,
            type: 0,
          },
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2022-07-11 09:53:25',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdfe5b49f684d434477cb9731a2',
            menu_name: '批阅空间',
            menu_path: '/asset/material/examine/examine-workspace',
            menu_sort: 2,
            type: 0,
          },
          {
            menu_id: 'a4dbec34d4ee64c5bbdba1f95903bd2b1',
            not_handle: true,
            type: 0,
            menu_name: '个人资产',
            button_name: '',
            menu_sort: 6,
            menu_icon: '',
            menu_path: '/asset/private-assetsl',
            is_cache: false,
            menu_type: 0,
            is_enable: 0,
            create_time: '2022-09-05 10:33:53',
            children: [
              {
                menu_id: 'a7ed3922b7141c790b95c34af39730423',
                type: 0,
                menu_name: '个人素材库',
                button_name: '',
                menu_sort: 0,
                menu_icon: '',
                menu_path: '/asset/private-assetsl/material/index',
                is_cache: true,
                menu_type: 0,
                is_enable: 0,
                create_time: '2022-09-05 10:35:03',
                children: [],
              },
              {
                menu_id: 'a7ed3922b7141c790b95c34af3973099a',
                type: 0,
                menu_name: '回收站',
                button_name: '',
                menu_sort: 0,
                menu_icon: '',
                menu_path: '/asset/private-assetsl/recovery/index',
                is_cache: true,
                menu_type: 0,
                is_enable: 0,
                create_time: '2022-09-22 10:41:47',
                children: [],
              },
            ],
          },
        ],
      ],
      [
        '/asset/toutiao/target',
        [
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2021-09-27 10:42:41',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdfe5b49f684d434488cb9731a4',
            menu_name: '定向包',
            menu_path: '/asset/toutiao/target/addTarget',
            menu_sort: 2,
            type: 0,
          },
        ],
      ],
      [
        '/asset/toutiao/event-management',
        [
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2022-04-06 16:52:00',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdfe5b49f644d434488cb9731a5',
            menu_name: '事件资产详情',
            menu_path: '/asset/toutiao/event-management/EventAssetDetails',
            menu_sort: 2,
            type: 0,
          },
        ],
      ],
      [
        '/asset/kuaishou/target',
        [
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2021-12-24 10:00:00',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdfe5b49f684d434488cb9731a8',
            menu_name: '定向包',
            menu_path: '/asset/kuaishou/target/AddTarget',
            menu_sort: 2,
            type: 0,
          },
        ],
      ],
      [
        '/platform/toutiao',
        [
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2021-10-20 14:52:28',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdff684d434488cbe5b499731a5',
            menu_name: '程序化创建',
            menu_path: '/platform/toutiao/programmed',
            menu_sort: 2,
            type: 0,
          },
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2021-12-15 16:21:48',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdff684d434488cbe5b499731a6',
            menu_name: '定时任务详情',
            menu_path: '/platform/toutiao/advertising/task/details',
            menu_sort: 2,
            type: 0,
          },
        ],
      ],
      [
        '/platform/kuaishou/advertising',
        [
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2021-10-20 14:52:28',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdff684d434488cbe5b499731a6',
            menu_name: '程序化创建',
            menu_path: '/platform/kuaishou/programmed',
            menu_sort: 2,
            type: 0,
          },
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2022-03-08 15:37:35',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdff684d434488cbe5b499731a12',
            menu_name: '定时任务详情',
            menu_path: '/platform/kuaishou/advertising/task/details',
            menu_sort: 2,
            type: 0,
          },
        ],
      ],
      [
        '/platform/google/advertising',
        [
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2021-10-20 14:52:28',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdff684d434488cbe5b499731a7',
            menu_name: '程序化创建',
            menu_path: '/platform/google/programmed',
            menu_sort: 2,
            type: 0,
          },
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2022-04-18 10:44:00',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdff684d434488cbe5b499731at5',
            menu_name: '详情信息',
            menu_path: '/platform/google/advertising/task/details',
            menu_sort: 2,
            type: 0,
          },
        ],
      ],
      [
        '/asset/facebook/protected-audience',
        [
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2022-6-21 16:00:00',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdfe5b49f684d434488cb973ase',
            menu_name: '保存的受众',
            menu_path: '/asset/facebook/protected-audience/AddAudience',
            menu_sort: 2,
            type: 0,
          },
        ],
      ],
      [
        '/platform/facebook/advertising',
        [
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2022-06-28 16:27:32',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdff684d434488cbe5b499731a8',
            menu_name: '程序化创建',
            menu_path: '/platform/facebook/programmed',
            menu_sort: 2,
            type: 0,
          },
        ],
      ],
    ])

    function add_page(list) {
      list.forEach((i) => {
        const page = special_page_map.get(i.menu_path)
        if (page) {
          list.push(...page)
        }
        if (i.children && i.children.length > 0) {
          add_page(i.children)
        }
      })
    }

    add_page(_data)
    // 排序
    _data = _data.map((item) => {
      if (/^\/asset$/.test(item.menu_path)) {
        item.children.sort((a, b) => b.menu_sort - a.menu_sort)
      }
      return item
    })*/
    // 存储原始格式的路由 用于菜单渲染
    state.routes = markRaw(asyncRoutes)
    // state.routes = markRaw(generateRoute2(menuData1, false, false))
    // state.routes = markRaw(generateRoute3(menuData3, false, false))
    console.log(generateRoutes.value)
    state.asyncRoutesRequested = true
  }

  return {
    ...toRefs(state),
    generateRoutes,
    getMenus,
  }
})
