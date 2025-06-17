import { get, put, del } from '@/api/service/index'
import request from '@/api/service/request'
import { fetchData } from '@/utils/tools/index'
import settings from '@/utils/config/settings'
const path = {
	dw_demand_task: '/dw_task/dw_demand_task/', // 任务列表
	dw_demand_workflow_detail: '/dw_task/dw_demand_workflow_detail/', // 任务进度
	ds_workflow_list: '/dw_task/bind/option/ds_workflow_list/',
	ds_project_list: '/dw_task/bind/option/ds_project_list/',
	bind_workflow_list: '/dw_task/bind/ds_workflow_list/',
	operation_workflow_list: '/dw_task/bind/operation_workflow_list/',
	attach_file: '/dw_task/dw_demand_task/attach_file/',
	ds_instance_list: '/dw_task/bind/option/ds_instance_list/',
	dw_overview: '/dw_task/dw_demand_dashboard/overview/'
}
const dbPath = {
	dw_demand_task: '/db_task/db_demand_task/', // 任务列表
	dw_demand_workflow_detail: '/db_task/db_demand_workflow_detail/', // 任务进度
	operation_workflow_list: '/db_task/bind/operation_workflow_list/',
	attach_file: '/db_task/db_demand_task/attach_file/',
	dw_overview: '/db_task/db_demand_dashboard/overview/'
}
export const getTaskListApi = (params, demandType = 'dw') => {
	const newPath = demandType == 'dw' ? path : dbPath
	return fetchData(get, newPath.dw_demand_task, params)
}
export const updateTaskApi = (params, demandType = 'dw') => {
	const newPath = demandType == 'dw' ? path : dbPath
	return fetchData(put, newPath.dw_demand_task, params, true)
}
// 获取ds任务
export const getDSworkflowListApi = (params) => {
	return fetchData(get, path.ds_workflow_list, params, false)
}
// 获取ds项目空间
export const getDsProjectListApi = (params) => {
	return fetchData(get, path.ds_project_list, params, false)
}
// 绑定DS
export const addBindDsListApi = (params) => {
	return fetchData(put, path.bind_workflow_list, params, false)
}
// 获取绑定的ds列表
export const getBindDsListApi = (params) => {
	return fetchData(get, path.bind_workflow_list, params, false)
}
// 删除绑定的ds列表
export const delBindDsListApi = (params) => {
	return fetchData(del, path.bind_workflow_list, params, true)
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
// export const getAttachFileApi = (params, demandType = 'dw') => {
// 	const newPath = demandType == 'dw' ? path : dbPath
// 	return request({
// 		url: newPath.attach_file,
// 		method: 'GET',
// 		params: params
// 	})
// }
// 获取ds实例
export const getDsInstanceApi = (params) => {
	return fetchData(get, path.ds_instance_list, params, false)
}

// 获取数仓需求预览
export const getDsOverviewApi = (params, demandType = 'dw') => {
	const newPath = demandType == 'dw' ? path : dbPath
	return fetchData(get, newPath.dw_overview, params, false)
}
