import { ref } from 'vue'
import settings from '@/utils/config/settings.js'
import { getFeishuDocUApi } from '@/api/publicApi'
import { getPoolListApi, getDemandDetailApi, getTaskListApi, getMenuSourceApi } from '../service/demand_api'
export const useDemandList = () => {
	const demandInfo = ref({}) // 需求详情
	const processList = ref([]) // 进度详情
	const taskInfo = ref({}) // 任务详情
	const resolveImg = (val) => {
		if (val) {
			return val.split(',').map((item) => {
				return `${settings.API_URL}/develop_task/demand_pool/attach_img/?attach_img=${item}`
			})
		}
		return []
	}
	const getDemandDetail = async (demand_id) => {
		// 如果需求id不存在那么进度默认为空
		if (!demand_id) {
			processList.value = []
			return
		}
		const res = await getDemandDetailApi({ demand_id })
		if (res) {
			const { items = [] } = res
			processList.value = items
		} else {
			processList.value = []
		}
	}
	const getTaskDetail = async (task_id) => {
		if (!task_id) return (taskInfo.value = {})
		const res = await getTaskListApi({ task_id })
		if (res && res.items.length === 1) {
			taskInfo.value = res.items[0]
		} else {
			taskInfo.value = {}
		}
	}
	const getPoolList = async (id) => {
		const res = await getPoolListApi({ id })
		if (res && res.items.length === 1) {
			demandInfo.value = res.items[0]
		} else {
			demandInfo.value = {}
		}
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
	// 获取菜单来源
	const getMenuSource = async (value) => {
		const res = await getMenuSourceApi({
			system_id: value
		})
		return res?.items
	}
	return {
		resolveImg,
		getDemandDetail,
		getTaskDetail,
		getPoolList,
		demandInfo,
		processList,
		taskInfo,
		getFeishuDocument,
		getMenuSource
	}
}
