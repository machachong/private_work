<template>
	<div class="common-layout" :class="{ isCollapse: isCollapse }">
		<template v-if="currentRoute">
			<el-container class="no-side">
				<el-aside>
					<MainMenu ref="asideRef" class="main-menu"></MainMenu>
				</el-aside>
				<el-main>
					<router-view v-slot="{ Component }">
						<keep-alive :include="keepLiveRoute">
							<component :is="Component" />
						</keep-alive>
					</router-view>
				</el-main>
			</el-container>
		</template>
		<template v-else>
			<el-container style="height: 100%">
				<el-header>
					<header-view></header-view>
				</el-header>
				<el-container>
					<el-aside>
						<MenuItem ref="asideRef"></MenuItem>
					</el-aside>
					<div style="position: fixed; height: 8px; top: 40px; left: 268px; right: 0"></div>
					<el-main>
						<router-view v-slot="{ Component, route }">
							<!-- <transition name="fade"> -->
							<!-- 在 3.2.34 或以上的版本中，使用 <script setup> 的单文件组件会自动根据文件名生成对应的 name 选项, 此处路由是根据name来匹配的,所以name要一致 -->
							<keep-alive :include="keepLiveRoute">
								<component :is="formatComponentInstance(Component, route)" />
							</keep-alive>
							<!-- </transition> -->
						</router-view>
					</el-main>
				</el-container>
			</el-container>
		</template>
	</div>
</template>

<script setup>
import { useKeepliveStore } from '@/stores'
// import CreateComponentName from '@/router/CreateComponentName'
import MenuItem from '@/components/layout/MenuItem.vue'
import HeaderView from '@/components/layout/HeaderView.vue'
import MainMenu from './MainMenu.vue'

const keepliveStore = useKeepliveStore()
const keepLiveRoute = computed(() => {
	return keepliveStore.keepLiveRoute
})
const router = useRoute()
const asideRef = ref()
const currentRoute = computed(() => router.meta.exceptTabs && router.meta.exceptMenu)
const isCollapse = computed(() => {
	return asideRef.value?.isCollapse
})
const wrapperMap = new Map()
// 实现动态路由name避免同一组件定义多个路由时name重复问题
const formatComponentInstance = (component, route) => {
	let wrapper
	if (component) {
		const wrapperName = route.name
		if (wrapperMap.has(wrapperName)) {
			wrapper = wrapperMap.get(wrapperName)
		} else {
			wrapper = {
				name: wrapperName,
				render() {
					return h(component)
				}
			}
			wrapperMap.set(wrapperName, wrapper)
		}
		return h(wrapper)
	}
}
</script>
<style lang="scss" scoped>
.common-layout {
	display: flex;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	// overflow: hidden;
	background-color: var(--boke-bg-color);
	.el-header {
		background-color: var(--boke-card-bg);
		text-align: center;
		line-height: 40px;
		height: 40px;
		/* border-bottom: 1px solid #f1f1f1; */
		// box-shadow: 0 1px 5px rgb(0 0 0 / 8%);
		z-index: 1000;
		width: 100%;
		/* height: 100%; */
		position: fixed;
		top: 0;
		display: inline-block;
		padding: 0;
		z-index: 1;
		padding-left: 268px;
	}
	.el-main {
		overflow-y: auto;
		overflow-x: auto;
		min-height: calc(100vh - 72px);
		position: fixed;
		top: 48px;
		left: 268px;
		right: 0;
		bottom: 0;
		padding: 8px 16px 16px 16px;
		min-width: 1000px;
		transition: left 0.3s;
	}
	.el-aside {
		z-index: 2;
		width: 268px;
		transition: width 0.3s;
	}
	.no-side {
		.el-aside {
			width: 78px;
		}
		.main-menu {
			width: 78px;
			height: 100%;
		}
		.el-main {
			left: 78px;
			top: 0;
		}
	}
}
.isCollapse {
	.el-main {
		left: 138px;
	}
	.el-aside {
		z-index: 2;
		width: 138px;
	}
	.el-header {
		padding-left: 138px;
	}
}
</style>
