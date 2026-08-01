import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  // 相对路径：评委多半是解压后直接双击 index.html，绝对的 /assets/... 在 file:// 下
  // 会被解析到磁盘根目录，页面直接白屏。用 './' 后本地双击和挂服务器都能打开。
  base: './',
  server: {
    watch: {
      ignored: ['**/coverage/**'],
    },
  },
  build: {
    // sourcemap 只在需要排查线上问题时开启：BUILD_SOURCEMAP=true npm run build。
    // 默认关闭，避免交付包里 6 MB 的 .map 把 2.4 MB 的真实产物撑到 9.7 MB。
    sourcemap: process.env.BUILD_SOURCEMAP === 'true' ? 'hidden' : false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          // React 运行时必须最先判定并单独成块。
          // 否则 rollup 会把 react-dom 归并进 vendor-graph、把 react 归并进 vendor-markdown，
          // 入口就变成静态依赖这两个重包——ReactFlow / micromark 全量进首屏，按需加载失效。
          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'vendor-react'
          if (/\/node_modules\/(react-router|react-router-dom)\//.test(id)) return 'vendor-router'
          if (id.includes('/katex/')) return 'vendor-katex'
          if (id.includes('/highlight.js/') || id.includes('/lowlight/')) return 'vendor-highlight'
          if (
            /\/(react-markdown|remark-|rehype-|unified|unist-|hast-|mdast-|micromark|property-information|vfile)/.test(id)
          ) {
            return 'vendor-markdown'
          }
          if (id.includes('/reactflow/') || id.includes('/@reactflow/') || id.includes('/dagre/')) {
            return 'vendor-graph'
          }
          return undefined
        },
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    tsconfigPaths()
  ],
})
