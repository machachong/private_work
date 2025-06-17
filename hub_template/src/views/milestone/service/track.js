import tracker from '@/utils/tracking'

export const creatMiliestone = (params) => {
	tracker.push({
		name: 'creatMiliestone',
		description: '创建里程碑',
		behavior: 'add',
		permission_id: 120601,
		obj: JSON.stringify(params)
	})
}
export const deleteMiliestone = (params) => {
	tracker.push({
		name: 'deleteMiliestone',
		description: '删除里程碑',
		behavior: 'delete',
		permission_id: 120602,
		obj: JSON.stringify(params)
	})
}
export const editMiliestone = (params) => {
	tracker.push({
		name: 'editMiliestone',
		description: '编辑里程碑',
		behavior: 'edit',
		permission_id: 120603,
		obj: JSON.stringify(params)
	})
}
export const searchMiliestone = (params) => {
	tracker.push({
		name: 'searchMiliestone',
		description: '刷新里程碑列表',
		behavior: 'click',
		permission_id: 120604,
		obj: JSON.stringify(params)
	})
}

export const creatMiliestoneNode = (params) => {
	tracker.push({
		name: 'creatMiliestoneNode',
		description: '创建里程碑节点',
		behavior: 'add',
		permission_id: 120605,
		obj: JSON.stringify(params)
	})
}
export const deleteMiliestoneNode = (params) => {
	tracker.push({
		name: 'deleteMiliestoneNode',
		description: '删除里程碑节点',
		behavior: 'delete',
		permission_id: 120606,
		obj: JSON.stringify(params)
	})
}
export const editMiliestoneNode = (params) => {
	tracker.push({
		name: 'editMiliestoneNode',
		description: '编辑里程碑节点',
		behavior: 'edit',
		permission_id: 120607,
		obj: JSON.stringify(params)
	})
}
