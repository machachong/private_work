<template>
	<div>
		<div @click="dialogVisible = true" class="table-link"><slot></slot></div>
		<BokeDialog
			:title="title"
			v-model:value="dialogVisible"
			width="1400px"
			top="50px"
			:destroy-on-close="true"
			@open="handleOpen"
		>
			<el-row>
				<el-col :span="12" class="detail-info">
					<!-- 2024-5-13 需求详情只读状态使用info组件展示 -->
					<DemandInfo
						v-if="readonly"
						:demandRow="demandInfo"
						:taskRow="taskInfo"
						:title="title"
						:optionsStore="optionsStore"
					></DemandInfo>
					<EntryForm v-else :demandRow="demandInfo" :taskRow="taskInfo" isEdit @ok="entryOk"></EntryForm>
				</el-col>
				<el-col :span="12" class="detail-plan">
					<boke-tabs size="small" v-model:active="currentTab" :tabs="tabs" noUrlChange></boke-tabs>
					<DemandProgress
						v-show="currentTab == '需求进度'"
						ref="demandProgressRef"
						:processList="processList"
						:taskRow="taskInfo"
						:demandRow="demandInfo"
						:developProcess="developProcess"
						@ok="init"
						@updateProgress="getTaskProcess"
						@updateProd="updateProd"
					></DemandProgress>
					<ProgressEntry
						v-if="currentTab == '进度填写'"
						:task_id="task_id"
						:demand_id="demand_id"
						:processList="processList"
						type="dev"
						:demandInfo="demandInfo"
					>
					</ProgressEntry>
				</el-col>
			</el-row>
		</BokeDialog>
	</div>
</template>

<script setup>
import { useOptionsStore } from '@/stores'
import { useDemandList } from '@/views/demand/hook/useDemandList'
import { getTaskProcessApi } from '@/views/demand/service/demand_api'
import DemandProgress from './DemandProgress.vue'
import DemandInfo from './DemandInfo.vue'
import EntryForm from '../entry_demand/EntryForm.vue'

const optionsStore = useOptionsStore()
const useDemand = useDemandList()
const { processList, taskInfo, demandInfo } = storeToRefs(useDemand)
const emits = defineEmits(['ok', 'updateProd'])
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
	} // 需求详情传递，如果有则用传递的，如果没有拉去接口的
})
const dialogVisible = ref(false)
const developProcess = ref([])
const demandProgressRef = ref()
const currentTab = ref('需求进度')
const tabs = computed(() => {
	console.log(demandInfo)
	if (demandInfo.value?.demand_process > 0) {
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
const updateProd = (item) => {
	emits('updateProd', item)
}
const getTaskProcess = async () => {
	try {
		const { items = [] } = await getTaskProcessApi({
			demand_id: props.demand_id,
			page: 1,
			size: 9999
		})
		developProcess.value = items
	} catch (error) {
		console.log(error)
	}
}
const init = () => {
	useDemand.getDemandDetail(props.demand_id)
	useDemand.getPoolList(props.demand_id)
	useDemand.getTaskDetail(props.task_id)
	getTaskProcess()
	if (!props.isDemand) {
		demandProgressRef.value.getCurrentWorkflow({
			task_id: props.task_id,
			demand_id: props.demand_id
		})
	}
}
const handleOpen = async () => {
	init()

	optionsStore.getSystemOptions()
	optionsStore.getUserOptions()
}
const entryOk = () => {
	dialogVisible.value = false
	emits('ok')
}
</script>

<style scoped lang="scss">
.detail-info {
	border-right: 1px solid var(--boke-color-border-divider);
	max-height: calc(100vh - 250px);
	overflow-y: auto;

	:deep(.el-form-item__label) {
		float: none; // 取消label左浮动
		word-break: break-word; // 支持单词截断换行
	}
}

.detail-plan {
	padding-left: 16px;
}
</style>
