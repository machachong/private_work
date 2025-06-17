<template>
	<div class="m-t-10 progress" :class="{ mobile: mobile }">
		<div class="progress-scroll">
			<div v-for="(item, index) in developProcess" :key="index" class="p-b-22">
				<div class="color-content flex-around">
					<el-space :size="mobile ? 4 : 10">
						<el-avatar
							v-if="type == 'dev'"
							:size="30"
							:src="getLabel(optionsStore.departmentUserOptions, item.process_user_id, 'header_img_url', 'user_id')"
						/>
						<el-avatar
							v-else
							:size="30"
							:src="getLabel(optionsStore.departmentUserOptions, item.feishu_user_id, 'header_img_url')"
						/>
						<span>{{ getLabel(optionsStore.departmentUserOptions, item.feishu_user_id) }}</span>
						<span>{{ item.create_time }}</span>
						<!-- <el-tag class="m-l-8">{{ getLabel(demandProcessDict, item.workflow_process) }}</el-tag> -->
					</el-space>
					<div>
						<boke-text-button v-if="canEdit(item)" :size="mobile ? 'small' : 'default'" @click="handleEdit(item)"
							>编辑</boke-text-button
						>
						<boke-text-button
							v-if="canEdit(item)"
							:size="mobile ? 'small' : 'default'"
							type="danger"
							@click="handleDelete(item)"
							>删除</boke-text-button
						>
					</div>
				</div>
				<!-- <p class="color-content m-t-10 process-content" v-html="item.process_content"></p> -->
				<BokeWangEditor
					:key="index"
					v-model="item.process_content"
					readOnly
					pasteIgnoreImg
					mode="simple"
					class="process-content m-t-10"
					placeholder="请输入内容"
					:hideTool="true"
				></BokeWangEditor>
			</div>
			<!-- <BokeTimeLine mode="horizontal" :list="developProcess" style="padding: 10px 4px">
				<template #content="{ item }">
				</template>
			</BokeTimeLine> -->
		</div>
		<el-empty v-show="developProcess.length == 0" description="暂无进度"></el-empty>
		<DevelopProgress
			v-show="canAdd"
			ref="developProgressRef"
			:row="activeItem"
			:task_id="task_id"
			:type="type"
			:processDataList="processList"
			@ok="init"
			@close="handleClose"
		></DevelopProgress>
	</div>
</template>

<script setup>
import { getLabel, message, confirm } from '@/utils/tools'
import { useUserStore, useOptionsStore } from '@/stores'
import { getTaskProcessApi, delTaskProcessApi } from '@/components/demand/service/demand_api'
import { useDemand } from '@/views/dw_demand/hook/useDemand'
// import { demandProcessDict } from '@/views/dw_demand/service/config'
const props = defineProps({
	task_id: {
		type: [String, Number],
		default: ''
	},
	demand_id: {
		type: [String, Number],
		default: ''
	},
	type: {
		type: String,
		default: ''
	},
	processList: {
		type: Array,
		default: () => []
	},
	mobile: {
		type: Boolean,
		default: false
	},
	demandInfo: {
		type: Object,
		default: () => {
			return {}
		}
	}
})
const demandHook = useDemand(props.isDb)
const optionsStore = useOptionsStore()
const { getCurrentWorkflow } = demandHook
const userStore = useUserStore()
const developProgressRef = ref()
const activeItem = ref({})
const developProcess = ref([])
const canAdd = computed(() => {
	if (props.task_id && userStore.userInfo?.is_super) {
		return true
	}
	// 开发需求的话直接可以填写
	// if (props.type == 'dev' && props.task_id && props.demandInfo?.accept_executors?.includes(userStore.userInfo?.id)) {
	// 	return true
	// }
	if (props.task_id && props.demandInfo?.accept_executors?.includes(userStore.userInfo?.union_id)) {
		return true
	}
	return false
})
// 设置进度只能自己编辑
const canEdit = (item) => {
	// 超管
	if (userStore.userInfo?.is_super) {
		return true
	}
	// 开发需求根据user_id判断
	if (props.type == 'dev' && item.process_user_id == userStore.userInfo?.id) {
		return true
	}
	// 其他需求根据feishu_user_id判断
	if (userStore.userInfo?.union_id == item.feishu_user_id) {
		return true
	}
	return false
}
const init = async () => {
	activeItem.value = {}
	try {
		const { items = [] } = await getTaskProcessApi(
			{
				demand_id: props.demand_id,
				page: 1,
				size: 9999
			},
			props.type
		)
		developProcess.value = items?.map((item) => {
			const nodeInfo = props.processList.find((node) => node?.id == item?.workflow_detail)
			return {
				...item,
				status: 1,
				workflow_process: nodeInfo?.workflow_process
			}
		})
		console.log(developProcess.value)
	} catch (error) {
		console.log(error)
	}
	getTaskProcessApi
}
const handleClose = () => {
	activeItem.value = {}
}
const handleEdit = (item) => {
	activeItem.value = item
	console.log(item)
	developProgressRef.value?.handleOpen()
}
const handleDelete = async (item) => {
	console.log(item)

	try {
		await confirm('确定删除吗？')
		await delTaskProcessApi({ id: item.id }, props.type)
		message.success('删除成功')
		init()
	} catch (error) {
		console.log(error)
	}
}
onMounted(() => {
	userStore.getUserInfo()
	optionsStore.getDepartmentUser(5)
	init()
})
defineExpose({
	getCurrentWorkflow
})
</script>

<style scoped lang="scss">
.progress {
	box-sizing: border-box;
	.progress-scroll {
		padding-bottom: 0px;
		padding: 0 14px;
		max-height: calc(100vh - 280px);
		overflow-y: auto;
	}
	&.mobile {
		font-size: 13px;
		.progress-scroll {
			padding: 0 6px;
			max-height: 100%;
		}
	}
}
.process-content {
	background-color: var(--boke-table-th-bg);
	border-radius: 4px;
	// max-height: 150px;
	// height: auto;
	// min-height: 50px;
}
:deep(.w-e-scroll) {
	height: auto !important;
	min-height: 50px;
	max-height: 150px;
}
// .process-content {
// 	white-space: pre-wrap;
// 	word-break: break-all;
// 	line-height: 1.5;
// 	background-color: var(--boke-table-th-bg);
// 	padding: 4px;
// 	border-radius: 4px;
// 	max-height: 150px;
// 	overflow-y: auto;
// 	:deep(a) {
// 		color: var(--boke-color-main);
// 	}
// }
</style>
