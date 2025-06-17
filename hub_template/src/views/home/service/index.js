import { get } from '@/api/service/index'
import { fetchData } from '@/utils/tools/index'
const path = {
	global_search: '/milestone/global_search/'
}
// 全局搜索接口
export const getGlobalSearchApi = (params) => {
	return fetchData(get, path.global_search, params)
}
