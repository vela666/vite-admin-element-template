import Layout from '@/layout'
import { firstAndLastSlash } from '@/utils/regExp'
import { dynamicRoutesModules, defaultPath } from '@/utils/handlerViews'

//  str = /nested/menu1/menu1-1/index  最后一个/的内容(且过滤掉/index) /menu1-1
// bool = true creative-label  false === CreativeLabel
export function toPascalCase(str, bool = true) {
  const tmp = str.replace(/\/index$/, '').match(/\/([^/]+)\/?$/g)?.[0] ?? str
  // const words = tmp.replace('/', '').split('-');
  const words = tmp.replace(firstAndLastSlash, '').split('-')
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  )
  // return capitalizedWords.join('-') || tmp; // creative-label === Creative-Label
  return capitalizedWords.join(bool ? '' : '-') || tmp // creative-label === CreativeLabel
}
// 完整路径
/*function fullPathSplicing(str) {
  const words = str
    .replace(/\/index$/, '')
    .split('/')
    .filter(Boolean)
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}*/
// console.log(fullPathSplicing('/table/table1')); //  "TableTable1"
// console.log(fullPathSplicing('/table')); //  // "Table"
// console.log(fullPathSplicing('/table/a-b')); // TableA-b
// 适用name会重复的问题
// useHyphen true = /table/a-b-c => TableA-B-C false = TableABC
// /platform/kuaishou/advertising = PlatformKuaishouAdvertising
export function fullPathSplicing(str, useHyphen = false) {
  return str
    .replace(/\/index$/, '')
    .replace(/\/([a-z])|-(.)/g, function (match, p1, p2) {
      if (p1) {
        return p1.toUpperCase()
      } else if (useHyphen) {
        return '-' + p2.toUpperCase()
      } else {
        return p2.toUpperCase()
      }
    })
}

// 路径转换 /path/example => PathExample
/*function formatRouteName(str) {
  return str
    .replace('/', '')
    .split('/')
    .map(
      (item) =>
        `${item.substring(0, 1).toUpperCase()}${item
          .substring(1)
          .toLowerCase()}`,
    )
    .join('')
}*/

// 父级记录N层子级标识
function getParentPath1(parent, childrenPath, key = 'path') {
  parent?.children?.forEach((child) => {
    childrenPath.push(child[key])
    child?.children && getParentPath1(child, childrenPath, key)
  })
}

// 父级记录下一层子级标识
function getParentPath2(parent, childrenPath, key = 'path') {
  parent.children?.forEach((child) => {
    childrenPath.push(child[key])
  })
}

/**
 * @description 映射动态路由(超过二级路由平铺为二级路由，解决keep-alive不缓存问题)
 * @param {Array} menus 后端接口返回的菜单列表
 * @param {Boolean} isOneLevel 路由嵌套级别 false 不平铺 true 平铺
 * @param {Boolean} needTiling 需不需平铺(渲染左侧或顶部菜单不平铺，动态添加路由平铺)
 */
// 如都不满足 自行修改映射逻辑

