import { get } from "@/api/service/index"
import { fetchData } from "@/utils/tools"
const path = {
	overview: "/develop_data/api_request_log/overview/count/", // 
	overview_date: "/develop_data/api_request_log/overview/date/", // 
	overview_rank: "/develop_data/api_request_log/overview/rank/"
}
export const getOverviewApi = (params) => {
	return fetchData(get, path.overview, params)
}
export const getOverviewRankApi = (params) => {
	return fetchData(get, path.overview_rank, params)
}
export const getOverviewDateApi = (params) => {
	return fetchData(get, path.overview_date, params)
}
