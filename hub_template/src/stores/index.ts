/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createPinia } from 'pinia'
// import piniaPersist from "pinia-plugin-persist"
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { systemPre } from '@/utils/config/settings'
// 引入各个store模块统一管理

export * from './modules/common/options'
export * from './modules/common/table'
export * from './modules/common/tabs'
export * from './modules/common/user'
export * from './modules/common/keeplive'
export * from './modules/common/menu'
export * from './modules/card_center/index'
const pinia = createPinia()
// 加载持久化插件
// pinia.use(piniaPersist)
// 加载持久化插件
pinia.use(
	createPersistedState({
		key: (id) => systemPre + id,
		storage: sessionStorage
	})
)
export default pinia
