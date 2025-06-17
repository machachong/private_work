import { getPermission } from "@/utils/auth/auth"
import { useUserStore } from "@/stores"
import { systemId } from "@/utils/config/settings"

export const permissionDirective = async (el, binding) => {
	const store = useUserStore()
	const permissionId = binding.value
	if (permissionId) {
		const originDisplay = el.style.display || ""
		el.style.display = "none"
		if (!store.userInfo || !store.userInfo.real_name) {
			// _res 等待接口获取到该账户的所有角色，再进行处理
			await store.getUserInfo()
			if (!getPermission(store.userInfo, permissionId, systemId)) {
        if ( el.parentNode) {
          el.parentNode.removeChild(el)
        } else {
          el.remove()
        }
				throw new Error("无权限")
			} else {
				el.style.display = originDisplay
				return
			}
		} else {
      if (!getPermission(store.userInfo, permissionId, systemId)) {
        if (el.parentNode) {
           el.parentNode.removeChild(el)
        } else {
          el.remove()
        }
				throw new Error("无权限")
			} else {
				el.style.display = originDisplay
				return
			}
		}
	} else {
		throw new Error("无权限")
	}
}

export default (app) => {
	app.directive("permission", {
		async mounted(el, binding, vnode) {
			permissionDirective(el, binding, vnode).catch(() => {})
		}
	})
}
