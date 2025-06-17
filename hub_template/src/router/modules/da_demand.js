const Layouts = () => import('@/components/layout/index.vue')
export default [
	{
		path: '/da_demand',
		name: 'da_demand',
		component: Layouts,
		redirect: '/da_demand/da_demandlist',
		meta: {
			iconfont: 'icon-shujufenxi',
			title: '数分需求',
			permission: 1205,
			sort: 7
		},
		children: [
			{
				path: 'da_task_board',
				name: 'DaTaskBoard',
				component: () => import('@/views/da_demand/DaTaskBoard.vue'),
				meta: {
					title: '需求总览',
					// exceptCache: true,
					permission: 120504
				}
			},
			{
				path: 'da_demandlist',
				name: 'DaDemandList',
				component: () => import('@/views/da_demand/DaDemandList.vue'),
				meta: {
					title: '需求池列表',
					permission: 120501
				}
			},
			{
				path: 'da_tasklist',
				name: 'DaTaskList',
				component: () => import('@/views/da_demand/DaTaskList.vue'),
				meta: {
					title: '任务列表',
					permission: 120502
				}
			}
			// {
			// 	path: 'da_tb_bind',
			// 	name: 'DaTbBind',
			// 	component: () => import('@/views/da_demand/DaTbBind.vue'),
			// 	meta: {
			// 		title: 'TB项目绑定',
			// 		permission: 120503
			// 	}
			// }
		]
	}
]
