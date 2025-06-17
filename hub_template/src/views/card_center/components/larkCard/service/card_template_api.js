// 接口配置

import request from '@/api/service/request'
import { fetchData } from '@/utils/tools'
import { get, del, post } from '@/api/service/index'
const path = {
	template_list: '/base_table/card_template/', // 接口列表
	comment_list: '/develop_data/user_message/comment/',
	comment_user: '/develop_data/user_message/comment/user_list/'
}
export const getCardTemplateApi = (params) => {
	return request({
		url: path.template_list,
		method: 'GET',
		params: params
	})
}

export const getCommenListApi = (params) => {
	return fetchData(get, path.comment_list, params)
}
export const delCommenApi = (params) => {
	return fetchData(del, path.comment_list, params)
}
export const addCommenApi = (params) => {
	return fetchData(post, path.comment_list, params)
}
export const getCommenUserApi = (params) => {
	return fetchData(get, path.comment_user, params)
}
