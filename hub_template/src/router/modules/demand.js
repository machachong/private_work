const Layouts = () => import('@/components/layout/index.vue')
export default [
	{
		path: '/demand',
		name: 'Demand',
		component: Layouts,
		redirect: '/demand/demandlist',
		meta: {
			iconfont: 'icon-jisuanjikaifa',
			title: '开发需求',
			permission: 1202,
			sort: 5
		},
		children: [
			{
				path: 'taskboard',
				name: 'TaskBoard',
				component: () => import('@/views/demand/TaskBoard.vue'),
				meta: {
					title: '需求看板',
					permission: 120203
					// exceptCache: true
				}
			},
			{
				path: 'demandlist',
				name: 'DemandList',
				component: () => import('@/views/demand/DemandList.vue'),
				meta: {
					title: '需求池列表',
					permission: 120201
					// exceptCache: true
				}
			},
			{
				path: 'adddemand',
				name: 'EntryDemand',
				component: () => import('@/views/demand/EntryDemand.vue'),
				meta: {
					title: '新增需求',
					exceptCreateMenu: true,
					permission: 12020102,
					activeMenu: '/demand/demandlist'
				}
			},
			{
				path: 'tasklist',
				name: 'TaskList',
				component: () => import('@/views/demand/TaskList.vue'),
				meta: {
					title: '任务列表',
					permission: 120202
					// exceptCache: true
				}
			}
		]
	}
]
