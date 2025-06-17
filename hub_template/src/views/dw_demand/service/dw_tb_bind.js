import { get, put, del, post } from "@/api/service/index"
import { fetchData } from "@/utils/tools/index"
const path = {
	bind: "/dw_task/bind/tb_project/",
	tb_project: "/dw_task/bind/tb_project/options/",
	tb_task_flow: "/dw_task/bind/tb_project/tb_task_flow/",
	tb_task_status: "/dw_task/bind/tb_project/tb_task_status/"
}
export const getBindListApi = (params) => {
	return fetchData(get, path.bind, params)
}
export const updateBindApi = (params) => {
	return fetchData(put, path.bind, params, true)
}
export const addBindApi = (params) => {
	return fetchData(post, path.bind, params, true)
}
export const delBindApi = (params) => {
	return fetchData(del, path.bind, params, true)
}

export const getTbProjectListApi = (params) => {
	return fetchData(get, path.tb_project, params)
}

export const getTbTaskFlowApi = (params) => {
	return fetchData(get, path.tb_task_flow, params)
}
export const getTbTaskStatusApi = (params) => {
	return fetchData(get, path.tb_task_status, params)
}
