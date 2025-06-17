import { ref } from 'vue'
import {
	getProjectListApi,
	getPoolListApi,
	getDemandWorkflowListApi,
	getCurrentWorkflowApi,
	getTaskProcessApi,
	getTbTaskStatusApi
} from '@/views/da_demand/service/demand_api'
import { getTaskListApi } from '@/views/da_demand/service/task_api'
import { getFeishuDocUApi } from '@/api/publicApi'
import { useUserStore, useOptionsStore } from '@/stores'
import { getLabel, urlDownFile, message } from '@/utils/tools'
// import { useOptionsStore } from "@/stores"
// import { developerType } from "@/views/demand/service/config"
import settings from '@/utils/config/settings.js'
export const useDemand = () => {
	const userStore = useUserStore()
	const customUserDict = ref([]) // 所有用户列表
	const projectList = ref([]) // 数仓项目列表
	const projectLoading = ref(false)
	const dwUserList = ref([]) // 数仓用户列表
	const demandInfo = ref({}) // 需求详情
	const processList = ref([]) // 进度列表
	const taskInfo = ref({}) // 任务详情
	const developProcess = ref([]) // 进度信息
	const optionsStore = useOptionsStore()
	// const { userOptionsNopart } = storeToRefs(optionsStore)
	const currentTodo = ref()
	const tb_status_dict = ref() // TB需求状态字典
	const reset = () => {
		taskInfo.value = {}
	}
	const getDemandWorkflowList = async (params) => {
		try {
			const { items = [] } = await getDemandWorkflowListApi(params)
			processList.value = items
		} catch (error) {
			console.log(error)
		}
	}
	const getTaskDetail = async (params) => {
		console.log(params?.task_id)

		try {
			if (!params?.task_id) {
				return (taskInfo.value = {})
			}
			const { items = [] } = await getTaskListApi(params)

			taskInfo.value = items[0]
			console.log('taskInfo', taskInfo)
		} catch (error) {
			console.log(error)
		}
	}
	const getCurrentWorkflow = async (params) => {
		if (!params) {
			return
		}
		await getDaUser()
		currentTodo.value = ''
		try {
			const { items = [] } = await getCurrentWorkflowApi(params)
			let newName = ''
			if (items.length == 0) return
			items.forEach((item, index) => {
				newName = `${getLabel(dwUserList.value, item.feishu_user_id)}`
				if (index != items?.length - 1) newName += ','
			})
			currentTodo.value = `请等待${newName}更新`
			console.log(currentTodo)
		} catch (error) {
			console.log(error)
		}
	}
	const getNodeProcess = (developProcess, item) => {
		return developProcess?.filter((itemp) => {
			return itemp.workflow_detail == item.id
		})
	}
	// 获取飞书文档地址
	const getFeishuDocument = async (data) => {
		try {
			const res = await getFeishuDocUApi({
				app_id: settings.BOKE_APP_ID,
				...data
			})
			return res
		} catch (error) {
			console.log(error)
		}
	}
	// 获取feishu_user_id维度的所有用户
	const getCustomerUser = async () => {
		try {
			if (optionsStore.feishuUserOptions?.length == 0) {
				await optionsStore.getFeishuUserOptions()
			}
			customUserDict.value = optionsStore.feishuUserOptions
		} catch (error) {
			console.log(error)
		}
	}
	// 获取数仓项目列表
	const getProjectList = async (user_id) => {
		try {
			if (projectList.value?.length > 0) return
			userStore.getUserInfo()
			projectLoading.value = true
			console.log({
				user_id: userStore.userInfo
			})

			const { items } = await getProjectListApi({
				user_id: user_id || userStore.userInfo?.id
			})
			if (items) {
				projectList.value = items?.map((item) => {
					return {
						...item,
						label: item.name,
						value: item.id
					}
				})
			}

			projectLoading.value = false
		} catch (error) {
			projectLoading.value = false
			console.log(error)
		}
	}
	// 获取数分操作人
	const getDaUser = async () => {
		try {
			await optionsStore.getDepartmentUser(2)
			dwUserList.value = optionsStore.daUserOptions
		} catch (error) {
			console.log(error)
		}
	}
	// 解析图片
	const resolveImg = (val) => {
		if (val) {
			return val.split(',').map((item) => {
				return `${settings.API_URL}/dw_task/dw_demand_pool/attach_img/?attach_img=${item}`
			})
		}
		return []
	}
	// 获取需求信息
	const getDemandInfo = async (id) => {
		const res = await getPoolListApi({ id })
		if (res && res.items.length === 1) {
			demandInfo.value = res.items[0]
		} else {
			demandInfo.value = {}
		}
	}
	// 获取认领状态
	const getCliamStatus = (demandRow, userInfo) => {
		// 当前执行人executor_feishu_user_ids， accept_executors认领过的人，reject_executors拒绝认领的人不允许再认领
		if (
			!demandRow?.executor_feishu_user_ids?.includes(userInfo?.union_id) ||
			demandRow?.demand_process != 0 ||
			(demandRow?.accept_executors && demandRow?.accept_executors?.includes(userInfo?.union_id)) ||
			(demandRow?.reject_executors && demandRow?.reject_executors?.includes(userInfo?.union_id))
		) {
			return false
		} else {
			return true
		}
	}
	// TB任务跳转
	const goUrl = (url) => {
		window.open(url, '_blank')
	}
	// ds任务跳转
	const goDsUrl = (row) => {
		const { ds_project_code, ds_task_code, ds_base_url } = row
		if (!ds_base_url || !ds_project_code || !ds_task_code) {
			console.log(ds_base_url, ds_project_code, ds_task_code)
			return message.error('缺少参数')
		}
		const url = `${ds_base_url}/ui/projects/${ds_project_code}/workflow/definitions/${ds_task_code}`
		goUrl(url)
	}
	const getTaskProcess = async (demand_id) => {
		try {
			const { items = [] } = await getTaskProcessApi({
				demand_id,
				page: 1,
				size: 9999
			})
			developProcess.value = items
		} catch (error) {
			console.log(error)
		}
	}
	const resolveFile = (url) => {
		return `${settings.API_URL}/dw_task/dw_demand_task/attach_file/?attach_file=${url}`
	}
	// 下载文件
	const handleOnPreview = async (url) => {
		// const res = await getAttachFileApi({
		// 	attach_file: encodeURIComponent(val)
		// })
		if (!url?.response?.data?.items) return
		const new_url = resolveFile(url?.response?.data?.items)
		try {
			urlDownFile(new_url)
		} catch (error) {
			console.log(error)
		}
	}
	// 获取tb需求状态字典
	const getTbTaskStatus = async (params) => {
		const res = await getTbTaskStatusApi(params)
		tb_status_dict.value = res?.items?.map((item) => {
			return {
				...item,
				label: item.name || item.text,
				value: item.id || item.value
			}
		})
		console.log(333, res)
	}
	return {
		currentTodo,
		getNodeProcess,
		getFeishuDocument,
		getCustomerUser,
		customUserDict,
		projectLoading,
		getProjectList,
		projectList,
		getDaUser,
		dwUserList,
		resolveImg,
		getDemandInfo,
		demandInfo,
		getDemandWorkflowList,
		processList,
		getTaskDetail,
		taskInfo,
		getCliamStatus,
		goUrl,
		getCurrentWorkflow,
		getTaskProcess,
		developProcess,
		reset,
		handleOnPreview,
		resolveFile,
		goDsUrl,
		getTbTaskStatus,
		tb_status_dict
	}
}
