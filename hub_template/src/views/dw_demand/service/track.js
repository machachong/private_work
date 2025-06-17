import tracker from '@/utils/tracking'
//新增需求
export const addDemandTrack = (type) => {
	const name = type == 'dw' ? 'dwDemandListAdd' : 'dbDemandListAdd'
	const permission_id = type == 'dw' ? 12040101 : 12070101
	tracker.push({
		name,
		description: '新增需求',
		behavior: 'add',
		permission_id
	})
}
//查询需求
export const searchDemandTrack = (params, type) => {
	const name = type == 'dw' ? 'dwDemandListSearch' : 'dbDemandListSearch'
	const permission_id = type == 'dw' ? 12040102 : 12070102
	tracker.push({
		name,
		description: '查询需求',
		behavior: 'search',
		permission_id,
		obj: JSON.stringify({ params })
	})
}
//认领需求
export const claimDemandTrack = (params, type) => {
	const name = type == 'dw' ? 'dwDemandListAddClaim' : 'dbDemandListAddClaim'
	const permission_id = type == 'dw' ? 12040103 : 12070103
	tracker.push({
		name,
		description: '认领需求',
		behavior: 'click',
		permission_id,
		obj: JSON.stringify({ params })
	})
}
//关闭需求
export const closeDemandTrack = (params, type) => {
	const name = type == 'dw' ? 'dwDemandListClose' : 'dbDemandListClose'
	const permission_id = type == 'dw' ? 12040104 : 12070104
	tracker.push({
		name,
		description: '关闭需求',
		behavior: 'delete',
		permission_id,
		obj: JSON.stringify({ params })
	})
}
//验收需求
export const checkDemandTrack = (params, type) => {
	const name = type == 'dw' ? 'dwDemandListCheck' : 'dbDemandListCheck'
	const permission_id = type == 'dw' ? 12040105 : 12070105
	tracker.push({
		name,
		description: '验收需求',
		behavior: 'click',
		permission_id,
		obj: JSON.stringify({ params })
	})
}
//编辑需求
export const editDemandTrack = (type) => {
	const name = type == 'dw' ? 'dwDemandListEdit' : 'dbDemandListEdit'
	const permission_id = type == 'dw' ? 12040106 : 12070106
	tracker.push({
		name,
		description: '编辑需求',
		behavior: 'edit',
		permission_id
	})
}

//查询任务
export const searchTaskTrack = (params, type) => {
	const name = type == 'dw' ? 'dwTaskListSeach' : 'dbTaskListSeach'
	const permission_id = type == 'dw' ? 12040201 : 12070201
	tracker.push({
		name,
		description: '查询任务',
		behavior: 'search',
		permission_id,
		obj: JSON.stringify({ params })
	})
}
//完成任务
export const finishTaskTrack = (params, type) => {
	const name = type == 'dw' ? 'dwTaskListFinish' : 'dbTaskListFinish'
	const permission_id = type == 'dw' ? 12040202 : 12070202
	tracker.push({
		name,
		description: '完成任务',
		behavior: 'click',
		permission_id,
		obj: JSON.stringify({ params })
	})
}
//转交任务
export const turnTaskTrack = (params, type) => {
	const name = type == 'dw' ? 'dwTaskListTurn' : 'dbTaskListTurn'
	const permission_id = type == 'dw' ? 12040203 : 12070203
	tracker.push({
		name,
		description: '转交任务',
		behavior: 'click',
		permission_id,
		obj: JSON.stringify({ params })
	})
}
//退出任务
export const exitTaskTrack = (params, type) => {
	const name = type == 'dw' ? 'dwTaskListExit' : 'dbTaskListExit'
	const permission_id = type == 'dw' ? 12040204 : 12070204
	tracker.push({
		name,
		description: '退出任务',
		behavior: 'click',
		permission_id,
		obj: JSON.stringify({ params })
	})
}

// TB绑定项目
//查询任务
export const searchBindTrack = (params) => {
	tracker.push({
		name: 'tbSearchBindTrack',
		description: '查询TB项目绑定',
		behavior: 'search',
		permission_id: 12040301,
		obj: JSON.stringify({ params })
	})
}
//新增
export const addBindTrack = (params) => {
	tracker.push({
		name: 'tbAddBindTrack',
		description: '添加TB项目绑定',
		behavior: 'add',
		permission_id: 12040302,
		obj: JSON.stringify({ params })
	})
}
//编辑
export const editBindTrack = (params) => {
	tracker.push({
		name: 'tbEditBindTrack',
		description: '修改TB项目绑定',
		behavior: 'edit',
		permission_id: 12040303,
		obj: JSON.stringify({ params })
	})
}
//退出
export const delBindTrack = (params) => {
	tracker.push({
		name: 'tbDelBindTrack',
		description: '删除绑定',
		behavior: 'delete',
		permission_id: 12040304,
		obj: JSON.stringify({ params })
	})
}
