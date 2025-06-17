import { get, put, del, post } from '@/api/service/index'
import { fetchData } from '@/utils/tools/index'
const path = {
	milestone: '/milestone/list/',
	node: '/milestone/node/',
	position: '/milestone/list/position/'
}
export const getMilestoneListApi = (params) => {
	return fetchData(get, path.milestone, params)
}
export const updateMilestoneApi = (params) => {
	return fetchData(put, path.milestone, params, true)
}
export const addMilestoneApi = (params) => {
	return fetchData(post, path.milestone, params, true)
}
export const delMilestoneApi = (params) => {
	return fetchData(del, path.milestone, params, true)
}

export const getNodeListApi = (params) => {
	return fetchData(get, path.node, params)
}
export const updateNodeApi = (params) => {
	return fetchData(put, path.node, params, true)
}
export const addNodeApi = (params) => {
	return fetchData(post, path.node, params, true)
}
export const delNodeApi = (params) => {
	return fetchData(del, path.node, params, true)
}

export const updatePositionApi = (params) => {
	return fetchData(put, path.position, params, false)
}
