import { get, post, put, del } from '@/api/service/index'
import { fetchData } from '@/utils/tools/index'
import settings from '@/utils/config/settings'
import request from '@/api/service/request'
const path = {
	dw_task_process: '/dw_task/dw_demand_task/process/',
	db_task_process: '/db_task/db_demand_task/process/',
	da_task_process: '/data_task/data_demand_task/process/',
	dev_task_process: '/develop_task/demand_task/process/'
}
// 获取标签工单审批流程
export const getLabelOrderLogApi = (id, params) => {
	return request({
		baseURL: settings.API_BOKE_URL,
		url: `/review/workflow/${id}/log/`,
		method: 'GET',
		params: params
	})
}
// 任务进度
const getPath = (demandType) => {
	console.log(demandType)

	if (demandType == 'dev') {
		return path.dev_task_process
	} else if (demandType == 'db') {
		return path.db_task_process
	} else if (demandType == 'da') {
		return path.da_task_process
	} else {
		return path.dw_task_process
	}
}
export const getTaskProcessApi = (params, demandType = 'dw') => {
	return fetchData(get, getPath(demandType), params)
}
export const addTaskProcessApi = (params, demandType = 'dw') => {
	console.log(getPath(demandType))
	return fetchData(post, getPath(demandType), params, true)
}
export const updateTaskProcessApi = (params, demandType = 'dw') => {
	return fetchData(put, getPath(demandType), params, true)
}
export const delTaskProcessApi = (params, demandType = 'dw') => {
	return fetchData(del, getPath(demandType), params)
}
