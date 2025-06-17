
// 接口配置

import { get, post, put, del } from "@/api/service/index"
import { fetchData } from "@/utils/tools"
const path = {
	system_api_list: "/base_table/card_template/" // 接口列表
}
export const getCardTemplateApi = (params) => {
	return fetchData(get, path.system_api_list, params)
}
export const addCardTemplateApi = (params) => {
	return fetchData(post, path.system_api_list, params)
}
export const updateCardTemplateApi = (params) => {
	return fetchData(put, path.system_api_list, params)
}
export const delCardTemplateApi = (params) => {
	return fetchData(del, path.system_api_list, params)
}
