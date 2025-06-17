import { get, post, put, del } from '@/api/service/index'
import { fetchData } from '@/utils/tools/index'
import settings from '@/utils/config/settings'
import request from '@/api/service/request'
const path = {
	demand_pool: '/data_task/data_demand_pool/',
	projects_list: '/system/projects/list/',
	da_demand_workflow: '/data_task/data_demand_workflow/', // 需求流程
	da_demand_workflow_detail: '/data_task/data_demand_workflow_detail/', // 数仓工作流-需求进度
	current_workflow: '/data_task/data_demand_pool/current_workflow/',
	task_process: '/data_task/data_demand_task/process/',
	special: '/data_task/data_demand_workflow/special/',
	tb_task_status: '/data_task/bind/option/tb_task_status/'
}
// 需求池相关接口
export const getPoolListApi = (params) => {
	return fetchData(get, path.demand_pool, params)
}
export const addPool = (params) => {
	return fetchData(post, path.demand_pool, params, true)
}
export const updatePool = (params) => {
	return fetchData(put, path.demand_pool, params, true)
}
export const deletePoolApi = (params) => {
	return fetchData(del, path.demand_pool, params, true)
}

// 获取数仓项目
export const getProjectListApi = (params) => {
	return fetchData(get, path.projects_list, params)
}
// 更新需求状态接口
export const updateDemandWorkflowApi = (params, loading = true, responseAll = false) => {
	return fetchData(put, path.da_demand_workflow, params, loading, responseAll)
}
// 获取进度列表
export const getDemandWorkflowListApi = (params, loading) => {
	return fetchData(get, path.da_demand_workflow_detail, params, loading)
}
// 获取当前操作人
export const getCurrentWorkflowApi = (params) => {
	return fetchData(get, path.current_workflow, params)
}
// 任务进度
export const getTaskProcessApi = (params) => {
	return fetchData(get, path.task_process, params)
}
export const addTaskProcessApi = (params) => {
	return fetchData(post, path.task_process, params, true)
}
export const updateTaskProcessApi = (params) => {
	return fetchData(put, path.task_process, params, true)
}
export const delTaskProcessApi = (params) => {
	return fetchData(del, path.task_process, params)
}
// 特殊更新逻辑,转交，退出
export const updateDemandSpecialApi = (params, loading, responseAll = false) => {
	return fetchData(put, path.special, params, loading, responseAll)
}

// 任务进度
export const getTbTaskStatusApi = (params) => {
	return fetchData(get, path.tb_task_status, params)
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
