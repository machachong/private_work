import { get, post, put, del } from '@/api/service/index'
import { fetchData } from '@/utils/tools/index'
const path = {
	demand_pool: '/dw_task/dw_demand_pool/',
	custom_user: '/system/custom_user/options/',
	projects_list: '/system/dw_project/',
	dw_demand_workflow: '/dw_task/dw_demand_workflow/', // 需求流程
	dw_demand_workflow_detail: '/dw_task/dw_demand_workflow_detail/', // 数仓工作流-需求进度
	current_workflow: '/dw_task/dw_demand_pool/current_workflow/',
	task_process: '/dw_task/dw_demand_task/process/',
	special: '/dw_task/dw_demand_workflow/special/',
	tb_task_status: '/dw_task/bind/option/tb_task_status/'
}
const dbPath = {
	demand_pool: '/db_task/db_demand_pool/',
	custom_user: '/system/custom_user/options/',
	projects_list: '/system/db_project/',
	dw_demand_workflow: '/db_task/db_demand_workflow/', // 需求流程
	dw_demand_workflow_detail: '/db_task/db_demand_workflow_detail/', // 数仓工作流-需求进度
	current_workflow: '/db_task/db_demand_pool/current_workflow/',
	task_process: '/db_task/db_demand_task/process/',
	special: '/db_task/db_demand_workflow/special/',
	tb_task_status: '/db_task/bind/option/tb_task_status/'
}
// 需求池相关接口
export const getPoolListApi = (params, demandType = 'dw') => {
	const newPath = demandType == 'dw' ? path : dbPath
	return fetchData(get, newPath.demand_pool, params)
}
export const addPool = (params, demandType = 'dw') => {
	const newPath = demandType == 'dw' ? path : dbPath
	return fetchData(post, newPath.demand_pool, params, true)
}
export const updatePool = (params, demandType = 'dw') => {
	const newPath = demandType == 'dw' ? path : dbPath
	return fetchData(put, newPath.demand_pool, params, true)
}
export const deletePoolApi = (params, demandType = 'dw') => {
	const newPath = demandType == 'dw' ? path : dbPath
	return fetchData(del, newPath.demand_pool, params, true)
}

// 获取数仓项目
export const getProjectListApi = (params) => {
	return fetchData(get, path.projects_list, params)
}
// 更新需求状态接口
export const updateDemandWorkflowApi = (params, loading = true, responseAll = false, demandType = 'dw') => {
	const newPath = demandType == 'dw' ? path : dbPath
	return fetchData(put, newPath.dw_demand_workflow, params, loading, responseAll)
}
// 获取进度列表
export const getDemandWorkflowListApi = (params, loading, demandType = 'dw') => {
	const newPath = demandType == 'dw' ? path : dbPath
	return fetchData(get, newPath.dw_demand_workflow_detail, params, loading)
}
// 获取当前操作人
export const getCurrentWorkflowApi = (params, demandType = 'dw') => {
	const newPath = demandType == 'dw' ? path : dbPath
	return fetchData(get, newPath.current_workflow, params)
}
// 任务进度
export const getTaskProcessApi = (params, demandType = 'dw') => {
	const newPath = demandType == 'dw' ? path : dbPath
	return fetchData(get, newPath.task_process, params)
}
export const addTaskProcessApi = (params, demandType = 'dw') => {
	const newPath = demandType == 'dw' ? path : dbPath
	return fetchData(post, newPath.task_process, params, true)
}
// 特殊更新逻辑,转交，退出
export const updateDemandSpecialApi = (params, loading, responseAll = false, demandType = 'dw') => {
	const newPath = demandType == 'dw' ? path : dbPath
	return fetchData(put, newPath.special, params, loading, responseAll)
}

// 任务进度
export const getTbTaskStatusApi = (params, demandType = 'dw') => {
	const newPath = demandType == 'dw' ? path : dbPath
	return fetchData(get, newPath.tb_task_status, params)
}
