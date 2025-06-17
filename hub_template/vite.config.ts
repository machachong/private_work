import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'
import { codeInspectorPlugin } from 'code-inspector-plugin'
// import { visualizer } from 'rollup-plugin-visualizer'
// import pkg from './package.json' assert { type: 'json' }

const Timestamp = new Date().getTime()

const pathResolve = (dir: string): string => {
	return resolve(__dirname, '.', dir)
}
/** 设置别名 */
const alias: Record<string, string> = {
	'@': pathResolve('src'),
	'@build': pathResolve('build')
}
// https://vitejs.dev/config/
export default defineConfig({
	base: '/devplat/',
	//启动服务配置
	server: {
		host: '0.0.0.0',
		port: 8080,
		open: false // 自动在浏览器打开
	},
	plugins: [
		vue(),
		AutoImport({
			resolvers: [ElementPlusResolver()],
			imports: ['vue', 'vue-router', 'pinia'],
			dts: 'types/auto-imports.d.ts',
			eslintrc: {
				enabled: true,
				filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
				globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
			}
		}),
		Components({
			resolvers: [ElementPlusResolver()]
		}),
		createSvgIconsPlugin({
			// 指定需要缓存的图标文件夹
			iconDirs: [resolve(process.cwd(), 'src/assets/svg/svg_icon')], // 与本地储存地址一致
			// 指定symbolId格式
			symbolId: 'icon-[name]'
		}),
		codeInspectorPlugin({
			bundler: 'vite'
		})
		// visualizer()
	],
	resolve: {
		alias
		// extensions: [".js", ".ts", ".json"],
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: "@import '@/assets/style/variable.scss';",
				javascriptEnabled: true,
				silenceDeprecations: ['legacy-js-api']
			}
		}
	},
	build: {
		//浏览器兼容性  "esnext"|"modules"
		target: 'modules', //指定输出路径
		outDir: 'dist', //生成静态资源的存放路径
		assetsDir: 'assets', //启用/禁用 CSS 代码拆分
		cssCodeSplit: true,
		sourcemap: false,
		chunkSizeWarningLimit: 1800,
		assetsInlineLimit: 10240,
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true
			},
			mangle: true // 变量名替换
		},
		rollupOptions: {
			input: {
				main: resolve('index.html')
			},
			// output: {
			// 	inlineDynamicImports: true
			// },
			// 对动态文件增加时间戳，解决打包发布后打开页面的缓存问题
			output: {
				entryFileNames: ({ name }) => {
					if (name?.includes('modules')) {
						return `js/[name]-[hash].js`
					}
					return `js/[name]-[hash]-${Timestamp}.js`
				},
				chunkFileNames: ({ name }) => {
					if (name?.includes('modules')) {
						return `js/[name]-[hash].js`
					}
					return `js/[name]-[hash]-${Timestamp}.js`
				},
				assetFileNames: `[ext]/[name]-[hash]-${Timestamp}.[ext]`,
				manualChunks: {
					vue: ['vue', 'vue-router', 'pinia', 'pinia-plugin-persistedstate'],
					element: ['element-plus'],
					wangeditor: ['@wangeditor/editor', '@wangeditor/editor-for-vue', '@wangeditor/plugin-md'],
					echarts: ['echarts']
				}
				// manualChunks(id) {
				// 	if (id.includes('node_modules')) {
				// 		// 不分较大依赖，单独打包
				// 		if (/[\\/]node_modules[\\/](vue|vue-router|pinia|pinia-plugin-persistedstate)/.test(id)) {
				// 			return 'vue-vendor'
				// 		}
				// 		if (/[\\/]node_modules[\\/]element-plus/.test(id)) {
				// 			return 'element-plus'
				// 		}
				// 		if (/[\\/]node_modules[\\/]wangeditor/.test(id)) {
				// 			return 'wangeditor'
				// 		}
				// 		if (/[\\/]node_modules[\\/]echarts/.test(id)) {
				// 			return 'echarts'
				// 		}
				// 		if (/[\\/]node_modules[\\/]markdown-it/.test(id)) {
				// 			return 'markdown-it'
				// 		}
				// 		// 将其他node_modules依赖合并成一个chunk
				// 		return 'vendors'
				// 	}
				// 	// 将公共组件打包在一起
				// 	if (id.includes('src/components')) {
				// 		return 'components'
				// 	}
				// 	// 将工具函数打包在一起
				// 	if (id.includes('src/utils')) {
				// 		return 'utils'
				// 	}
				// }
				// manualChunks(id) {
				// 	if (id.includes('node_modules')) {
				// 		// 让每个插件都打包成独立的文件
				// 		return id.toString().split('node_modules/')[1].split('/')[0].toString() + '-modules'
				// 	}
				// }
			}
		}
	}
})
