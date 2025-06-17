<template>
	<section class="card-center">
		<boke-card>
			<Head ref="headerRef" :projectList="projectList" @search="handleSearch"></Head>
			<section class="center-content">
				<div class="content-left">
					<CardStatus
						:roubotList="roubotList"
						:feishu_user_id="userStore.userInfo?.union_id"
						:robotIgno="robotIgno"
						@updateStatus="updateStatus"
						@setUnread="setUnread"
						@handleSetOk="handleSetOk"
						ref="statusRef"
					></CardStatus>
				</div>
				<div class="content-right">
					<CardList
						:roubotList="roubotList"
						:activeStatus="activeStatus"
						:searchValue="searchValue"
						:robotIgno="robotIgno"
						:updateOverview="updateOverview"
						ref="listRef"
						@searchTitle="searchTitle"
					></CardList>
				</div>
			</section>
		</boke-card>
	</section>
</template>

<script setup>
import { ref } from 'vue'
import { getUserRobotApi, getEmailProjectApi, getNotDisturbApi } from '@/views/card_center/service/card_api.js'
import { useUserStore, useMessageCenter } from '@/stores'
import { useFeishuOpen } from '@/hooks/use_feishu_api'
import { clearQuery } from '@/utils/tools'
// import { searchTrack } from "@/views/card_center/config/track"
import Head from './components/Head.vue'
import CardList from './components/CardList.vue'
import CardStatus from './components/CardStatus.vue'

document.title = '消息通知中心'
const { larkSetAuthorize } = useFeishuOpen()
const route = useRoute()
const userStore = useUserStore()
const messageStore = useMessageCenter()
const { msgType } = storeToRefs(messageStore)
const activeStatus = ref()
const searchValue = ref()
const roubotList = ref([])
const projectList = ref([])
const robotIgno = ref([]) // 忽略的机器人
const getUserRobot = async () => {
	const { items = [] } = await getUserRobotApi({
		feishu_user_id: userStore.userInfo?.union_id,
		op_type: 'user_robot'
	})
	roubotList.value = items
}
const getUserProject = async () => {
	let Api = getUserRobotApi
	if (msgType.value == 2) {
		Api = getEmailProjectApi
	}
	const { items = [] } = await Api({
		feishu_user_id: userStore.userInfo?.union_id,
		op_type: 'user_project'
	})
	console.log(11, items)
	projectList.value = items?.map((item) => {
		return {
			label: item,
			value: item
		}
	})
}
const updateStatus = (value) => {
	activeStatus.value = value
	// searchTrack({
	// 	机器人: getLabel(roubotList.value, value?.open_id),
	// 	状态: getLabel(statusDict, value?.value)
	// })
}
const handleSearch = (value) => {
	searchValue.value = {
		title: value?.searchValue,
		project_name: value?.project_name
		// date: value?.date
	}
	//本次加载完后执行第二次搜索
	if (!listRef.value?.readLoading) {
		listRef.value?.handleSearch(searchValue.value)
	}
	// searchTrack({
	// 	标题: value.searchValue,
	// 	项目: value?.project_name
	// })
}
const timer = ref()
const statusRef = ref()
const listRef = ref()
const headerRef = ref()
const updateOverview = () => {
	statusRef.value?.getUserOverview()
}

const searchTitle = (title) => {
	headerRef.value?.setTitle(title)
}
// 客户端主动设置未读
const setUnread = () => {
	// larkUpdateBadge(value)
}
const handleSetOk = () => {
	statusRef.value?.getUserOverview()
	listRef.value?.handleSearch()
	getRobotStatus()
}
const getRobotStatus = async () => {
	try {
		const { items } = await getNotDisturbApi({
			feishu_user_id: userStore.userInfo?.union_id
		})
		robotIgno.value = items
	} catch (error) {
		console.log(error)
	}
}
watch(
	() => msgType.value,
	() => {
		headerRef.value?.handleReset()
		getUserProject()
		statusRef.value?.getUserOverview()
		// listRef.value?.handleSearch()
		listRef.value?.timeFresh()
	}
)
const initRoute = () => {
	if (route.query?.title) {
		headerRef.value?.searchHistoryName(route.query?.title)
	} else if (route.query?.comment) {
		listRef.value?.timeFresh()
		// 2024-12-24 原来用的是log_id， 后来统一调整为了message_hash
		if (route.query?.message_hash) {
			listRef.value?.handleCommen(route.query?.message_hash, 'message_hash')
		}
	} else {
		listRef.value?.timeFresh()
	}
}
onMounted(() => {
	larkSetAuthorize()
	userStore.getUserInfo().then(() => {
		getUserRobot()
		getUserProject()
		statusRef.value?.getUserOverview()
		getRobotStatus()
		console.log('route', route.query?.title)
		initRoute()
	})
	// 卡片点击历史卡片，跳转通知中心，并根据卡片名称进行搜索
	timer.value = setInterval(() => {
		statusRef.value?.getUserOverview()
	}, 10000)
	// 通过浏览器钩子监听页面加载，防止页面被飞书缓存
	document.addEventListener('visibilitychange', function () {
		if (document.visibilityState === 'hidden') {
			clearQuery()
			// 被隐藏了
		} else if (document.visibilityState === 'visible') {
			// 页面显示了
			initRoute()
		}
	})
})
onUnmounted(() => {
	clearInterval(timer.value)
	document.removeEventListener('visibilitychange')
})
</script>

<style scoped lang="scss">
.card-center {
	margin: 8px;
	height: 100%;
	min-width: 1300px;
	.center-content {
		display: flex;
		.content-left {
			width: 220px;
			// background: var(--boke-color-fff);
			flex-shrink: 0;
			border-right: 1px solid var(--boke-color-border-divider);
		}
		.content-right {
			flex: 1;
			// background: var(--boke-color-fff);
			width: calc(100% - 400px);
			height: calc(100vh - 110px);
		}
	}
	:deep(.el-card__body) {
		padding-right: 0;
		padding-left: 10px;
		padding-top: 10px;
	}
}
</style>
