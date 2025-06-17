import { defineStore } from "pinia"
export const useMessageCenter = defineStore("messageCenter", {
	state: () => {
		return {
			msgType: 1, // 1 飞书卡片  2邮件
			unread: 0, // 切换飞书邮件时显示未读个数
			commentVisible: false,
			activeRoubotOpenId: ""
		}
	},
	actions: {
		setType(value) {
			console.log(value)
			if (value == 1) {
				this.msgType = 2
			} else {
				this.msgType = 1
			}
		},
		setUnread(value) {
			this.unread = value
		},
		setCommentVisible(value) {
			this.commentVisible = value
		},
		setRobotOpenId(value) {
			this.activeRoubotOpenId = value
		}
	},
	persist: {
		enabled: true,
		strategies: [
			{
				storage: sessionStorage,
				paths: ["messageCenter"]
			}
		]
	}
})
