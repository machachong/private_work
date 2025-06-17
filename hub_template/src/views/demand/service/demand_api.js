import { get, post, put, del } from '@/api/service/index'
import { fetchData } from '@/utils/tools/index'
const path = {
	fullLog: '/report/qbi/access_log/',
	demand_pool: '/develop_task/demand_pool/',
	demand_detail: '/develop_task/demand_workflow_detail/',
	demand_workflow: '/develop_task/demand_workflow/',
	demand_task: '/develop_task/demand_task/',
	special: '/develop_task/demand_workflow/special/',
	batch_demand: '/develop_task/gitlab_merge/batch_demand/',
	task_process: '/develop_task/demand_task/process/',
	close_demand: '/develop_task/demand_pool/',
	task_category: '/develop_task/demand_dashboard/category/',
	task_overview: '/develop_task/demand_dashboard/overview/',
	task_count: '/develop_task/demand_dashboard/task/',
	current_workflow: '/develop_task/demand_pool/current_workflow/',
	claim_demand: '/develop_task/demand_workflow/',
	export_demand: '/develop_task/demand_pool/export_doc/',
	notice: '/develop_task/demand_pool/notice/',
	menu_source: '/develop_task/demand_pool/menu_source/'
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
export const getDemandDetailApi = (params) => {
	return fetchData(get, path.demand_detail, params)
}
// 更新需求状态接口
export const updateDemandWorkflowApi = (params, loading) => {
	return fetchData(put, path.demand_workflow, params, loading)
}
// 特殊更新逻辑,需求对接用,自定义开发者
export const updateDemandSpecialApi = (params, loading, responseAll = false) => {
	return fetchData(put, path.special, params, loading, responseAll)
}
// 任务接口
export const getTaskListApi = (params) => {
	return fetchData(get, path.demand_task, params)
}
// 任务批量更新获取分支
export const getBranchApi = (params, loading) => {
	return fetchData(get, path.batch_demand, params, loading)
}
// 任务批量更新正式
export const batchUpdateApi = (params) => {
	return put(path.batch_demand, params, { responseAll: true })
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

// 关闭需求
export const closeDemandApi = (params) => {
	return fetchData(del, path.close_demand, params)
}
// 任务看板

export const getTaskCategoryApi = (params) => {
	return fetchData(get, path.task_category, params)
}
export const getTaskOverviewApi = (params) => {
	return fetchData(get, path.task_overview, params)
}
export const getTaskCountApi = (params) => {
	return fetchData(get, path.task_count, params)
}

export const getCurrentWorkflowApi = (params) => {
	return fetchData(get, path.current_workflow, params)
}
export const claimDemandApi = (params) => {
	return fetchData(get, path.claim_demand, params)
}
export const exportDemandApi = (params) => {
	return fetchData(get, path.export_demand, params)
}
// 重新发送提醒
export const sendNoticeApi = (params) => {
	return fetchData(put, path.notice, params)
}
// 获取所属下拉列表
export const getMenuSourceApi = (params) => {
	return fetchData(get, path.menu_source, params)
}
