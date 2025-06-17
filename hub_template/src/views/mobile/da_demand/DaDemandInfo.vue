<template>
	<section ref="refScroll" @scroll="handleScroll" style="width: 100%; height: 100vh; overflow-y: auto">
		<el-affix position="top" :offset="0">
			<boke-card noPadding>
				<boke-tabs
					v-model:active="tabActive"
					size="large"
					:tabs="tabsDict"
					noUrlChange
					@tabClick="changeTabs"
				></boke-tabs> </boke-card
		></el-affix>
		<div class="mobile-content">
			<boke-card>
				<DemandInfo
					ref="refDetail"
					:demandRow="demandInfo"
					:taskRow="taskInfo"
					:customUserDict="customUserDict"
					:projectList="projectList"
					isMobile
					title="进度详情"
				></DemandInfo>
				<DemandProgress
					style="margin-top: 60px"
					ref="refStatus"
					:processList="processList"
					:taskRow="taskInfo"
					:customUserDict="customUserDict"
					:currentTodo="currentTodo"
					:demandRow="demandInfo"
					:developProcess="developProcess"
					type="noScroll"
					@ok="reSearch"
					@handleSearch="reSearch"
				></DemandProgress>
				<boke-title h3 style="margin-bottom: 10px">进度填写</boke-title>
				<ProgressEntry
					ref="refProgress"
					mobile
					:task_id="task_id"
					:demand_id="demand_id"
					:processList="processList"
					:demandInfo="demandInfo"
					type="da"
				>
				</ProgressEntry>
			</boke-card>
		</div>
	</section>
</template>

<script setup>
import { onActivated, onMounted } from 'vue'
import { useUserStore } from '@/stores'
import { useDemand } from '@/views/da_demand/hook/useDemand'
import { debounce } from '@/utils/tools'
import DemandProgress from '@/views/da_demand/components/demand_list/DemandProgressMobile.vue'
import DemandInfo from '@/views/da_demand/components/demand_list/DemandInfo.vue'
import ProgressEntry from '@/components/demand/ProgressEntry.vue'
const route = useRoute()
const userStore = useUserStore()
const useDemandHook = useDemand()
const {
	processList,
	taskInfo,
	demandInfo,
	getProjectList,
	getCustomerUser,
	customUserDict,
	projectList,
	currentTodo,
	getCurrentWorkflow,
	getTaskProcess,
	developProcess
} = useDemandHook

const tabsDict = [
	{
		name: 1,
		label: '需求信息'
	},
	{
		name: 2,
		label: '需求进度'
	},
	{
		name: 3,
		label: '进度填写'
	}
]
const tabActive = ref(1)
const refDetail = ref(null)
const refStatus = ref(null)
const refProgress = ref(null)
const refScroll = ref(null)
const demand_id = computed(() => {
	return route.query.demand_id
})
const task_id = computed(() => {
	return route.query.task_id
})
const mode = computed(() => {
	// finish 代表打开完成弹窗
	return route.query.mode
})
const clickStop = ref()
const changeTabs = async (val) => {
	if (val.name === 1) {
		refScroll.value.scrollTop = 0
	} else if (val.name === 2) {
		refScroll.value.scrollTop = refDetail.value?.$el?.offsetHeight
	} else if (val.name === 3) {
		refScroll.value.scrollTop =
			refProgress.value?.$el?.offsetHeight + refStatus.value?.$el?.offsetHeight + refDetail.value?.$el?.offsetHeight
	}
	clickStop.value = refScroll.value.scrollTop
}
const handleScroll = debounce(() => {
	// 限位器，防止点击和滚动冲突
	if (clickStop.value && Math.abs(clickStop.value - refScroll.value.scrollTop) < 100) {
		return
	}
	let scrollH = refDetail.value?.$el?.offsetHeight + refStatus.value?.$el?.offsetHeight + 70 - window.innerHeight
	let scrollH2 =
		refProgress.value?.$el?.offsetHeight +
		refDetail.value?.$el?.offsetHeight +
		refStatus.value?.$el?.offsetHeight +
		70 -
		window.innerHeight
	if (scrollH > refDetail.value?.$el?.offsetTop) {
		scrollH = refDetail.value?.$el?.offsetTop
	}
	console.log(refScroll.value.scrollTop, scrollH, refStatus.value?.$el?.offsetTop)
	if (Math.ceil(refScroll.value.scrollTop) >= scrollH2) {
		tabActive.value = 3
	} else if (Math.ceil(refScroll.value.scrollTop) >= scrollH) {
		tabActive.value = 2
	} else {
		tabActive.value = 1
	}
}, 100)
const reSearch = async () => {
	useDemandHook.getDemandWorkflowList({
		demand_id: demand_id.value
	})
	getTaskProcess(demand_id.value)
	getCurrentWorkflow({
		task_id: task_id.value,
		demand_id: demand_id.value
	})
	await useDemandHook.getDemandInfo(demand_id.value)
	await useDemandHook.getTaskDetail({
		task_id: task_id.value
	})
}
const init = async () => {
	await reSearch()
	await userStore.getUserInfo()
	getProjectList(userStore?.userInfo?.id)
	getCustomerUser()
	console.log(mode.value)
	if (mode.value == 'finish' && demandInfo.value?.demand_process == 5) {
		refStatus.value?.handleFinish()
	} else if (mode.value == 'accept') {
		refStatus.value?.handleOpenReject()
	} else if (mode.value == 'claim') {
		refStatus.value?.handleClaim(demand_id.value)
	} else if (mode.value == 'approve') {
		refStatus.value?.handleOpenReject()
	}
	// getTaskProcess()
}
/**
 * 增加主动调取拒绝弹窗逻辑
 */
// mode 1 代表通过参数打开拒绝弹窗
provide('demandInfo', {
	showReject: 1111
})
onMounted(() => {
	tabActive.value = 1
	if (demand_id.value) {
		init()
	} else {
		return console.log('缺少参数')
	}
})
onActivated(() => {
	console.log('onActivated')
	tabActive.value = 1
	if (demand_id.value) {
		init()
	} else {
		return console.log('缺少参数')
	}
})
</script>
<script>
// 如果pc打开跳转PC页面
export default defineComponent({
	// beforeRouteEnter(to, from, next) {
	// 	if (document.body.clientWidth > 1000) {
	// 		next({
	// 			path: '/da_demand/da_demandlist',
	// 			query: {
	// 				demand_id: to.query?.demand_id,
	// 				tab: '1'
	// 			}
	// 		})
	// 	}
	// 	next()
	// }
})
</script>
<style scoped lang="scss">
.mobile-content {
	margin: 10px;
	height: auto;
	box-sizing: border-box;
	:deep(.el-card__body) {
		padding: 12px;
	}
}
</style>
