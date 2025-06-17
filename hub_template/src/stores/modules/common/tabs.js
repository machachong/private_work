import { defineStore } from "pinia"
export const useTabsStore = defineStore("tabsData", {
	state: () => {
		return {
			// 标签页列表
			tabsPage: [],
			// 当前标签页
			activePage: ""
		}
	},
	actions: {
		addTabPage(tab) {
			const notTab = this.tabsPage.findIndex((e) => e.path == tab.path) == -1
			if (!notTab) return
			const hasIndex = this.tabsPage.findIndex((e) => e.title == tab.title)
			if (hasIndex == -1) {
				this.tabsPage.push(tab)
			} else {
				this.tabsPage[hasIndex] = tab
			}
			this.setActivePage(tab)
		},
		// 保存当前用户选择字段列
		setActivePage(tab) {
			this.activePage = tab.path
		}
	},
	persist: {
		enabled: true,
		strategies: [
			{
				storage: sessionStorage,
				paths: ["tabsPage", "activePage"]
			}
		]
	}
})
