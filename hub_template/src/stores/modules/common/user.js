import { defineStore } from "pinia"
import { getUserInfoApi } from "@/api/publicApi"

export const useUserStore = defineStore("userData", {
	state: () => {
		return {
			userInfo: null
		}
	},
	actions: {
		// 获取当前登录用户信息  
		getUserInfo() {
			return new Promise((resolve, reject) => {
				if (!this.userInfo) {
					getUserInfoApi()
						.then((res) => {
							this.userInfo = res.user_info
							resolve()
						})
						.catch((error) => {
							console.log(error)
							reject(error)
						})
				} else {
					resolve()
				}
			})
		}
	}
})
