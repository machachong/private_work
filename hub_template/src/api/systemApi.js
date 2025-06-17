import { get } from "@/api/service/index"
import { fetchData } from "@/utils/tools"
const path = {
	system_base_info: "/base_table/system_base_info/" // 系统信息
}
// 获取系统列表
export const getSystemListApi = (params) => {
	return fetchData(get, path.system_base_info, params)
}
