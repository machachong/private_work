import Tracker from '@/utils/tracking/tracker'
import { watch } from 'vue'
import { getPermission } from '@/utils/auth/auth'
import { useUserStore } from '@/stores'
import { systemId } from '@/utils/config/settings'
// - permission_id: 权限ID
// - name: 埋点名称
// - description: 埋点描述
// - behavior: 埋点行为枚举 visit 访问页面 | click | add | edit | delete | search，增，删，改，查之外的，用click行为标记
// - version: 版本
// - obj: 存放埋点的业务字段

// 权限 + 埋点指令
export default (app) => {
	app.directive('track-permission', {
		beforeMount: (el) => {
			el.trackData = {}
		},
		mounted: (el, binding) => {
			// 设置权限
			const userStore = useUserStore()
			const permissionIndex = binding.value?.permission_id
			// 初始化参数
			const { obj = {}, ...others } = binding.value
			el.trackData = {
				obj: obj ? JSON.stringify(obj) : '',
				...others
			}
			if (permissionIndex) {
				el.style.display = 'none'

				// eslint-disable-next-line no-inner-declarations
				function wrap() {
					if (userStore.userInfo) {
						if (!getPermission(userStore.userInfo, permissionIndex, systemId)) {
							el.style.display = 'none!important'
						} else {
							el.style.display = ''
						}
					}
				}
				wrap()
				watch(
					() => userStore.userInfo,
					() => {
						wrap()
					},
					{
						deep: true
					}
				)
			}
			// 点击埋点
			el.addEventListener('click', () => {
				try {
					Tracker.push(el.trackData)
				} catch (error) {
					console.log(error)
				}
			})
		},
		updated(el, binding) {
			const trackInfo = binding.value
			const { obj = {}, ...others } = trackInfo
			// 更新参数
			el.trackData = {
				obj: obj ? JSON.stringify(obj) : '',
				...others
			}
		}
	})
}