//适用于 路由格式  src/store/modules/data/menu1.json对应views2目录
// let firstLoop = true
export function generateRoute2(
  menus = [],
  isOneLevel = false,
  needTiling = true,
  parentPath = [],
) {
  const routes = []
  menus.forEach((item) => {
    const route = {
      path: item.menu_path,
      name: fullPathSplicing(item.menu_path),
      meta: {
        title: item.menu_name,
        noCache: !item.is_cache,
        id: item.menu_id,
        icon: item.menu_icon || 'menu',
        // 添加父级记录所有子级 标识
        hasSubs: [],
        // affix: false,
        // 子级记录所有父级 标识
        hasParents: [...parentPath],
      },
      component: null,
    }
    getParentPath1(item, route.meta.hasSubs, 'menu_path')

    // 去除第一个 /  /home/test2/ = home/test2/
    // const comp = item.menu_path.replace(/\//, '')
    // 去除路径前面和后面的 /
    const comp = item.menu_path.replace(firstAndLastSlash, '')
    if (item.children && item.children.length > 0) {
      // route.component =  Layout
      // 只有第一层应为Layout 防止 子级包含children 时 component 为 Layout
      route.component = !isOneLevel
        ? Layout
        : dynamicRoutesModules[`${defaultPath}${comp}.vue`]
      route.redirect = item.children[0].menu_path
      const parentMark = [...route.meta.hasParents, item.menu_path]
      if (isOneLevel && needTiling) {
        routes.push(
          ...generateRoute2(item.children, true, needTiling, parentMark),
        )
      } else {
        route.children = generateRoute2(
          item.children,
          true,
          needTiling,
          parentMark,
        )
        // 第一个路由添加 affix 标识 固定
        /*if (firstLoop) {
                  route.children[0].meta.affix = true
                }*/
      }
      // firstLoop = false
    } else {
      // comp 路由文件目录位置
      // '../../views/b/index.vue'.match(/[^/]*\.vue$/) 获取文件名index.vue
      // dynamicRoutesModules适合文件路径正确的: /home/test2/index
      route.component = dynamicRoutesModules[`${defaultPath}${comp}.vue`]
      // 打包后运行不了 开发环境可以
      // route.component = () => import(/* @vite-ignore */ `${defaultPath}${comp}`)
      // route.component = () => import(/* @vite-ignore */ '../../views/' + comp)
      // route.component = () => import(/* @vite-ignore */ '/src/views/' + comp)
      // webpack方式
      // const comp = item.menu_path.replace(/\//, '');
      // webpackChunkName: request 占位符 会以文件名来填写名字 index 使用数字
      // route.component = import(/* webpackChunkName: "[index]" */ `@/views/${comp}`)
      // route.component = () => import(/* webpackChunkName: "[index]" */ `@/views/${comp}`)
    }

    routes.push(route)
  })

  return routes
}

// 适用于 路由格式 src/store/modules/data/menu3.json对应views3目录
export function generateRoute3(
  menus = [],
  isOneLevel = false,
  needTiling = true,
  parentPath = [],
) {
  const routes = []

  menus.forEach((item) => {
    const route = {
      path: item.path,
      name: item.name,
      // name: fullPathSplicing(item.path),
      meta: {
        ...item.meta,
        noCache: !!item.cache,
        id: item.id,
        // 添加父级记录所有子级 path
        hasSubs: [],
        // 添加子级记录所有父级 path
        hasParents: [...parentPath],
      },
      component: null,
    }
    getParentPath1(item, route.meta.hasSubs, 'id')

    // 去除第一个 /  /home/test2/ = home/test2/
    // const comp = item.menu_path.replace(/\//, '')
    // 去除前面和后面的 /
    const comp = item.component.replace(firstAndLastSlash, '')
    if (item.children && item.children.length > 0) {
      // route.component =  Layout
      // 只有第一层应为Layout 防止 子级包含children 时 component 为 Layout
      route.component = !isOneLevel
        ? Layout
        : dynamicRoutesModules[`${defaultPath}${comp}.vue`]
      route.redirect = item.redirect
      const parentMark = [...route.meta.hasParents, item.id]

      if (isOneLevel && needTiling) {
        routes.push(
          ...generateRoute3(item.children, true, needTiling, parentMark),
        )
      } else {
        route.children = generateRoute3(
          item.children,
          true,
          needTiling,
          parentMark,
        )
      }
    } else {
      // comp 路由文件目录位置
      // '../../views/b/index.vue'.match(/[^/]*\.vue$/) 获取文件名index.vue
      // dynamicRoutesModules适合文件路径正确的: /home/test2/index
      // console.log(`${defaultPath}${comp}.vue`)
      route.component = dynamicRoutesModules[`${defaultPath}${comp}.vue`]
      // 打包后运行不了 开发环境可以
      // route.component = () => import(/* @vite-ignore */ `${defaultPath}${comp}`)
      // route.component = () => import(/* @vite-ignore */ '../../views/' + comp)
      // route.component = () => import(/* @vite-ignore */ '/src/views/' + comp)
      // webpack方式
      // const comp = item.menu_path.replace(/\//, '');
      // request 占位符 会以文件名来填写名字 index 使用数字
      // route.component = () => import(/* webpackChunkName: "[index]" */ `@/views/${comp}`)
    }
    routes.push(route)
  })
  return routes
}

