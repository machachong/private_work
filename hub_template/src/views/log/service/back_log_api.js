import { get } from "@/api/service/index"
import { fetchData } from "@/utils/tools"

// 飞书机器人相关接口
const path = {
	backLog: "/develop_data/api_request_log/"
}

export const getBackLogApi = (params) => {
	return fetchData(get, path.backLog, params)
}
