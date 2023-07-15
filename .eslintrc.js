/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
    // 解决eslint提示未定义 defineProps这类宏 API的
    // 'vue/setup-compiler-macros': true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting',
    './.eslintrc-auto-import.json',
  ],
  parserOptions: {
    // 用于指定要解析的代码是使用什么模块系统（或不使用模块系统）
    // script：使用脚本模式编写的（即不使用模块系统）。
    // module：使用 es 模块编写的。
    sourceType: 'module',
    // 指定要使用的 es 版本
    ecmaVersion: 'latest',
    ecmaFeatures: {
      // 允许在全局范围内使用 return 语句。
      globalReturn: false,
      // 启用暗示的严格模式。在全局作用域中的代码被认为是在严格模式下编写的，无需使用 'use strict' 指令。
      impliedStrict: false,
      // 启用 JSX 语法支持。
      jsx: true,
    },
  },
  rules: {
    'no-var': 'error',
    debugger: 'off',
    'no-unused-vars': 'off',
    'vue/multi-word-component-names': 'off',
    // vue组件name强制使用驼峰命名
    // "vue/name-property-casing": ['error', "PascalCase"],
  },
}