/*export function generateRoute3(data) {
  const res = []
  data.forEach((item) => {
    const tmp = { ...item }
    if (tmp.component === 'Layout') {
      tmp.component = Layout
    } else {
      let sub_view = tmp.component.replace(/^\/!*!/g, '')
      tmp.component = dynamicRoutesModules[`${defaultPath}${sub_view}.vue`]
    }
    tmp.children = generateRoute3(tmp.children)
    res.push(tmp)
  })
  return res
}*/

// 下面所有方法适用于这种路由格式 src/store/modules/data/menu2.js 对应views目录

// 记录上N层父级标识和下N层子级标识
export function generateRoute1(
  menus = [],
  isOneLevel = false,
  parentPath = [],
) {
  const routes = []

  menus.forEach((item) => {
    // item.path.replace(/\/index$/, '')
    const route = {
      path: item.path,
      name: item.name,
      // name: toPascalCase(item.path, false),
      meta: {
        ...item.meta,
        noCache: !!item.meta.noCache,
        // 添加父级记录所有子级 path
        hasSubs: [],
        // 添加子级记录所有父级 path
        hasParents: [...parentPath],
      },
      component: item.component,
    }

    // route.hasSubs = []
    getParentPath1(item, route.meta.hasSubs)

    if (item?.children?.length > 0) {
      route.redirect = item.redirect
      const paths = [...route.meta.hasParents, route.path]
      if (isOneLevel) {
        routes.push(...generateRoute1(item.children, true, paths))
      } else {
        route.children = generateRoute1(item.children, true, paths)
      }
    }

    routes.push(route)
  })

  return routes
}

/*
// 记录上一层父级标识 记录N层子级标识
export function generatorDynamicRoutes3(
  menus = [],
  isOneLevel = false,
  parentPath = null,
) {
  const routes = []

  menus.forEach((item) => {
    const route = {
      path: item.path,
      name: item.name,
      meta: {
        ...item.meta,
        // 添加父级记录所有子级 path
        hasSubs: [],
        // 添加子级记录所有父级 path
        hasParents: parentPath,
      },
      component: item.component,
    }

    // route.hasSubs = []
    getParentPath1(item, route.meta.hasSubs)

    if (item?.children?.length > 0) {
      route.redirect = item.redirect
      const paths = route.path
      if (isOneLevel) {
        routes.push(...generatorDynamicRoutes3(item.children, true, paths))
      } else {
        route.children = generatorDynamicRoutes3(item.children, true, paths)
      }
    }

    routes.push(route)
  })

  return routes
}

// 只记录上一层或下一层父级或子级标识  不管N层
export function generatorDynamicRoutes4(
  menus = [],
  isOneLevel = false,
  parentPath = null,
) {
  const routes = []

  menus.forEach((item) => {
    const route = {
      path: item.path,
      name: item.name,
      meta: {
        ...item.meta,
        // 添加父级记录所有子级 path
        hasSubs: [],
        // 添加子级记录所有父级 path
        hasParents: parentPath,
      },
      component: item.component,
    }

    // route.hasSubs = []
    getParentPath2(item, route.meta.hasSubs)

    if (item?.children?.length > 0) {
      route.redirect = item.redirect
      const paths = route.path
      if (isOneLevel) {
        routes.push(...generatorDynamicRoutes4(item.children, true, paths))
      } else {
        route.children = generatorDynamicRoutes4(item.children, true, paths)
      }
    }

    routes.push(route)
  })

  return routes
}

// 记录上N层父级标识  只记录下一层子级标识
export function generatorDynamicRoutes5(
  menus = [],
  isOneLevel = false,
  parentPath = [],
) {
  const routes = []

  menus.forEach((item) => {
    const route = {
      path: item.path,
      name: item.name,
      meta: {
        ...item.meta,
        // 添加父级记录所有子级 path
        hasSubs: [],
        // 添加子级记录所有父级 path
        hasParents: [...parentPath],
      },
      component: item.component,
    }

    // route.hasSubs = []
    getParentPath2(item, route.meta.hasSubs)

    if (item?.children?.length > 0) {
      route.redirect = item.redirect
      const paths = [...route.meta.hasParents, route.path]
      if (isOneLevel) {
        routes.push(...generatorDynamicRoutes5(item.children, true, paths))
      } else {
        route.children = generatorDynamicRoutes5(item.children, true, paths)
      }
    }

    routes.push(route)
  })

  return routes
}*/
