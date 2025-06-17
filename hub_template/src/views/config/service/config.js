export const systemColumns = [
	{
		label: '',
		prop: 'expand',
		align: 'center',
		type: 'expand',
		width: 60
	},
	{
		label: '系统ID',
		prop: 'system_id',
		align: 'center',
		sortable: 'custom',
		width: 100
	},
	{
		label: '系统名称',
		prop: 'system_name',
		align: 'center'
	},
	{
		label: '系统地址',
		prop: 'prod_url',
		align: 'center',
		'min-width': 200
	},
	{
		label: '描述信息',
		prop: 'description',
		align: 'center'
	},
	{
		label: '是否配置权限',
		prop: 'is_show_auth',
		align: 'center',
		width: 120,
		formatter: (row) => (row.is_show_auth ? '是' : '否')
	},
	{
		label: '创建时间',
		prop: 'create_time',
		align: 'center',
		width: 230,
		sortable: 'custom'
	},
	{
		label: '操作',
		prop: 'handle',
		align: 'center',
		width: 180
	}
]
export const systemInfoColumns = [
	{
		label: '仓库名称',
		prop: 'repository_name',
		align: 'center',
		width: 160
	},
	{
		label: '仓库地址',
		prop: 'repository_url',
		align: 'center',
		showOverflowTooltip: true
	},
	{
		label: '仓库类型',
		prop: 'repository_type',
		align: 'center',
		width: 120
	},
	{
		label: '负责人员',
		prop: 'developer',
		align: 'center',
		width: 120
	},
	{
		label: '主分支',
		prop: 'prod_branch',
		align: 'center',
		width: 100
	},
	{
		label: '测试分支',
		prop: 'test_branch',
		align: 'center',
		width: 100
	},
	{
		label: '部署服务器',
		prop: 'prod_server',
		align: 'center'
	},
	{
		label: '部署路径',
		prop: 'system_path',
		align: 'center',
		sortable: 'custom',
		showOverflowTooltip: true
	},
	{
		label: '描述信息',
		prop: 'description',
		align: 'center',
		showOverflowTooltip: true
	}
]
export const robotColumns = [
	{
		label: '机器人名称',
		prop: 'app_name',
		align: 'left',
		slot: true
	},
	{
		label: 'OPEN_ID',
		prop: 'open_id',
		align: 'center',
		'show-overflow-tooltip': true
	},
	{
		label: 'APP_ID',
		prop: 'app_id',
		align: 'center',
		'show-overflow-tooltip': true
	},
	{
		label: 'APP_SECRET',
		prop: 'app_secret',
		align: 'center',
		'show-overflow-tooltip': true
	},
	// {
	// 	label: "机器人类型",
	// 	prop: "robot_type",
	// 	align: "center"
	// },
	{
		label: '标示符',
		prop: 'robot_flag',
		align: 'center',
		width: 120
	},
	{
		label: '用途说明',
		prop: 'comment_info',
		align: 'center',
		'show-overflow-tooltip': true
	},
	// {
	// 	label: "创建时间",
	// 	prop: "operation_type",
	// 	align: "center",
	// 	sortable: "custom"
	// },
	{
		label: '操作',
		prop: 'handle',
		align: 'center',
		width: 160,
		slot: 'handle'
	}
]
// 接口配置表
export const apiListColumns = [
	{
		label: '接口ID',
		prop: 'path_id',
		align: 'center',
		minWidth: 100,
		'show-overflow-tooltip': true
	},
	{
		label: '接口地址',
		prop: 'url_path',
		align: 'center',
		minWidth: 200,
		'show-overflow-tooltip': true
	},
	{
		label: '接口名称',
		prop: 'path_name',
		align: 'center',
		minWidth: 100,
		'show-overflow-tooltip': true
	},
	{
		label: '接口类型',
		prop: 'path_type',
		align: 'center',
		formatter: (row) => pathTypeDict.find((item) => item.value == row.path_type)?.label,
		width: 100
	},
	{
		label: '系统平台',
		prop: 'system',
		align: 'center',
		width: 160
	},
	{
		label: '接口说明',
		prop: 'comment_info',
		align: 'center',
		width: 200,
		'show-overflow-tooltip': true
	},
	{
		label: '创建时间',
		prop: 'create_time',
		align: 'center',
		width: 170,
		sortable: 'custom'
	},
	{
		label: '更新时间',
		prop: 'update_time',
		align: 'center',
		width: 170,
		sortable: 'custom'
	},
	{
		label: '操作',
		prop: 'handle',
		align: 'center',
		width: 150
	}
]
export const pathTypeDict = [
	{
		label: '普通接口',
		value: 1
	},
	{
		label: '带参数接口',
		value: 2
	}
]
// 卡片模板
export const cardTemplateColumns = [
	{
		label: '卡片模板ID',
		prop: 'template_id',
		align: 'center',
		minWidth: 100,
		'show-overflow-tooltip': true
	},
	{
		label: '卡片名称',
		prop: 'card_name',
		align: 'center',
		minWidth: 200,
		'show-overflow-tooltip': true
	},
	{
		label: '发送机器人',
		prop: 'robot',
		align: 'left',
		minWidth: 130,
		'show-overflow-tooltip': true
	},
	{
		label: '模板代码',
		prop: 'code_info',
		align: 'center',
		width: 100
	},
	{
		label: '创建人',
		prop: 'user_id',
		align: 'center',
		width: 200,
		'show-overflow-tooltip': true
	},
	{
		label: '卡片说明',
		prop: 'comment_info',
		align: 'center',
		width: 200,
		'show-overflow-tooltip': true
	},
	{
		label: '创建时间',
		prop: 'create_time',
		align: 'center',
		width: 170,
		sortable: 'custom'
	},
	{
		label: '更新时间',
		prop: 'update_time',
		align: 'center',
		width: 170,
		sortable: 'custom'
	},
	{
		label: '操作',
		prop: 'handle',
		align: 'center',
		width: 210
	}
]
