
import request from "@/api/service/request"

const path = {
	auth: "/auth_app/"
}
// 获取飞书鉴权
export const getFeishuAuth = (params) => {
	return request({
		url: path.auth,
		method: "GET",
		params: params
	})
}