// 接口配置

import { get, put } from '@/api/service/index'
import { fetchData } from '@/utils/tools'
const path = {
	user_robot: '/develop_data/user_card_log/option/', // 机器人列表,项目列表
	user_card_log: '/develop_data/user_card_log/', // 获取当前卡片日志列表
	user_overview: '/develop_data/user_card_log/overview/', // 当前用户概览统计
	all_read: '/develop_data/user_card_log/all_read/', // 全部已读
	user_overview_email: '/develop_data/user_mail_log/overview/', // 获取邮件概览统计
	user_email_log: '/develop_data/user_mail_log/', //获取邮件列表
	all_read_email: '/develop_data/user_mail_log/all_read/', // 邮件全部已读
	email_project: '/develop_data/user_mail_log/option/', // 邮件项目
	msg_overview: '/develop_data/user_message/overview/', // 消息总览
	not_disturb: '/develop_data/user_message/not_disturb/' // 消息免打扰
}
export const getUserRobotApi = (params) => {
	return fetchData(get, path.user_robot, params)
}
export const getCardListApi = (params) => {
	return fetchData(get, path.user_card_log, params)
}
export const editCardApi = (params) => {
	return fetchData(put, path.user_card_log, params)
}
export const getUserOverviewApi = (params) => {
	return fetchData(get, path.user_overview, params)
}
export const setAllReadApi = (params) => {
	return fetchData(put, path.all_read, params)
}

export const getUserOverviewEmailApi = (params) => {
	return fetchData(get, path.user_overview_email, params)
}
export const getEmailListApi = (params) => {
	return fetchData(get, path.user_email_log, params)
}
export const setAllReadEmailApi = (params) => {
	return fetchData(put, path.all_read_email, params)
}
export const editEmailApi = (params) => {
	return fetchData(put, path.user_email_log, params)
}
export const getEmailProjectApi = (params) => {
	return fetchData(get, path.email_project, params)
}

export const getMsgOverviewApi = (params) => {
	return fetchData(get, path.msg_overview, params)
}

export const getNotDisturbApi = (params) => {
	return fetchData(get, path.not_disturb, params)
}
export const setNotDisturbApi = (params) => {
	return fetchData(put, path.not_disturb, params)
}
