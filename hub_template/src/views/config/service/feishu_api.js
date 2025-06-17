import { get, post, put, del } from "@/api/service/index"
import { fetchData } from "@/utils/tools"

// 飞书机器人相关接口
const path = {
	robot_list: "/base_table/feishu_robot/",
	roubot_sync: "/base_table/feishu_robot/rsync/"
}

export const getRobotListApi = (params) => {
	return fetchData(get, path.robot_list, params)
}
export const addRobotApi = (params) => {
	return fetchData(post, path.robot_list, params)
}
export const updateRobotApi = (params) => {
	return fetchData(put, path.robot_list, params)
}
export const deleteRobotApi = (params) => {
	return fetchData(del, path.robot_list, params)
}
// 同步获取机器人信息
export const getRoubotSyncApi = (params) => {
	return fetchData(put, path.roubot_sync, params)
}
