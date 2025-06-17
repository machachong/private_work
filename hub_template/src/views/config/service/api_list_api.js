// 接口配置

import { get, post, put, del } from "@/api/service/index"
import { fetchData } from "@/utils/tools"
const path = {
	system_api_list: "/base_table/system_api_list/" // 接口列表
}
export const getSystemApiListApi = (params) => {
	return fetchData(get, path.system_api_list, params)
}
export const addSystemApiListApi = (params) => {
	return fetchData(post, path.system_api_list, params)
}
export const editSystemApiListApi = (params) => {
	return fetchData(put, path.system_api_list, params)
}
export const delSystemApiListApi = (params) => {
	return fetchData(del, path.system_api_list, params)
}
