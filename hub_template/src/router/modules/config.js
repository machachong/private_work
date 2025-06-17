import { Setting } from '@element-plus/icons-vue'
const Layouts = () => import('@/components/layout/index.vue')
export default [
	{
		path: '/config',
		name: 'Config',
		component: Layouts,
		redirect: '/config/systemlist',
		meta: {
			icon: Setting,
			title: '配置管理',
			permission: 1201,
			sort: 3
		},
		children: [
			{
				path: 'systemlist',
				name: 'SystemList',
				component: () => import('@/views/config/SystemList.vue'),
				meta: {
					title: '系统列表',
					permission: 120101
				}
			},
			{
				path: 'feishurobot',
				name: 'FeishuRobot',
				component: () => import('@/views/config/FeishuRobot.vue'),
				meta: {
					title: '飞书机器人',
					permission: 120102
				}
			},
			{
				path: 'systemapilist',
				name: 'SystemApiList',
				component: () => import('@/views/config/SystemApiList.vue'),
				meta: {
					title: '接口配置',
					permission: 120103
				}
			},
			{
				path: 'cardtemplate',
				name: 'CardTemplate',
				component: () => import('@/views/config/CardTemplate.vue'),
				meta: {
					title: '飞书卡片模板',
					permission: 120104
				}
			},
			{
				path: 'dw_tb_bind',
				name: 'DwTbBind',
				component: () => import('@/views/dw_demand/DwTbBind.vue'),
				meta: {
					title: 'TB项目绑定',
					permission: 120403
				}
			},
			{
				path: 'imgtourl',
				name: 'ImgToUrl',
				component: () => import('@/views/tools/ImgToUrl.vue'),
				meta: {
					title: '图片转URL',
					exceptCreateMenu: true
				}
			}
		]
	}
]
