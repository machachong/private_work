import { Memo } from '@element-plus/icons-vue'
const Layouts = () => import('@/components/layout/index.vue')
export default [
	{
		path: '/log',
		name: 'log',
		component: Layouts,
		redirect: '/log/backendlog',
		meta: {
			icon: Memo,
			title: '开发日志',
			permission: 1203,
			sort: 4
		},
		children: [
			{
				path: 'backendapilog',
				name: 'BackApiLog',
				component: () => import('@/views/log/BackApiLog.vue'),
				meta: {
					title: '后端接口日志',
					permission: 120301
				}
			},
			{
				path: 'backapireport',
				name: 'BackApiReport',
				component: () => import('@/views/log/BackApiReport.vue'),
				meta: {
					title: '接口日志概览',
					permission: 120302
				}
			}
		]
	}
]
