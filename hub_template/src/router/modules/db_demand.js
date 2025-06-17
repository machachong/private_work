// import CreateComponentName from '@/router/CreateComponentName'
const Layouts = () => import('@/components/layout/index.vue')
export default [
	{
		path: '/db_demand',
		name: 'db_demand',
		component: Layouts,
		redirect: '/db_demand/db_demandlist',
		meta: {
			iconfont: 'icon-yunwei',
			title: 'DBA需求',
			permission: 1207,
			sort: 8
		},
		// children: [
		// 	{
		// 		path: 'db_task_board',
		// 		name: 'DbTaskBoard',
		// 		// component: () => import('@/views/dw_demand/DwTaskBoard.vue'),
		// 		component: CreateComponentName('DbTaskBoard', import('@/views/dw_demand/DwTaskBoard.vue')),
		// 		meta: {
		// 			title: '需求总览',
		// 			permission: 120703,
		// 			exceptCache: true
		// 		}
		// 	},
		// 	{
		// 		path: 'db_demandlist',
		// 		name: 'DbDemandList',
		// 		// component: () => import('@/views/dw_demand/DwDemandList.vue'),
		// 		component: CreateComponentName('DbDemandList', import('@/views/dw_demand/DwDemandList.vue')),
		// 		meta: {
		// 			title: '需求池列表',
		// 			permission: 120701
		// 		}
		// 	},
		// 	{
		// 		path: 'db_tasklist',
		// 		name: 'DbTaskList',
		// 		// component: () => import('@/views/dw_demand/DwTaskList.vue'),
		// 		component: CreateComponentName('DbTaskList', import('@/views/dw_demand/DwTaskList.vue')),
		// 		meta: {
		// 			title: '任务列表',
		// 			permission: 120702
		// 		}
		// 	}
		// ]
		children: [
			{
				path: 'db_task_board',
				name: 'DbTaskBoard',
				component: () => import('@/views/dw_demand/DwTaskBoard.vue'),
				meta: {
					name: 'DbTaskBoard',
					title: '需求总览',
					permission: 120703
					// exceptCache: true
				}
			},
			{
				path: 'db_demandlist',
				name: 'DbDemandList',
				component: () => import('@/views/dw_demand/DwDemandList.vue'),
				meta: {
					name: 'DbDemandList',
					title: '需求池列表',
					permission: 120701
				}
			},
			{
				path: 'db_tasklist',
				name: 'DbTaskList',
				component: () => import('@/views/dw_demand/DwTaskList.vue'),
				meta: {
					name: 'DbTaskList',
					title: '任务列表',
					permission: 120702
				}
			}
		]
	}
]
