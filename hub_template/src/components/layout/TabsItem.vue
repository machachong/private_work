<template>
	<el-tabs
		v-if="show"
		v-model="tabsStore.activePage"
		type="card"
		class="demo-tabs"
		closable
		@tab-remove="removeTab"
		@tab-click="goTo"
		id="drag-tab"
	>
		<el-tab-pane
			v-for="item in tabsStore.tabsPage"
			:key="item.path"
			:label="item.title"
			:name="item.path"
		>
			<template #label>
				<el-dropdown
					trigger="click"
					v-if="tabsStore.activePage === item.path && tabsStore.tabsPage?.length > 1"
				>
					<span class="el-dropdown-link">
						<el-icon class="tab-menu--icon" title="打开标签页菜单"><MoreFilled /></el-icon>
					</span>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item :icon="CloseBold" @click="removeAll(item)"
								>关闭其他
							</el-dropdown-item>
							<el-dropdown-item :icon="CircleCloseFilled" @click="removeAll(item, true)"
								>全部关闭
							</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
				<div class="active-tab-border"></div>
				{{ item.title }}
			</template>
		</el-tab-pane>
	</el-tabs>
</template>
<script setup>
import { CloseBold, CircleCloseFilled, MoreFilled } from "@element-plus/icons-vue"
import { useTabsStore, useKeepliveStore } from "@/stores/index"
import { Sortable } from "sortablejs"
import { jumpTo } from "@/utils/tools"
import { useRoute } from "vue-router"
const tabsStore = useTabsStore()
const keepliveStore = useKeepliveStore()

const router = useRouter()
const route = useRoute()
const getBeforeQuestionMark = (str) => {
	const index = str.indexOf("?")
	return index !== -1 ? str.slice(0, index) : str
}
// 监听当前路由变化
watch(
	() => router.currentRoute.value,
	(newValue) => {
		if (newValue.meta.exceptTabs) {
			return
		}
		const tab = {
			title: newValue.meta.title,
			path: newValue.fullPath,
			name: newValue.name
		}
		const findItem = tabsStore.tabsPage.find((item) => {
			const isSame = getBeforeQuestionMark(item.path) == getBeforeQuestionMark(tab.path)
			if (isSame) {
				item.path = tab.path
			}
			return isSame
		})
		if (findItem && findItem.path) {
			tabsStore.activePage = findItem.path
		} else {
			if (tab.title) {
				tabsStore.addTabPage(tab)
			}
		}
	},
	{ immediate: true }
)
// 关闭所有标签/其他标签
const removeAll = (item, closeAll = false) => {
	keepliveStore.clearAlive() // 删除路由缓存
	if (closeAll) {
		tabsStore.tabsPage = []
		router.push({
			path: "/"
		})
	} else {
		tabsStore.tabsPage = tabsStore.tabsPage.filter((tab) => {
			return tab.path == item.path
		})
		router.push({
			path: item.path,
			query: item.query
		})
	}
}
// 关闭标签页
const removeTab = (targetName) => {
	const tabs = tabsStore.tabsPage
	let activeName = tabsStore.activePage
	if (activeName === targetName) {
		tabs.forEach((tab, index) => {
			if (tab.path === targetName) {
				const nextTab = tabs[index + 1] || tabs[index - 1]
				if (nextTab) {
					activeName = nextTab.path
					// 跳转到新的活动页签上
					router.push(activeName)
				}
			}
		})
	}
	const removeItem = tabsStore.tabsPage.find((item) => {
		return item.path == targetName
	})
	if (removeItem && removeItem.name) keepliveStore.removeAlive(removeItem.name) // 删除缓存
	tabsStore.activePage = activeName
	tabsStore.tabsPage = tabs.filter((tab) => tab.path !== targetName)
}

// 可拖动标签页
const dragTab = () => {
	const tab = document.querySelector("#drag-tab .el-tabs__nav") //获取需要拖拽的tabs列表
	Sortable.create(tab, {
		//oldIIndex拖放前的位置， newIndex拖放后的位置 , editableTabs为遍历的tab签
		onEnd({ newIndex, oldIndex }) {
			const currTab = tabsStore.tabsPage.splice(oldIndex, 1)[0] //鼠标拖拽当前的el-tabs-pane
			tabsStore.tabsPage.splice(newIndex, 0, currTab)
		}
	})
}

onMounted(() => {
	dragTab()
})
const show = ref(true)
const goTo = (tab) => {
	jumpTo(tab.props.name).then(() => {
		if (route.meta.title) {
			// 页面跳转成功
			if (route.meta.title != tab.props.label) {
				/*
          在阻止了页面跳转之后是不会进入路由的beforeEach钩子的，也就是session中的urlValue不会改变，
          但是tab内部的激活值会改变，因此此处检测到跳转之后网页并未发生改变，直接刷新tab
        */
				show.value = false
				nextTick(() => {
					show.value = true
					// v-model会自动改掉这个active值，当链接没有跳转时，重新设置这个页签
					tabsStore.activePage = route.fullPath
				})
			}
		}
	})
	// router.push({
	// 	path: tab.props.name
	// })
}
</script>
<style lang="scss" scoped>
:deep(.el-tabs__header) {
	border-bottom: none !important;
	box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.08);
	margin-right: 2px;
}
.tab-menu--icon {
	transform: rotate(90deg);
	color: var(--boke-color-text-describe);
	height: 100%;
}
.close-all {
	cursor: pointer;
	display: flex;
	align-items: center;
	width: 80px;
	gap: 10px;
	padding: 4px 0;
	&:hover {
		background: var(--boke-bg-nav-second-active);
	}
}
:deep(.el-tabs__nav) {
	border: none !important;
	display: flex;
	align-items: center;
	.el-tabs__item {
		border: none !important;
		position: relative;
		display: flex;
		align-items: center;
		.active-tab-border {
			width: calc(100% - 6px);
			height: 3px;
			position: absolute;
			top: 3px;
			left: 3px;
		}
		&.is-active {
			background: var(--boke-bg-color);
			border: none;
			// border-top: 3px solid var(--boke-color-main) !important;
			color: var(--boke-color-text-title);
			font-size: 14px;
			font-style: normal;
			font-weight: 600;
			line-height: 20px;
			letter-spacing: 0.25px;
			box-shadow: none;
			width: 100%;
			height: 47px;
			overflow: hidden;
			padding: 0 6px;
			// background: url('../../assets/img/menu/menu-shadow.png') 100% no-repeat;
			background-size: 100% 42px;
			background-position: 0px 0px;
			.active-tab-border {
				background: var(--boke-color-main);
			}
			&::after {
				content: "";
				position: absolute;
				left: -37px;
				top: 0px;
				width: 40px;
				height: 43px;
				border-radius: 0 0 4px 0px;
				box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.08);
				background-color: var(--boke-card-bg);
			}
			&::before {
				content: "";
				position: absolute;
				right: -37px;
				top: 0px;
				width: 40px;
				height: 43px;
				border-radius: 0 0 4px 4px;
				box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.08);
				background-color: var(--boke-card-bg);
			}
		}
		&::after {
			content: "";
			position: absolute;
			left: 0;
			top: 5px;
			height: 30px;
			width: 1px;
			border-right: 1px solid var(--boke-color-border-divider);
		}
		&:first-child {
			&::after {
				border: none;
			}
		}
		&.is-active + div {
			&::after {
				border: none;
			}
		}
	}
}
.el-tabs--card {
	.el-tabs__header {
		border-bottom: none;
		.el-tabs__item {
			border-bottom: none;
		}
		.el-tabs__nav {
			border: none;
		}
	}
}
</style>
