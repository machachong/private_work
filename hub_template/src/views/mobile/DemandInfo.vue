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
				<Detail
					ref="refDetail"
					:demandRow="demandInfo"
					:taskRow="taskInfo"
					title="进度详情"
					:optionsStore="optionsStore"
				></Detail>
				<Status
					style="margin-top: 60px"
					ref="refStatus"
					:processList="processList"
					:taskRow="taskInfo"
					:developProcess="developProcess"
					:demandRow="demandInfo"
					@updateProgress="getTaskProcess"
					@ok="init"
					@updateProd="updateProd"
				></Status>
				<boke-title h3 style="margin-bottom: 10px">进度填写</boke-title>
				<ProgressEntry
					ref="refProgress"
					mobile
					:task_id="task_id"
					:demand_id="demand_id"
					:processList="processList"
					:demandInfo="demandInfo"
					type="dev"
				>
				</ProgressEntry>
			</boke-card>
		</div>
	</section>
</template>

<script setup>
import { useDemandList } from '@/views/demand/hook/useDemandList'
import { useOptionsStore } from '@/stores'
import { debounce, message } from '@/utils/tools'
import { getTaskProcessApi } from '@/views/demand/service/demand_api'
import Detail from './components/demand_info/Detail.vue'
import Status from './components/demand_info/Status.vue'
import ProgressEntry from '@/components/demand/ProgressEntry.vue'
const route = useRoute()
const optionsStore = useOptionsStore()
const useDemand = useDemandList()
const { processList, taskInfo, demandInfo } = useDemand
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
const developProcess = ref()
const clickStop = ref()
const demand_id = computed(() => {
	return route.query.demandid
})
const task_id = computed(() => {
	return route.query.taskid
})
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
const getTaskProcess = async () => {
	try {
		const { items = [] } = await getTaskProcessApi({
			demand_id: demand_id.value,
			page: 1,
			size: 9999
		})
		developProcess.value = items
	} catch (error) {
		console.log(error)
	}
}
const init = () => {
	useDemand.getDemandDetail(demand_id.value)
	useDemand.getPoolList(demand_id.value)
	useDemand.getTaskDetail(task_id.value)
	getTaskProcess()
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
const updateProd = (item) => {
	console.log(item)
	if (item.task_process == 6) {
		message.warning('请前往卡片或开发后台进行更新')
	}
}
// 如果pc打开跳转PC页面
onMounted(() => {
	tabActive.value = 1
	if (demand_id.value) {
		init()
	} else {
		return console.log('缺少参数')
	}
	optionsStore.getSystemOptions()
	optionsStore.getUserOptions()
})
</script>
<script>
export default defineComponent({
	// beforeRouteEnter(to, from, next) {
	// 	if (to.query?.demand_id && document.body.clientWidth > 1000) {
	// 		next({
	// 			path: '/demand/tasklist',
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
	:deep(.el-select__wrapper.is-disabled) {
		color: var(--boke-color-text-content);
		background: none;
		border: none;
		box-shadow: none;
		opacity: 1;
		.el-select__selected-item {
			color: var(--boke-color-text-content);
		}
	}
}
</style>
