import { get } from '@/api/service/index'
import { fetchData } from '@/utils/tools/index'
const path = {
	dev_overview: '/develop_task/demand_dashboard/user_overview/',
	data_overview: '/data_task/data_demand_dashboard/user_overview/',
	dw_overview: '/dw_task/data_demand_dashboard/user_overview/',
	dba_overview: '/db_task/data_demand_dashboard/user_overview/'
}

// 任务进度
const getPath = (demandType) => {
	if (demandType == 4) {
		return path.dev_overview
	} else if (demandType == 1) {
		return path.dw_overview
	} else if (demandType == 2) {
		return path.data_overview
	} else if (demandType == 3) {
		return path.dba_overview
	}
}
export const getTaskProcessApi = (params, demandType = 'dev') => {
	console.log(demandType)
	return fetchData(get, getPath(demandType), params)
}
