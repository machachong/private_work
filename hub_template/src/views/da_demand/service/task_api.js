import { get, put } from '@/api/service/index'
import request from '@/api/service/request'
import { fetchData } from '@/utils/tools/index'
import settings from '@/utils/config/settings'
const path = {
	da_demand_task: '/data_task/data_demand_task/', // 任务列表
	da_demand_workflow_detail: '/data_task/data_demand_workflow_detail/', // 任务进度
	operation_workflow_list: '/data_task/bind/operation_workflow_list/',
	attach_file: '/data_task/data_demand_task/attach_file/',
	da_overview: '/data_task/data_demand_dashboard/overview/',
	send_user: '/data_task/report_demand/send_users/'
}
export const getTaskListApi = (params) => {
	return fetchData(get, path.da_demand_task, params)
}
export const updateTaskApi = (params) => {
	return fetchData(put, path.da_demand_task, params, true)
}
export const getTaskWorkflowApi = (params) => {
	return fetchData(get, path.da_demand_workflow_detail, params)
}
// 获取运维工单列表
export const getOperationWorkflowListApi = (params) => {
	return request({
		baseURL: settings.API_SYSTEM,
		url: '/db/review/demand/workflow/',
		method: 'GET',
		params: params
	})
}
export const getAttachFileApi = (params) => {
	// return fetchData(get, path.attach_file, params, false)
	return request({
		url: path.attach_file,
		method: 'GET',
		params: params
	})
}

// 获取数仓需求预览
export const getDsOverviewApi = (params) => {
	return fetchData(get, path.da_overview, params, false)
}
// 获取分析报告发送人
export const getSendUserApi = (params) => {
	return fetchData(get, path.send_user, params, false)
}
