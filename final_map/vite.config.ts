import vue from '@vitejs/plugin-vue'
import { defineConfig } from "vite"
import { resolve } from "node:path"

// https://vite.dev/config/
export default defineConfig(() =>{
  return {
    // 开发或打包构建时用到的公共基础路径
    base: './',
    resolve: {
      alias: {
        // @ 符号指向 src 目录
        "@": resolve(__dirname, "src"),
      }
    },
    server: {
      // 是否监听所有地址
      host: true,
      // 端口号
      port: 3333,
      // 端口被占用时，是否直接退出
      strictPort: false,
      // 是否自动打开浏览器
      open: true,
      // 反向代理
      proxy: {
        "/api": {
          target: "https://apis.map.qq.com",
          // target: "http://47.104.200.59:8071",
          // 是否为 WebSocket
          ws: false,
          // 是否允许跨域
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        "/mapi": {
          // target: "https://apis.map.qq.com",
          target: "http://47.104.200.59:8071",
          // 是否为 WebSocket
          ws: false,
          // 是否允许跨域
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/mapi/, ''),
        }
      },
      // 是否允许跨域
      cors: true,
    },
    plugins: [
      vue(),
      ]
    
  }
})
