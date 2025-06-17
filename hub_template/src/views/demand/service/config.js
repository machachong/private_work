export const demandColumns = [
	{
		label: '需求ID',
		prop: 'id',
		align: 'center',
		fixed: 'left',
		sortable: 'custom',
		width: 160
	},
	{
		label: '需求名称',
		prop: 'demand_name',
		align: 'left',
		fixed: 'left',
		width: 160,
		showOverflowTooltip: true
	},
	{
		label: '系统平台',
		prop: 'system',
		align: 'center',
		width: 160
	},
	{
		label: '需求类型',
		prop: 'demand_type',
		align: 'center',
		width: 120,
		formatter: (row) => demandTypeDict.find((item) => item.value === row.demand_type)?.label
	},
	{
		label: '需求内容',
		prop: 'demand_content',
		align: 'left',
		width: 250
	},
	{
		label: '附件',
		prop: 'attach_img',
		align: 'center',
		width: 150
	},
	{
		label: '需求来源',
		prop: 'demand_source',
		align: 'center',
		width: 120,
		formatter: (row) => demandSourceDict.find((item) => item.value === row.demand_source)?.label
	},
	{
		label: '需求人',
		prop: 'demand_assignee',
		align: 'center',
		width: 120
	},
	{
		label: '需求进度',
		prop: 'demand_process',
		align: 'center',
		width: 160
	},
	{
		label: '原型URL',
		prop: 'prd_url',
		width: 200,
		align: 'center'
	},
	{
		label: '原型状态',
		prop: 'prd_status',
		align: 'center',
		width: 150
	},
	{
		label: '需求文档',
		prop: 'doc_url',
		align: 'center',
		width: 200,
		showOverflowTooltip: true
	},
	{
		label: '更新时间',
		prop: 'update_time',
		align: 'center',
		width: 200,
		sortable: 'custom'
	},
	{
		label: '预期时间',
		prop: 'deadline_time',
		align: 'center',
		width: 200,
		sortable: 'custom'
	},
	{
		label: '实际完成时间',
		prop: 'end_time',
		align: 'center',
		width: 200,
		sortable: 'custom'
	},
	{
		label: '创建时间',
		prop: 'create_time',
		align: 'center',
		width: 200,
		sortable: 'custom'
	},
	{
		label: '开始时间',
		prop: 'start_time',
		align: 'center',
		width: 200,
		sortable: 'custom'
	},
	{
		label: '创建人',
		prop: 'demand_creator',
		align: 'center',
		width: 250
	},
	{
		label: '备注信息',
		prop: 'demand_description',
		align: 'center',
		'min-width': 200,
		showOverflowTooltip: true
	},
	{
		label: '操作',
		prop: 'handle',
		align: 'center',
		width: 245,
		fixed: 'right'
	}
]
export const taskColumns = [
	{
		label: '',
		prop: 'index',
		align: 'center',
		type: 'selection'
	},
	{
		label: '需求ID',
		prop: 'demand_detail.id',
		align: 'center',
		fixed: 'left',
		// sortable: "custom",
		width: 90
	},
	{
		label: '需求名称',
		prop: 'demand_detail.demand_name',
		align: 'center',
		fixed: 'left',
		width: 160,
		showOverflowTooltip: true
	},
	{
		label: '系统平台',
		prop: 'demand',
		align: 'center',
		width: 150
	},
	{
		label: '任务内容',
		prop: 'task_content',
		align: 'center',
		'min-width': 250
		// showOverflowTooltip: true
	},
	{
		label: '附件',
		prop: 'task_user_name',
		align: 'center',
		width: 200
	},
	{
		label: '任务类型',
		prop: 'task_type',
		align: 'center',
		formatter: (row) => developerType.find((item) => item.value === row.task_type)?.label
	},
	{
		label: '任务责任人',
		prop: 'task_user_id',
		align: 'center',
		'min-width': 100
	},
	{
		label: '需求来源',
		prop: 'demand_source',
		align: 'center',
		width: 120,
		formatter: (row) => demandSourceDict.find((item) => item.value === row?.demand_detail?.demand_source)?.label
	},
	// {
	// 	label: "任务状态",
	// 	prop: "flag_type",
	// 	align: "center"
	// },
	{
		label: '需求进度',
		prop: 'task_process',
		align: 'center',
		width: 210
	},
	{
		label: '需求人',
		prop: 'gitlab_url',
		align: 'center',
		width: 120
	},
	{
		label: '预期时间',
		prop: 'deadline_time',
		align: 'center',
		sortable: 'custom',
		width: 200
	},
	{
		label: '原型URL',
		prop: 'approval_user_id',
		align: 'center',
		width: 200
	},
	{
		label: '备注信息',
		prop: 'demand_detail.demand_description',
		align: 'center',
		'min-width': 200,
		showOverflowTooltip: true
	},
	{
		label: '认领时间',
		prop: 'claim_time',
		align: 'center',
		sortable: 'custom',
		width: 180
	},
	{
		label: '开始时间',
		prop: 'start_time',
		align: 'center',
		sortable: 'custom',
		width: 180
	},
	{
		label: '结束时间',
		prop: 'complete_time',
		align: 'center',
		sortable: 'custom',
		width: 180
	},
	{
		label: '操作',
		prop: 'handle',
		align: 'center',
		width: 250,
		fixed: 'right'
	}
]
// 需求类型字典
export const demandTypeDict = [
	{
		value: 1,
		label: '新增功能',
		color: '#6395FA'
	},
	{
		value: 2,
		label: '功能优化',
		color: '#63DAAB'
	},
	{
		value: 3,
		label: 'Bug修复',
		color: '#657798'
	}
]
// 需求流转状态
export const demandProcessDict = [
	{
		value: 0,
		label: '需求录入', // 需求列表 - 新增需求
		type: 'info'
	},
	{
		value: 1,
		label: '需求对接', // 需求列表操作
		type: 'info'
	},
	{
		value: 2,
		label: '原型设计', // 任务列表操作
		type: 'primary'
	},
	{
		value: 3,
		label: '原型审批', // 需求列表操作 || // 卡片操作
		type: 'primary'
	},
	{
		value: 4,
		label: '需求认领', // 卡片操作
		type: 'primary'
	},
	{
		value: 5,
		label: '代码开发', // 任务列表操作 || // 卡片操作
		type: 'primary'
	},
	{
		value: 6,
		label: '测试验收', // 任务列表操作 || // 卡片操作
		type: 'primary'
	},
	{
		value: 7,
		label: '更新正式', // 任务列表操作 || // 卡片操作
		type: 'primary'
	},
	{
		value: 8,
		label: '正式验收', // 任务列表操作 || // 卡片操作
		type: 'primary'
	},
	{
		value: 9,
		label: '需求人验收', // 需求列表操作 || // 卡片操作
		type: 'primary'
	},
	{
		value: 10,
		label: '需求完成-符合预期',
		type: 'success'
	},
	{
		value: 11,
		label: '需求完成-不符合预期',
		type: 'danger'
	},
	{
		value: 12,
		label: '需求完成-自动验收',
		type: 'success'
	},
	{
		value: 20,
		label: '需求关闭',
		type: 'info'
	}
]
// 包含原型的节点
export const prdProcess = [2, 3]
// 需求状态字典
export const demandStatusDict = [
	{
		value: 0,
		label: '未开始'
	},
	{
		value: 1,
		label: '进行中'
	},
	{
		value: 2,
		label: '已完成'
	}
]
// 是否需要字典
export const isOrNoDict = [
	{
		value: 1,
		label: '需要'
	},
	{
		value: 2,
		label: '不需要'
	}
]
// 任务类型字典
export const developerType = [
	{
		value: 1,
		label: '前端'
	},
	{
		value: 2,
		label: '后端'
	},
	{
		value: 4,
		label: '产品'
	},
	{
		value: 5,
		label: '需求人'
	},
	{
		value: 6,
		label: '执行人'
	}
]
// 任务状态字典
export const taskStatusDict = [
	{
		label: '开发中',
		value: 1
	},
	{
		label: '已完成',
		value: 2
	}
]

// 新增任务 任务规模
export const demandScaleDict = [
	{
		label: '普通新增',
		value: 1,
		desc: '页面上新增功能，如：添加一个筛选项'
	},
	{
		label: '页面新增',
		value: 2,
		desc: '新增一个页面，如：添加一个新的页面功能'
	},
	{
		label: '模块新增',
		value: 4,
		desc: '新增一个一级菜单，如： 添加定时任务模块'
	},
	{
		label: '系统新增',
		value: 5,
		desc: '新增一个平台，如： 添加开发后台'
	}
]
// 需求来源字典
export const demandSourceDict = [
	{
		value: 1,
		label: '开发需求'
	},
	{
		value: 2,
		label: '普通需求'
	}
]
