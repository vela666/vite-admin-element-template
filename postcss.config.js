// vite内置了 postcss 不用再次安装
module.exports = {
  // 使用未来的 CSS 特性 https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env
  plugins: [require('autoprefixer'), require('postcss-preset-env')],
}
