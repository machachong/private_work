const Layouts = () => import('@/components/layout/index.vue')
export default [
	{
		path: '/dw_demand',
		name: 'dw_demand',
		component: Layouts,
		redirect: '/dw_demand/dw_demandlist',
		meta: {
			iconfont: 'icon-shujukuyongwanqingdan',
			title: '数仓需求',
			permission: 1204,
			sort: 6
		},
		children: [
			{
				path: 'dw_task_board',
				name: 'DwTaskBoard',
				component: () => import('@/views/dw_demand/DwTaskBoard.vue'),
				meta: {
					title: '需求总览',
					permission: 120404
					// exceptCache: true
				}
			},
			{
				path: 'dw_demandlist',
				name: 'DwDemandList',
				component: () => import('@/views/dw_demand/DwDemandList.vue'),
				meta: {
					title: '需求池列表',
					permission: 120401
				}
			},
			{
				path: 'dw_tasklist',
				name: 'DwTaskList',
				component: () => import('@/views/dw_demand/DwTaskList.vue'),
				meta: {
					title: '任务列表',
					permission: 120402
				}
			}
		]
	}
]
