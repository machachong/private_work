<template>
	<div @click="handleOpenDetail" class="table-link"><slot></slot></div>
	<BokeDialog :title="title" v-model="dialogVisible" width="1400px" top="50px" destroy-on-close @open="handleOpen">
		<el-row>
			<el-col :span="12" class="detail-info">
				<EntryForm
					ref="entryFormRef"
					:isDemand="isDemand"
					:demandRow="demandInfo"
					:taskRow="taskInfo"
					mode="edit"
					@ok="entryOk"
				></EntryForm>
				<TaskOrder
					v-if="getDemandType == 'dw'"
					ref="taskOrderRef"
					:demandRow="demandInfo"
					:taskRow="taskInfo"
					:isDemand="isDemand"
					@reSearch="init"
				></TaskOrder>
			</el-col>
			<el-col :span="12" class="detail-plan">
				<boke-tabs size="small" v-model:active="currentTab" :tabs="tabs" noUrlChange></boke-tabs>
				<div class="p-t-8">
					<DemandProgress
						v-show="currentTab == '需求进度'"
						ref="demandProgressRef"
						:processList="processList"
						:taskRow="taskInfo"
						:demandRow="demandInfo"
						:developProcess="developProcess"
						@ok="init"
						@updateProgress="init"
					></DemandProgress>
					<PayContent
						mode="web"
						v-show="currentTab == '需求交付物'"
						:taskData="demandInfo.task_data"
						:customUserDict="customUserDict"
					></PayContent>
					<ProgressEntry
						v-if="currentTab == '进度填写'"
						:task_id="task_id"
						:demand_id="demand_id"
						:processList="processList"
						:type="getDemandType"
						:demandInfo="demandInfo"
					>
					</ProgressEntry>
				</div>
			</el-col>
		</el-row>
	</BokeDialog>
</template>

<script setup>
import { useOptionsStore } from '@/stores'
import { useDemand } from '@/views/dw_demand/hook/useDemand'
import DemandProgress from './DemandProgress.vue'
// import DemandInfo from "./DemandInfo"
import EntryForm from '../entry_demand/EntryForm.vue'
import TaskOrder from './TaskOrder.vue'
import PayContent from '../task/PayContent.vue'
import ProgressEntry from '@/components/demand/ProgressEntry.vue'
const emits = defineEmits(['ok'])
const props = defineProps({
	readonly: {
		type: Boolean,
		default: false
	},
	demand_id: {
		type: [String, Number],
		default: null
	},
	title: {
		type: String,
		default: ''
	},
	isDemand: {
		type: Boolean,
		default: false
	}, // true不需要获取当前阶段操作人
	task_id: {
		type: [String, Number],
		default: null
	}, // 需求详情传递，如果有则用传递的，如果没有拉去接口的
	// demandRow: {
	// 	type: Object,
	// 	default: () => {
	// 		return undefined
	// 	}
	// },
	// taskRow: {
	// 	type: Object,
	// 	default: () => {
	// 		return undefined
	// 	}
	// },
	isDb: {
		type: Boolean,
		default: false
	}
})

const optionsStore = useOptionsStore()
const demandHook = useDemand(props.isDb)
const { processList, developProcess, taskInfo, customUserDict, demandInfo, getDemandType } = storeToRefs(demandHook)
const taskOrderRef = ref()
const dialogVisible = ref(false)
const demandProgressRef = ref()
const entryFormRef = ref()
const currentTab = ref('需求进度')

const tabs = computed(() => {
	if (demandInfo.value?.demand_process >= 5) {
		return [
			{
				label: '需求进度',
				name: '需求进度'
			},
			{
				label: '需求交付物',
				name: '需求交付物'
			},
			{
				label: '进度填写',
				name: '进度填写'
			}
		]
	}
	if (demandInfo.value?.demand_process >= 0) {
		return [
			{
				label: '需求进度',
				name: '需求进度'
			},
			{
				label: '进度填写',
				name: '进度填写'
			}
		]
	}
	return [
		{
			label: '需求进度',
			name: '需求进度'
		}
	]
})

const init = async () => {
	console.log(props.demand_id)

	await demandHook.getDemandInfo(props.demand_id)
	await demandHook.getDemandWorkflowList({
		demand_id: props.demand_id
	})
	console.log('taskid', props.task_id)

	await demandHook.getTaskDetail({
		task_id: props.task_id
	})
	if (taskInfo.value?.id) {
		taskOrderRef.value?.getDSworkflowList()
	}
	taskOrderRef.value?.getOperationWorkflowList()
	demandHook.getCustomerUser()
	// demandHook.getTaskProcess(props.demand_id)
	if (!props.isDemand) {
		console.log(demandProgressRef)
		nextTick(() => {
			demandProgressRef.value?.getCurrentWorkflow({
				task_id: props.task_id,
				demand_id: props.demand_id
			})
		})
	}
}
const handleOpen = async () => {
	demandHook.reset()
	await init()
	optionsStore.getUserOptions()
	entryFormRef.value?.init()
}
const entryOk = () => {
	dialogVisible.value = false
	emits('ok')
}
const handleOpenDetail = () => {
	dialogVisible.value = true
}
onMounted(() => {
	// 通过浏览器钩子监听页面加载
	document.addEventListener('visibilitychange', function () {
		if (document.visibilityState === 'visible') {
			if (taskInfo.value?.id) {
				taskOrderRef.value?.getOperationWorkflowList()
			}
		}
	})
})
onUnmounted(() => {
	if (document.visibilitychange) {
		document.removeEventListener('visibilitychange')
	}
})
defineExpose({
	handleOpenDetail
})
</script>

<style scoped lang="scss">
.detail-info {
	border-right: 1px solid var(--boke-color-border-divider);
	max-height: calc(100vh - 180px);
	overflow-y: auto;

	:deep(.el-form-item__label) {
		float: none; // 取消label左浮动
		word-break: break-word; // 支持单词截断换行
	}
}

.detail-plan {
	padding-left: 16px;
}
:deep(.el-timeline-item__wrapper) {
	padding-left: 50px;
}
</style>
