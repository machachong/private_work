import request from '@/api/service/request'
import { post, get } from '@/api/service'
import { fetchData } from '@/utils/tools'
import { getUrl, getImg, getTarget, extraAPP } from '@/utils/config/menu'
import settings from '@/utils/config/settings'

console.log(import.meta.env)

// 获取当前登录用户信息
export const getUserInfoApi = () => {
	return request({
		baseURL: settings.API_BOKE_URL,
		url: '/system/user/info/'
	})
}
// 查询开发人员列表
export const getDeveloperList = (params) => {
	return request({
		url: '/base_table/developer_info/',
		params
	})
}

// 获取操作用户
export const getUserOptionsApi = (params) => {
	return request({
		baseURL: settings.API_BOKE_URL,
		url: '/system/user/options/',
		params: params
	})
}

// 获取系统菜单
export const getApps = function (type) {
	return new Promise((resolve, reject) => {
		request({
			baseURL: settings.API_BOKE_URL,
			url: '/system/sys/collection/',
			method: 'GET'
		})
			.then((response) => {
				const items = response.items
				const apps = items.map((item) => {
					return {
						...item,
						url: getUrl(item.id),
						img: getImg(item.id, type),
						target: getTarget(item.id)
					}
				})
				console.log(apps)
				apps.push(...extraAPP)
				resolve(apps)
			})
			.catch((error) => {
				console.log('catch', error)
				reject(error)
			})
	})
}

// 上传图片
export const uploadFile = (params) => {
	return fetchData(post, '/develop_task/demand_pool/attach_img/', params)
}

// 下载图片文件流
export const downloadImg = (params) => {
	return request({
		url: '/develop_task/demand_pool/attach_img/',
		params: params
	})
}
// 获取飞书文档名称
export const getFeishuDocUApi = (params) => {
	return request({
		baseURL: settings.API_BOKE_URL,
		url: '/public/feishu/document/',
		params: params
	})
}
// 获取飞书用户
export const getFeishuUserApi = (params) => {
	return request({
		url: '/base_table/feishu_robot/user/',
		method: 'GET',
		params: params
	})
}
// 根据邮箱获取用户
export const getUserApi = (params) => {
	return request({
		baseURL: settings.API_AUDIT,
		url: '/system/custom_user/email/',
		method: 'GET',
		params: params
	})
}
// 获取飞书卡片图片
export const getImageApi = (params) => {
	return request({
		baseURL: settings.API_AUDIT,
		url: '/event/feishu_robot/image/',
		method: 'GET',
		params: params
	})
}
// 获取所有用户
export const getCustomerUserApi = (params) => {
	return fetchData(get, '/system/custom_user/options/', params)
}
// 获取部门用户
export const getDepartmentUserApi = (params) => {
	return fetchData(get, '/system/custom_user/department_user/', params)
}
// 获取DB项目
export const getProjectApi = (params) => {
	return request({
		baseURL: settings.API_BOKE_URL,
		url: '/system/user/project/',
		method: 'GET',
		params: params
	})
}

// 上传图片到oss
export const uploadImgToOss = (params) => {
	return request({
		baseURL: settings.API_BOKE_URL,
		url: '/public/attachment/oss/upload/',
		method: 'POST',
		data: params
	})
}
// 上传图片到服务器
export const uploadImgToServer = (params) => {
	return request({
		baseURL: settings.API_BOKE_URL,
		url: '/public/media/img/',
		method: 'POST',
		data: params
	})
}
