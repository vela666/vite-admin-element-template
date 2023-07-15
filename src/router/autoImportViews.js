import Layout from '@/layout'
import { toPascalCase, fullPathSplicing } from '@/store/modules/utils'
import { dynamicRoutesModules, metaModules } from '@/utils/handlerViews'

// 每一层添加redirect字段 以children的第一个path为redirect
function addRedirect(data) {
  return data.map((item) => {
    const newItem = { ...item }
    if (!newItem.redirect && newItem?.children?.length > 0) {
      newItem.redirect = newItem.children[0].path || ''
      newItem.children = addRedirect(newItem.children)
    }
    return newItem
  })
}

/*let routes = Object.entries(dynamicRoutesModules).map(([compPath, component]) => {
  // 1.生成每个routeMeta.js的路径

  const compPathArr: string[] = compPath.split('/')
  compPathArr[compPathArr.length - 1] = 'routeMeta.js'
  const metaPath = compPathArr.join('/')

  // 2.生成路由路径
  let path: string =
    '/' +
    compPath
      .replace('../views', '')
      .split('/')
      .filter(Boolean)
      .slice(0, -1)
      .join('/')

  // 针对not-found的路径进行特殊处理
  path = path === '/not-found' ? '/:pathMatch(.*)*' : path

  // 3.生成页面组件的名称
  const name = path.split('/').filter(Boolean).join('-') || 'index'

  return {
    path,
    name,
    // 这里由于vite打包使用rollup，所有import函数不能传入变量，影响静态解析，所以采用获取组件方式，传入函数字面量
    component,
    meta: metaModules[metaPath] || {},
  }
})*/

let routes = Object.entries(dynamicRoutesModules).map(
  ([compPath, component]) => {
    // 2.生成路由路径
    /*let path =
        '/' +
        compPath
          .replace('@/views', '')
          .split('/')
          .filter(Boolean)
          .slice(0, -1)
          .join('/')*/
    // console.log(compPath.match(/(.+\/)([^/]+)\.vue$/))
    // 用于匹配以 "/src/views" 开头，以 ".vue" 结尾的文件路径，并提取中间的部分
    // 如: /src/views/chart-example/chart1/index.vue === /chart-example/chart1
    const regex = /\/src\/views(.*?)(?=\/[^/]+\.vue$)/
    let path = compPath.match(regex)[1]
    // 结尾不包含 / compPath.match(/(.+)(?=\/[^/]+\.vue)/)
    // 结尾包含 /
    const metaPath = compPath.match(/(.+\/)(?=[^/]+\.vue)/)[0] + 'routeMeta.js'
    /*const compPathArr = compPath.split('/')
      compPathArr[compPathArr.length - 1] = 'routeMeta.js'
      const metaPath = compPathArr.join('/')*/
    return {
      path,
      name: toPascalCase(path),
      // 这里由于vite打包使用rollup，所有import函数不能传入变量，影响静态解析，所以采用获取组件方式，传入函数字面量
      // 最顶层的路由使用Layout组件
      component:
        path.split('/').filter(Boolean).length === 1 ? Layout : component,
      meta: metaModules[metaPath] || {},
    }
  },
)

function buildTree(data) {
  const tree = {}
  const map = {}

  for (const item of data) {
    map[item.path] = { ...item, redirect: item.meta.redirect, children: [] }
  }
  for (const item of data) {
    const parentPath = getParentPath(item.path)
    if (parentPath) {
      const parentItem = map[parentPath]
      if (parentItem) {
        parentItem.children.push(map[item.path])
        parentItem.children.sort(
          (a, b) => (a.meta.sort || Infinity) - (b.meta.sort || Infinity),
        )
      }
    } else {
      tree[item.path] = map[item.path]
    }
  }
  return addRedirect(Object.values(tree))
}

function getParentPath(path) {
  const segments = path.split('/')
  // 获取上一级的path
  // /nested/menu1/menu1-2/menu1-2-2 => /nested/menu1/menu1-2
  // '/echart/echart1' => '/echart'
  if (segments.length > 2) {
    return segments.slice(0, -1).join('/')
  }
  return false
}

export default buildTree(routes).sort(
  (a, b) => (a.meta.sort || Infinity) - (b.meta.sort || Infinity),
)
