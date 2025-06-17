export const statusDict = [
	{
		label: '未开始',
		value: 0,
		type: 'info'
	},
	{
		label: '进行中',
		value: 1,
		type: 'primary'
	},
	{
		label: '已完成',
		value: 2,
		type: 'success'
	}
]
export const yearsDict = [
	{
		value: 2025,
		label: '2025'
	}
]
export const defaultNode = () => {
	return {
		node_name: '',
		node_description: '',
		deadline_time: '',
		status: 0,
		notice_executors: [],
		type: 'add'
	}
}
