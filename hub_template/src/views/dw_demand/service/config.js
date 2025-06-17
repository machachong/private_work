export const demandColumns = [
	{
		label: '需求ID',
		prop: 'id',
		align: 'center',
		fixed: 'left',
		sortable: 'custom',
		width: 100
	},
	{
		label: '需求名称',
		prop: 'demand_name',
		align: 'left',
		fixed: 'left',
		minWidth: 160,
		showOverflowTooltip: true
	},
	{
		label: '需求内容',
		prop: 'demand_content',
		align: 'left',
		width: 250
	},
	{
		label: '需求类型',
		prop: 'demand_type',
		align: 'center',
		width: 120,
		formatter: (row) => dbDemandTypeDict.find((item) => item.value === row.demand_type)?.label
	},
	{
		label: '项目名称',
		prop: 'project_name',
		align: 'center',
		minWidth: 150
	},
	{
		label: '需求进度',
		prop: 'demand_process',
		align: 'center',
		width: 140
	},
	{
		label: '优先级',
		prop: 'priority_num',
		width: 90
	},
	{
		label: '需求来源',
		prop: 'demand_source',
		align: 'left',
		width: 120
	},
	{
		label: '需求人',
		prop: 'assignee_feishu_user_id',
		align: 'center',
		width: 120,
		showOverflowTooltip: true
	},
	{
		label: '执行人',
		prop: 'executor_feishu_user_ids',
		align: 'center',
		minWidth: 150
	},
	{
		label: '附件',
		prop: 'attach_img',
		align: 'center',
		width: 120
	},
	{
		label: '开发完成时间',
		prop: 'end_time',
		align: 'center',
		width: 170,
		sortable: 'custom'
	},
	{
		label: '需求完成时间',
		prop: 'complete_time',
		align: 'center',
		width: 170,
		sortable: 'custom'
	},
	{
		label: '截止时间',
		prop: 'deadline_time',
		align: 'center',
		width: 170,
		sortable: 'custom'
	},
	{
		label: '创建时间',
		prop: 'create_time',
		align: 'center',
		width: 180,
		sortable: 'custom'
	},
	{
		label: '操作',
		prop: 'handle',
		align: 'center',
		width: 200,
		fixed: 'right'
	}
]
export const taskColumns = [
	{
		label: '',
		prop: 'expand',
		align: 'center',
		type: 'expand',
		fixed: 'left',
		width: 60
	},
	{
		label: '需求ID',
		prop: 'demand_id',
		align: 'center',
		fixed: 'left',
		sortable: 'custom',
		formatter: (row) => row.demand_detail.id,
		minWidth: 100
	},
	{
		label: '需求名称',
		prop: 'demand_name',
		align: 'center',
		fixed: 'left',
		width: 160,
		showOverflowTooltip: true
	},
	{
		label: '任务内容',
		prop: 'task_content',
		align: 'center',
		'min-width': 250
		// showOverflowTooltip: true
	},
	{
		label: '任务类型',
		prop: 'task_type',
		align: 'center',
		minWidth: 120,
		formatter: (row) => demandTypeDict.find((item) => item.value === row.task_type)?.label
	},
	{
		label: '任务状态',
		prop: 'task_status',
		align: 'center',
		width: 120,
		formatter: (row) => taskStatusDict.find((item) => item.value === row.task_status)?.label
	},
	{
		label: '项目名称',
		prop: 'project_name',
		align: 'center',
		minWidth: 150,
		showOverflowTooltip: true
	},
	{
		label: '需求进度',
		prop: 'task_process',
		align: 'center',
		width: 140
	},
	{
		label: '附件',
		prop: 'task_user_name',
		align: 'center',
		width: 120
	},
	{
		label: '执行人',
		prop: 'feishu_user_id',
		align: 'center',
		'min-width': 100,
		showOverflowTooltip: true
	},
	{
		label: '需求人',
		prop: 'assignee_feishu_user_id',
		align: 'center',
		width: 120,
		showOverflowTooltip: true
	},
	{
		label: '截止时间',
		prop: 'demand__deadline_time',
		align: 'center',
		sortable: 'custom',
		width: 200,
		formatter: (row) => row.demand_detail?.deadline_time
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
		label: '开发完成时间',
		prop: 'complete_time',
		align: 'center',
		sortable: 'custom',
		width: 180
	},
	{
		label: '操作',
		prop: 'handle',
		align: 'center',
		width: 200,
		fixed: 'right'
	}
]
// 需求类型字典
export const demandTypeDict = [
	{
		value: 0,
		label: '未分配',
		color: '#6395FA'
	},
	{
		value: 1,
		label: '开发类',
		color: '#63DAAB'
	},
	{
		value: 2,
		label: '工单类',
		color: '#657798'
	}
]
// dba需求类型
export const dbDemandTypeDict = [
	{
		value: 0,
		label: '未分配',
		color: '#6395FA'
	},
	{
		value: 1,
		label: '数据查询',
		color: '#63DAAB'
	},
	{
		value: 2,
		label: '数据修改',
		color: '#657798'
	},
	{
		value: 3,
		label: '测试账号改数',
		color: '#657798'
	},
	{
		value: 4,
		label: '账号封禁',
		color: '#657798'
	},
	{
		value: 5,
		label: '在线维护',
		color: '#657798'
	},
	{
		value: 6,
		label: '告警处理',
		color: '#657798'
	},
	{
		value: 7,
		label: '停机维护',
		color: '#657798'
	},
	{
		value: 8,
		label: '紧急事故',
		color: '#657798'
	},
	{
		value: 9,
		label: '技术研究',
		color: '#657798'
	},
	{
		value: 10,
		label: '其他',
		color: '#657798'
	}
]
// 需求流转状态
export const demandProcessDict = [
	{
		value: 0,
		label: '未认领', // 需求列表 - 新增需求
		type: 'info'
	},
	{
		value: 4,
		label: '需求认领', // 任务列表操作 || // 卡片操作
		type: 'info'
	},
	{
		value: 5,
		label: '需求开发', // 任务列表操作 || // 卡片操作
		type: 'primary'
	},
	{
		value: 9,
		label: '需求人验收', // 需求列表操作 || // 卡片操作
		type: 'warning'
	},
	{
		value: 10,
		label: '需求完成',
		type: 'success'
	},
	{
		value: 12,
		label: '需求完成-自动',
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
// 关联工单
export const orderColumns = [
	{
		label: '工单编号',
		prop: 'id',
		align: 'center',
		width: 110,
		showOverflowTooltip: true
	},
	{
		label: '工单名称',
		prop: 'workflow_name',
		align: 'center',
		showOverflowTooltip: true
	},
	{
		label: '链接源名称',
		prop: 'ds_name',
		align: 'center',
		showOverflowTooltip: true
	}
	// {
	// 	label: "数据库",
	// 	prop: "complete_time",
	// 	align: "center",
	// 	width: 180
	// },
	// {
	// 	label: "表名",
	// 	prop: "complete_time",
	// 	align: "center",
	// 	width: 180
	// },
	// {
	// 	label: "表注释",
	// 	prop: "complete_time",
	// 	align: "center",
	// 	width: 180
	// }
]
// 关联DS任务
export const dsTaskColumns = [
	{
		label: '工作流名称',
		prop: 'name',
		align: 'center',
		width: 180,
		showOverflowTooltip: true
	},
	{
		label: '空间名称',
		prop: 'ds_project_name',
		align: 'center',
		width: 110,
		showOverflowTooltip: true
	},
	{
		label: '实例名称',
		prop: 'asset_item_name',
		align: 'center',
		width: 120,
		showOverflowTooltip: true
	},
	{
		label: '状态',
		prop: 'releaseState',
		align: 'center',
		width: 80
	},
	{
		label: '描述',
		prop: 'description',
		align: 'center',
		showOverflowTooltip: true
	},
	{
		label: '更新时间',
		prop: 'updateTime',
		align: 'center',
		sortable: true,
		width: 180
	},
	{
		label: '操作',
		prop: 'handle',
		align: 'center',
		fixed: 'right',
		width: 80
	}
]
// 优先级
export const priorityDict = [
	{
		label: '低',
		value: -10,
		type: 'info'
	},
	{
		label: '中',
		value: 0,
		type: 'primary'
	},
	{
		label: '高',
		value: 1,
		type: 'warning'
	},
	{
		label: '紧急',
		value: 2,
		type: 'danger'
	}
]

// 认领状态字典
export const claimDict = [
	{
		label: '认领',
		value: 'dw_demand_claim_1'
	},
	{
		label: '拒绝',
		value: 'dw_demand_claim_2'
	},
	{
		label: '转交',
		value: 'dw_demand_claim_3'
	}
]
// dba认领状态字典
export const dbClaimDict = [
	{
		label: '认领',
		value: 'db_demand_claim_1'
	},
	{
		label: '拒绝',
		value: 'db_demand_claim_2'
	},
	{
		label: '转交',
		value: 'db_demand_claim_3'
	}
]
export const demandSourceDict = [
	{
		label: '内部任务',
		value: 1
	},
	{
		label: 'TB任务',
		value: 2
	},
	{
		label: '标签工单',
		value: 3
	}
]
// dba需求来源
export const dbDemandSourceDict = [
	{
		label: '内部任务',
		value: 1
	},
	{
		label: 'TB任务',
		value: 2
	},
	{
		label: '业务工单',
		value: 3
	},
	{
		label: '维护工单',
		value: 4
	}
]
export const bindColumns = [
	// {
	// 	label: "Id",
	// 	prop: "id",
	// 	align: "center",
	// 	// sortable: "custom",
	// 	width: 120
	// },
	{
		label: '项目名称',
		prop: 'project_name',
		align: 'center',
		showOverflowTooltip: true,
		minWidth: '150px'
	},
	{
		label: 'TB空间',
		prop: 'tb_project_id',
		align: 'left',
		showOverflowTooltip: true,
		minWidth: '150px'
	},
	{
		label: '结束状态',
		prop: 'end_status_name',
		align: 'left',
		showOverflowTooltip: true
	},
	{
		label: '创建人',
		prop: 'creator_feishu_user_id',
		align: 'center'
	},
	{
		label: '创建时间',
		prop: 'create_time',
		align: 'center',
		sortable: 'custom',
		width: 180
	},
	{
		label: '操作',
		prop: 'handle',
		align: 'center',
		width: 120
	}
]
// 任务列表中的ds任务
export const dsTaskColumnsTwo = [
	{
		label: '工作流名称',
		prop: 'name',
		align: 'center',
		showOverflowTooltip: true
	},
	{
		label: '空间名称',
		prop: 'ds_project_name',
		align: 'center',
		showOverflowTooltip: true
	},
	{
		label: '实例名称',
		prop: 'ds_bind_id',
		align: 'center',
		showOverflowTooltip: true
	},
	{
		label: '状态',
		prop: 'releaseState',
		align: 'center'
	},
	{
		label: '描述',
		prop: 'description',
		align: 'center',
		showOverflowTooltip: true
	},
	{
		label: '更新时间',
		prop: 'updateTime',
		align: 'center',
		sortable: true
	}
]
