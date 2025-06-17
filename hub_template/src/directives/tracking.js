import Tracker from "@/utils/tracking/tracker"
// - permission_id: 埋点处对应的权限id（日志的层级权限由此id根据权限菜单生成）
// - name: 埋点名称
// - description: 埋点描述
// - behavior: 埋点行为枚举 visit 访问页面 | click | add | edit | delete | search，增，删，改，查之外的，用click行为标记
// - version: 版本
// - obj: 存放埋点的业务字段
// 点击打点

// 埋点指令
export default (app) => {
	app.directive("tracking", {
		beforeMount: (el) => {
			el.trackData = {}
		},
		mounted: async (el, binding) => {
			// 初始化参数
			const { obj = {}, ...others } = binding.value
			el.trackData = {
				obj: obj ? JSON.stringify(obj) : "",
				...others
			}
			// 点击埋点
			el.addEventListener("click", () => {
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
			el.trackData = {
				obj: obj ? JSON.stringify(obj) : "",
				...others
			}
		}
	})
}
