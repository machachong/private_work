import tracker from '@/utils/tracking'
//新增需求
export const addDemandTrack = () => {
	tracker.push({
		name: 'daDemandListAdd',
		description: '新增需求',
		behavior: 'add',
		permission_id: 12050101
	})
}
//查询需求
export const searchDemandTrack = (params) => {
	tracker.push({
		name: 'daDemandListSearch',
		description: '查询需求',
		behavior: 'search',
		permission_id: 12050102,
		obj: JSON.stringify({ params })
	})
}
//认领需求
export const claimDemandTrack = (params) => {
	tracker.push({
		name: 'daDemandListAddClaim',
		description: '认领需求',
		behavior: 'click',
		permission_id: 12050103,
		obj: JSON.stringify({ params })
	})
}
//关闭需求
export const closeDemandTrack = () => {
	tracker.push({
		name: 'daDemandListClose',
		description: '关闭需求',
		behavior: 'delete',
		permission_id: 12050104
	})
}
//验收需求
export const checkDemandTrack = (params) => {
	tracker.push({
		name: 'daDemandListCheck',
		description: '验收需求',
		behavior: 'click',
		permission_id: 12050105,
		obj: JSON.stringify({ params })
	})
}
//编辑需求
export const editDemandTrack = () => {
	tracker.push({
		name: 'daDemandListEdit',
		description: '编辑需求',
		behavior: 'edit',
		permission_id: 12050106
	})
}

//查询任务
export const searchTaskTrack = (params) => {
	tracker.push({
		name: 'daTaskListSeach',
		description: '查询任务',
		behavior: 'search',
		permission_id: 12050201,
		obj: JSON.stringify({ params })
	})
}
//完成任务
export const finishTaskTrack = (params) => {
	tracker.push({
		name: 'daTaskListFinish',
		description: '完成任务',
		behavior: 'click',
		permission_id: 12050202,
		obj: JSON.stringify({ params })
	})
}
//转交任务
export const turnTaskTrack = (params) => {
	tracker.push({
		name: 'daTaskListTurn',
		description: '转交任务',
		behavior: 'click',
		permission_id: 12050203,
		obj: JSON.stringify({ params })
	})
}
//退出任务
export const exitTaskTrack = (params) => {
	tracker.push({
		name: 'daTaskListExit',
		description: '退出任务',
		behavior: 'click',
		permission_id: 12050204,
		obj: JSON.stringify({ params })
	})
}
