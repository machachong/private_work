import 'normalize.css/normalize.css'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import stores from './stores/index'
import router from './router/index'
import App from './App.vue'
// import VConsole from 'vconsole'
// 重置CSS样式
import 'element-plus/dist/index.css'
import * as dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
const app = createApp(App)
app.use(stores)
app.use(router)
app.use(ElementPlus)

// 代码对比
import VueDiff from 'vue-diff'
import 'vue-diff/dist/index.css'
import sql from 'highlight.js/lib/languages/sql.js'
VueDiff.hljs.registerLanguage('sql', sql)

app.use(VueDiff)

// 指令统一绑定
import directives from '@/directives/index'
directives(app)

// 全局组件统一管理
import useComponents from '@/components/index'
app.use(useComponents)

// svg统一引入
import 'virtual:svg-icons-register'

import './assets/style/index.scss'

if (import.meta.env.MODE == 'development') {
	// new VConsole()
}

app.mount('#app')
