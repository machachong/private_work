/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { createRouter, createWebHistory } from 'vue-router'
import beforeEach from '@/router/before_each'
import afterEach from '@/router/after_each'
import menuRoutes from './menuRoute'
import mobileRoutes from './mobile'
const Layouts = () => import('@/components/layout/index.vue')

//
/**
 * exceptTabs: true, 不显示标签栏
 * exceptMenu: true 不显示菜单栏
 * exceptCreateMenu: true, 不参与菜单生成
 * exceptCache: true, 页面不开启路由缓存
 * exceptLogin: true, 页面免登
 * eventName: '', 页面visite埋点名称
 * permission: '', 页面权限id
 * activeMenu: '', 需要激活的路由菜单
 */

// 公共路由部分
const routes = [
	{
		path: '/',
		component: Layouts,
		redirect: '/',
		children: [...menuRoutes]
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/views/login/index.vue'),
		meta: {
			title: '登录',
			exceptCache: true,
			exceptSidebar: true,
			exceptTabs: true
		}
	},
	{
		path: '/homepage',
		name: 'Homepage',
		component: import('@/views/HomePage.vue'),
		meta: {
			title: '首页',
			exceptCache: true,
			exceptSidebar: true,
			exceptTabs: true
		}
	},
	{
		path: '/cardcenter',
		name: 'CardCenter',
		component: () => import('@/views/card_center/CardCenter.vue'),
		meta: {
			title: '卡片通知中心',
			exceptCache: true,
			permission: 1501
		}
	},
	{
		path: '/larkcard',
		name: 'Larkcard',
		component: () => import('@/views/card_center/components/larkCard/larkcard.vue'),
		meta: {
			title: '飞书卡片预览',
			exceptCreateMenu: true
		}
	},
	{
		path: '/larkemail',
		name: 'LarkEmail',
		component: () => import('@/views/card_center/components/EmailTempalte/LarkEmail.vue'),
		meta: {
			title: '飞书卡片预览',
			exceptCreateMenu: true
		}
	},
	...mobileRoutes,
	{
		path: '/demo',
		name: 'Demo',
		component: () => import('@/views/Demo.vue'),
		meta: {
			exceptSidebar: true,
			exceptLogin: true,
			exceptTabs: true
		}
	},
	{
		path: '/demo_ai',
		name: 'AiDemo',
		component: () => import('@/views/AiDemo.vue'),
		meta: {
			exceptSidebar: true,
			exceptLogin: true,
			exceptTabs: true
		}
	},

	{
		path: '/404',
		name: '404',
		component: () => import('@/views/error/404.vue'),
		meta: {
			title: '404',
			exceptLogin: true,
			exceptTabs: true
		}
	},
	{
		path: '/403',
		name: '403',
		component: () => import('@/views/error/403.vue'),
		meta: {
			title: '403',
			exceptLogin: true,
			exceptTabs: true
		}
	},
	{
		path: '/:catchAll(.*)',
		redirect: '/404'
	}
]
console.log(routes)
const router = createRouter({
	base: '/devplat',
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
})

// 引入加载条，优化页面切换时的加载体验
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

router.beforeEach((to, from, next) => {
	NProgress.start()
	beforeEach(to, from, next)
})

router.afterEach((to, from) => {
	NProgress.done()
	afterEach(to, from)
})

export default router
