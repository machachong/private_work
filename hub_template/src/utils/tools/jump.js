import router from "@/router"
export const changeUrlRoute = function (route, key, value) {
	// 用vue-route来改变路由参数，解决控制台的warning
	return new Promise((resolve, reject) => {
		const obj = JSON.parse(JSON.stringify(route.query))
		const newParams = {}
		if (value !== "" && value !== undefined && value !== null) {
			newParams[key] = value
		} else {
			// 如果value是空值则清除该key
			if (obj[key] !== undefined) {
				Reflect.deleteProperty(obj, key)
			}
		}
		Object.assign(obj, newParams)
		// 此处router.push返回的是一个Promise,会在路由切换完成之后resolve
		router
			.push({ query: obj })
			.then(() => {
				resolve()
			})
			.catch((err) => {
				reject(err)
			})
	})
}
