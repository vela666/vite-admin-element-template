let modules = {}
// const modulesFiles = import.meta.glob('./language/**/*.js')
/*for (const path in modulesFiles) {
  const moduleName = path.replace(/(.*\/)*([^.]+).*!/gi, '$2')
  modulesFiles[path]().then((mod) => {
    modules[moduleName] = mod.default
  })
  modules = {
    ...modules,
    [moduleName]: modulesFiles[path].default,
  }
}*/
/*for await (const path of Object.keys(modulesFiles)) {
  const moduleName = path.match(/\/([^/]+?)(?=\.[^.\\/]+$|$)/)[1]
  const data = await modulesFiles[path]()
  modules[moduleName] = data.default
}*/
//
const modulesFiles1 = import.meta.glob('./language/**/*.js', { eager: true }) // 异步方式
for (const key of Object.keys(modulesFiles1)) {
  //名称  因为这里拿到的是  ./modules/app.js ，所以需要两层处理
  // let moduleName = key.replace(/^\.\/(.*)\.\w+$/, '$1')
  // const name = moduleName.split('/')[1]
  const name = key.match(/\/([^/]+?)(?=\.[^.\\/]+$|$)/)[1]
  modules[name] = modulesFiles1[key].default
}
export default modules
