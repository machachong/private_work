import { defineStore } from 'pinia'
import { getUserOptionsApi, getDeveloperList, getSystemListApi } from '@/api'
import { getCustomerUserApi, getDepartmentUserApi } from '@/api/publicApi'
export const useOptionsStore = defineStore('optionsData', {
	state: () => {
		return {
			userOptions: [],
			userOptionsNopart: [],
			devOptions: [],
			systemOptions: [],
			feishuUserOptions: [],
			departmentUserOptions: [],
			dbUserOptions: [],
			dwUserOptions: [],
			daUserOptions: [],
			devUserOptions: [],
			oldUserType: ''
		}
	},
	actions: {
		getUserOptions(need_department = true) {
			console.log(need_department)
			return new Promise((resolve, reject) => {
				if (this.userOptions?.length == 0) {
					getUserOptionsApi({ type: 'user', need_department })
						.then((res) => {
							this.userOptions = res?.options?.map((item) => {
								return {
									...item,
									value: item?.id,
									label: item?.name,
									name: item?.name.split(' ')[0]
								}
							})
							this.userOptionsNopart = res?.options?.map((item) => {
								return {
									value: item?.id,
									label: item?.name.split(' ')[0]
								}
							})
							resolve()
						})
						.catch((err) => {
							console.log(err)
							reject()
						})
				} else {
					resolve()
				}
			})
		},
		getDevOptions(params, soon = false) {
			return new Promise((resolve, reject) => {
				if (this.devOptions?.length == 0 || soon === true) {
					getDeveloperList(params)
						.then((res) => {
							this.devOptions = res?.items?.map((item) => {
								return {
									value: item?.user_id,
									label: item?.user_name
								}
							})
							resolve(this.devOptions)
						})
						.catch((err) => {
							console.log(err)
							reject()
						})
				} else {
					resolve([])
				}
			})
		},
		getSystemOptions() {
			return new Promise((resolve, reject) => {
				if (this.systemOptions?.length == 0) {
					getSystemListApi({
						page: 1,
						size: 100
					})
						.then((res) => {
							this.systemOptions = res?.items?.map((item) => {
								return {
									value: item?.system_id,
									label: item?.system_name
								}
							})
							resolve()
						})
						.catch((err) => {
							console.log(err)
							reject()
						})
				} else {
					resolve()
				}
			})
		},
		async getFeishuUserOptions() {
			try {
				if (this.feishuUserOptions?.length > 0) return
				const { options } = await getCustomerUserApi()
				this.feishuUserOptions = options?.map((item) => {
					return {
						...item,
						label: item.user_name,
						value: item.feishu_user_id,
						department: item.department_full_path
					}
				})
			} catch (error) {
				console.log(error)
			}
		},
		/**
		 * 获取部门用户
		 * @param {*} user_type //数仓1 数分2  DB 3 开发4 部门5'
		 * @returns
		 */
		async getDepartmentUser(user_type) {
			try {
				// user_type相同时缓存，不同时 重新请求
				// if (this.departmentUserOptions?.length > 0 && this.oldUserType === user_type) return
				if (
					(user_type == 1 && this.dwUserOptions?.length > 0) ||
					(user_type == 2 && this.daUserOptions?.length > 0) ||
					(user_type == 3 && this.dbUserOptions?.length > 0) ||
					(user_type == 5 && this.departmentUserOptions?.length > 0) ||
					(user_type == 4 && this.devUserOptions?.length > 0)
				) {
					return
				}
				const { options } = await getDepartmentUserApi({ user_type })
				// this.oldUserType = user_type
				const newOptions = options?.map((item) => {
					return {
						...item,
						label: item.user_name,
						value: item.feishu_user_id
					}
				})
				if (user_type == 1) {
					this.dwUserOptions = newOptions
				} else if (user_type == 2) {
					this.daUserOptions = newOptions
				} else if (user_type == 3) {
					this.dbUserOptions = newOptions
				} else if (user_type == 5) {
					this.departmentUserOptions = newOptions
				} else if (user_type == 4) {
					this.devUserOptions = newOptions
				}
			} catch (error) {
				console.log(error)
			}
		}
	}
})
