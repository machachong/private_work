import request from "./request"
export const get = (url, params, others = {}) => {
	return request({
		url,
		method: "GET",
		params,
		...others
	})
}
export const post = (url, params, others = {}) => {
	return request({
		url,
		method: "POST",
		data: params,
		...others
	})
}
export const put = (url, params, others = {}) => {
	return request({
		url,
		method: "PUT",
		data: params,
		...others
	})
}
export const del = (url, params, others = {}) => {
	return request({
		url,
		method: "DELETE",
		params,
		...others
	})
}
