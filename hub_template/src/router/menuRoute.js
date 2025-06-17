import { House } from '@element-plus/icons-vue'
const files = import.meta.glob('./modules/*.js', { eager: true })
const routerModules = []

Object.keys(files)?.forEach((key) => {
	routerModules.push(...files[key].default)
})

const routes = [
	{
		path: '/',
		name: 'home',
		component: () => import('@/views/home/HomeView.vue'),
		meta: {
			title: '首页',
			sort: 1,
			icon: House
		}
	},
	{
		path: '/milestone',
		name: 'MilestonePlan',
		component: () => import('@/views/milestone/MilestonePlan.vue'),
		meta: {
			title: '里程碑计划',
			sort: 2,
			iconfont: 'icon-lichengbei',
			permission: 1206
		}
	},
	...routerModules
]
// 菜单路由
export default routes
