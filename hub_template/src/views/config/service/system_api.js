import { get, post, put, del } from "@/api/service/index"
import { fetchData } from "@/utils/tools"
const path = {
	system_base_info: "/base_table/system_base_info/", // 系统信息
	repository_info: "/base_table/system_repository_info/" // 项目仓库信息
}
// 系统相关接口

export const getSystemListApi = (params) => {
	return fetchData(get, path.system_base_info, params)
}
export const addSystemListApi = (params) => {
	return fetchData(post, path.system_base_info, params)
}
export const editSystemListApi = (params) => {
	return fetchData(put, path.system_base_info, params)
}
export const delSystemListApi = (params) => {
	return fetchData(del, path.system_base_info, params)
}

// 仓库相关接口

export const getRepositoryApi = (params) => {
	return fetchData(get, path.repository_info, params)
}
export const addRepositoryApi = (params) => {
	return fetchData(post, path.repository_info, params)
}
export const editRepositoryApi = (params) => {
	return fetchData(put, path.repository_info, params)
}
export const delRepositoryApi = (params) => {
	return fetchData(del, path.repository_info, params)
}

