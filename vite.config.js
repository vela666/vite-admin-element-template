import { defineConfig, loadEnv } from 'vite'
import path from 'node:path'
import fs from 'node:fs'

import { composePlugins } from './config/plugins'

function resolve(dir) {
  return path.join(__dirname, dir)
}
// 加载 'src/style/resources' 下面的 scss
const scssResources = []
const cssPath = 'src/styles/config'
fs.readdirSync(cssPath).map((dirname) => {
  if (fs.statSync(`${cssPath}/${dirname}`).isFile()) {
    scssResources.push(`@use "${cssPath}/${dirname}" as *;`)
  }
})
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const { VITE_APP_BASE_API, VITE_APP_BASE_API_REAL, VITE_PORT } = loadEnv(
    mode,
    process.cwd(),
    '',
  )

  return {
    // base: './',
    resolve: {
      alias: {
        '@': resolve('src'),
      },
      // 忽略文件后缀
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.vue'],
    },
    plugins: composePlugins(command),
    // https://cn.vitejs.dev/config/dep-optimization-options.html#optimizedeps-exclude
    /* optimizeDeps: {
      // exclude: ['.pnpm'],
      include: [
        '@vueuse/core',
        'vue',
        'vue-router',
        'pinia',
        'lodash-es',
        'element-plus',
        // 'vuedraggable',
      ],
    },*/
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: scssResources.join(''),
          /*additionalData: `
           @use "@/styles/config/element" as *;
           // 全局变量
           @use '@/styles/config/variables' as *;
         `,*/
        },
      },
    },
    server: {
      // host : '0.0.0.0',
      // port: VITE_PORT,
      https: false,
      open: false,
      // hmr: true,
      /* proxy: {
        '/api': {
          target: 'https://api.occtai.com/test',
          ws: false,
          changeOrigin: true,
          // 不保留任何路径 /api/xxx/xxx => /
          rewrite: (path) => '/',
        },
      },*/
      proxy: {
        ...(mode === 'production' && {
          [VITE_APP_BASE_API]: {
            target: VITE_APP_BASE_API_REAL,
            // ws: false,
            changeOrigin: true,
            rewrite: (path) => {
              return path.replace(new RegExp(`^${VITE_APP_BASE_API}`, 'g'), '')
            },
          },
        }),
      },
    },
    // 全局变量 window
    define: {
      // https://vue-i18n.intlify.dev/guide/advanced/optimization.html#quasar-cli
      // 消除 vue-i18n 警告
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,
    },
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 3500,
      emptyOutDir: true,
      // 启用/禁用 gzip 压缩大小报告
      reportCompressedSize: false,
      // minify: 'terser',
      // terserOptions: {
      //   compress: {
      //     drop_console: true,
      //     drop_debugger: true
      //   }
      // },

      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
          entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
          assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
          /*manualChunks(id) {
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString()
            }
          },*/
        },
      },
    },
    // build.minify为 esbuild
    esbuild: {
      drop: ['console', 'debugger'],
    },
  }
})
