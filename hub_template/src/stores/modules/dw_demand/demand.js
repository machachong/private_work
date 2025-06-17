import { defineStore } from "pinia"
export const useDwDemandStore = defineStore("dwDemandStore", {
	state: () => {
		return {
			projectIds: [], // 选中的项目
			projectLists: []
		}
	},
	actions: {},
	persist: {
		enabled: true,
		strategies: [
			{
				storage: sessionStorage,
				paths: ["dwDemandStore"]
			}
		]
	}
})
