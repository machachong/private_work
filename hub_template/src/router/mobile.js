import { Setting } from '@element-plus/icons-vue'
import CreateComponentName from '@/router/CreateComponentName'
export default [
	{
		path: '/mobile',
		name: 'mobile',
		redirect: '/mobile/dev_entry',
		meta: {
			icon: Setting,
			title: '需求管理'
		},
		children: [
			{
				path: 'dev_entry',
				name: 'DemandEntry',
				component: () => import('@/views/mobile/DemandEntry.vue'),
				meta: {
					title: '需求录入',
					exceptCache: true
				}
			},
			{
				path: 'demandinfo',
				name: 'DemandInfo',
				component: () => import('@/views/mobile/DemandInfo.vue'),
				meta: {
					title: '需求详情'
				}
			},
			{
				path: 'dw_entry',
				name: 'DwEntry',
				component: () => import('@/views/mobile/dw_demand/DwEntry.vue'),
				meta: {
					title: '数仓需求录入',
					exceptCache: true
				}
			},
			{
				path: 'dw_demand_info',
				name: 'DwDemandInfo',
				component: () => import('@/views/mobile/dw_demand/DwDemandInfo.vue'),
				meta: {
					title: '需求详情'
				}
			},
			{
				path: 'data_entry',
				name: 'DaEntry',
				component: () => import('@/views/mobile/da_demand/DaEntry.vue'),
				meta: {
					title: '数分需求录入',
					exceptCache: true
				}
			},
			{
				path: 'data_demand_info',
				name: 'DaDemandInfo',
				component: () => import('@/views/mobile/da_demand/DaDemandInfo.vue'),
				meta: {
					title: '需求详情'
				}
			},
			{
				path: 'db_entry',
				name: 'DbEntry',
				// component: () => import('@/views/mobile/dw_demand/DwEntry.vue'),
				component: CreateComponentName('DbEntry', import('@/views/mobile/dw_demand/DwEntry.vue')),
				meta: {
					title: '数仓需求录入',
					exceptCache: true
				}
			},
			{
				path: 'db_demand_info',
				name: 'DbDemandInfo',
				// component: () => import('@/views/mobile/dw_demand/DwDemandInfo.vue'),
				component: CreateComponentName('DbDemandInfo', import('@/views/mobile/dw_demand/DwDemandInfo.vue')),
				meta: {
					title: '需求详情'
				}
			}
		]
	}
]
