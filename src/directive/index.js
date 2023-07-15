// 获取每个指令模块
const metaModules = import.meta.glob('./**/index.js', {
  eager: true,
  import: 'default',
})

// const regex1 = /\/([^/]+)\/index\.js/
const regex2 = /\/([^/]+?)(?=\/index\.js)/

// 也可以使用unplugin-vue-components插件 来自动注册(config/plugins.js)
const registerDirective = (app) => {
  Object.keys(metaModules).forEach((key) => {
    // let name = regex1.exec(key)[1]
    let name = key.match(regex2)[1]
    app.directive(name, metaModules[key])
  })
}
export default registerDirective
