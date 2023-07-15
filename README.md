```
对应src/store/modules/data/menu2.js结构 和views的目录
在src/store/modules/permission.js下
getMenus和generateRoutes里使用generateRoute1方法
```

```
对应src/store/modules/data/menu1.json结构 和views2的目录
在src/store/modules/permission.js下
getMenus和generateRoutes里使用generateRoute2方法
```

```
对应src/store/modules/data/menu3.json结构 和views3的目录
在src/store/modules/permission.js下
getMenus和generateRoutes里使用generateRoute3方法
```
```
解决使用unplugin-vue-components自动引入组件时  
// 解决按需引入后又手动导入 无样式  
手动import { ElMessage, ElMessageBox } from 'element-plus' 样式不会被引入问题 
// 在scss文件中写入以下代码
@use 'element-plus/theme-chalk/src/message.scss';
@use 'element-plus/theme-chalk/src/message-box.scss';
```
#### vite自带快捷键
``` 
按 c 清除控制台
按 u 控制台显示服务器 url
```
