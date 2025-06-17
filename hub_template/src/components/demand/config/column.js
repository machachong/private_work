const DbTtaskListColumn = [
	{
		label: '人员',
		prop: '人员',
		align: 'center',
		width: '200px'
	},
	{
		label: '业务工单',
		prop: '业务工单',
		align: 'left'
	},
	{
		label: '维护工单',
		prop: '维护工单',
		align: 'left'
	},
	{
		label: 'TB需求',
		prop: 'TB需求',
		align: 'left'
	},
	{
		label: '内部需求',
		prop: '内部需求',
		align: 'left'
	}
]
const DwTaskListColumn = [
	{
		label: '人员',
		prop: '人员',
		align: 'center',
		width: '200px'
	},
	{
		label: 'TB任务',
		prop: 'TB任务',
		align: 'left'
	},
	{
		label: '标签工单',
		prop: '标签工单',
		align: 'left'
	},
	{
		label: '内部任务',
		prop: '内部任务',
		align: 'left'
	}
]
const DaTaskListColumn = [
	{
		label: '人员',
		prop: '人员',
		align: 'center',
		width: '200px'
	},
	{
		label: 'TB需求',
		prop: 'TB需求',
		align: 'left'
	},
	{
		label: '标签工单',
		prop: '标签工单',
		align: 'left'
	},
	{
		label: '内部需求',
		prop: '内部需求',
		align: 'left'
	}
]
const DevTaskListColumn = [
	{
		label: '人员',
		prop: '人员',
		align: 'center',
		width: '200px'
	},
	{
		label: '新增功能',
		prop: '新增功能',
		align: 'left'
	},
	{
		label: '功能优化',
		prop: '功能优化',
		align: 'left'
	},
	{
		label: 'BUG修复',
		prop: 'BUG修复',
		align: 'left'
	}
]
const getDemandListColumn = (type) => {
	if (type == 'dba') {
		return DbTtaskListColumn
	} else if (type == 'dw') {
		return DwTaskListColumn
	} else if (type == 'da') {
		return DaTaskListColumn
	} else if (type == 'dev') {
		return DevTaskListColumn
	}
}
export { getDemandListColumn }
