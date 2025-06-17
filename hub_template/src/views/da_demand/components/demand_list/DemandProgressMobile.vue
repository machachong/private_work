<template>
	<div class="progress" :class="{ 'no-scroll': type == 'noScroll' }">
		<boke-title h3 style="margin-bottom: 10px">需求进度</boke-title>
		<el-scrollbar height="100%">
			<section class="progress-list">
				<div class="progress-item header">
					<div class="item-cell"> 节点名称 </div>
					<div class="item-cell"> 进度信息 </div>
				</div>
				<div class="progress-item" v-for="(processData, index) in processDataList" :key="index">
					<template v-for="(item, index) in processData" :key="index">
						<div
							class="progress-item"
							:class="{
								'no-first': (index != 0 && processData.length > 1) || item.workflow_process == -4
							}"
						>
							<div class="item-cell" v-if="!(index != 0 && processList.length > 1) || item.workflow_process == -4">
								<span>{{ getLabel(demandProcessDict, item.workflow_process) }}</span>
							</div>
							<div class="item-cell">
								<template v-if="aduitDict.includes(item.workflow_process)">
									{{ getLabel(customUserDict, item.workflow_feishu_user_id) }}
									{{ item?.workflow_process == 8 ? '审批' : '验收' }}
									<boke-text-status mode="text" :status="item.workflow_status == 1 ? 'success' : 'fail'">{{
										item.workflow_status == 1 ? '通过' : '拒绝'
									}}</boke-text-status>
									<p v-if="item.workflow_feedback" class="color-describe f-s-12 p-t-4"
										>备注:{{ item.workflow_feedback }}</p
									>
								</template>
								<div v-else>
									<div v-if="item.workflow_process == 4">
										{{ getLabel(customUserDict, item.workflow_feishu_user_id) }}
										<boke-text-status mode="text" status="success" v-if="item.workflow_status == 1"
											>认领</boke-text-status
										>
										<boke-text-status mode="text" status="fail" v-else> 拒绝 </boke-text-status>
										需求
									</div>
									<div v-else-if="item.workflow_process == -4 && item.workflow_status == 1">
										{{ getLabel(customUserDict, item.operation_feishu_user_id) }}
										<boke-text-status mode="text" status="success">转交给</boke-text-status>
										{{ getLabel(customUserDict, item.workflow_feishu_user_id) }}
									</div>
									<div v-else-if="item.workflow_process == -4 && item.workflow_status == 2">
										{{ getLabel(customUserDict, item.workflow_feishu_user_id) }}
										<boke-text-status mode="text" status="fail"> 退出 </boke-text-status>
										需求
									</div>
									<div v-else-if="item.workflow_process == 0">
										{{ getLabel(customUserDict, item.workflow_feishu_user_id) }} 录入需求
									</div>
									<div v-else-if="item.workflow_process == 12"> 系统自动完成需求验收 </div>
									<div v-else-if="item.workflow_process == 13">
										向<span v-for="(reportUser, index) in item.workflow_feishu_user_id?.split(',')" :key="reportUser">
											<BokeUserProfile
												:userName="getLabel(customUserDict, reportUser)"
												:feishuUserId="reportUser"
											></BokeUserProfile>
											<span v-if="index < item.workflow_feishu_user_id?.split(',')?.length - 1">,</span>
										</span>
										发送分析报告成功
									</div>
									<template v-else>
										{{ getLabel(customUserDict, item.workflow_feishu_user_id) }}
										<boke-text-status mode="text" status="success" v-if="item.workflow_status == 1"
											>完成</boke-text-status
										>
										<boke-text-status mode="text" status="fail" v-else> 拒绝 </boke-text-status>
										{{ item.workflow_process_label }}
									</template>
								</div>
								<p class="color-describe p-t-4" style="font-size: 10px">{{ item.create_time }}</p>
							</div>
						</div>
						<!-- <div class="develop" v-if="getNodeProcess(developProcess, item)?.length > 0">
							<div class="item-cell one">进度信息</div>
							<div class="item-cell two">
								<template v-for="dev in developProcess" :key="dev.id">
									<p class="two-p" v-if="dev.workflow_detail == item.id">
										<span class="two-content" v-html="dev?.process_content"></span>
										<span class="color-describe two-name">{{ getLabel(customUserDict, dev?.feishu_user_id) }}</span>
										<span class="color-describe two-date">{{ dev?.create_time }}</span>
									</p>
								</template>
							</div>
						</div> -->
					</template>
				</div>
			</section>
		</el-scrollbar>
		<el-divider style="margin-bottom: 10px"></el-divider>
		<el-row justify="center" align="middle" style="margin-bottom: 10px">
			<el-affix position="bottom" :offset="20">
				<el-space>
					<EntryDemand
						v-show="getCliamStatus(demandRow, userStore.userInfo)"
						ref="claimRef"
						mode="claim"
						:cliamStatus="getCliamStatus(demandRow, userStore.userInfo)"
						:demandRow="demandRow"
						@reSearch="handleSearch"
						isMobile
					></EntryDemand>
					<TaskFinish
						v-show="!getCliamStatus(demandRow, userStore.userInfo) && taskRow?.task_process == 5"
						ref="taskFinishRef"
						isMobile
						:demandRow="demandRow"
						:taskRow="taskRow"
						:currentTodo="currentTodo"
						@ok="handleSearch"
					></TaskFinish>
					<!-- v-if="isTaskUser && taskRow.task_process == 5 && taskRow.task_status == 1" -->
					<!-- <DevelopProgress
						v-if="isTaskUser && demandRow.demand_process <= 7 && !is_wait"
						:task_id="taskRow?.id"
						:processDataList="processDataList"
						@ok="emits('updateProgress')"
					></DevelopProgress>
					<DemandStatus
						:taskRow="taskRow"
						:demandRow="demandRow"
						:userInfo="userInfo"
						:currentTodo="currentTodo"
						v-model:demand_status="demand_status"
						v-model:is_wait="is_wait"
						@ok="emits('ok')"
						@updateProd="updateProd"
					></DemandStatus> -->
					<!-- <boke-button type="primary" v-if="is_wait" @click="handleReSend">发送飞书通知</boke-button> -->
				</el-space>
			</el-affix>
		</el-row>
	</div>
</template>

<script setup>
import { getLabel } from '@/utils/tools'
import { useUserStore } from '@/stores'
import { demandProcessDict, aduitDict } from '@/views/da_demand/service/config'
import { useDemand } from '@/views/da_demand/hook/useDemand'
import TaskFinish from '@/views/da_demand/components/task/TaskFinish.vue'
import EntryDemand from '@/views/da_demand/components/entry_demand/EntryDemand.vue'
// import DemandStatus from "./DemandStatus.vue"
// import DevelopProgress from "./DevelopProgress.vue"
const emits = defineEmits(['ok', 'handleSearch', 'updateProgress'])
const props = defineProps({
	processList: {
		type: Array,
		default: () => []
	},
	taskRow: {
		type: Object,
		default: () => {
			return {}
		}
	},
	demandRow: {
		type: Object,
		default: () => {
			return {}
		}
	},
	type: {
		type: String,
		default: ''
	},
	customUserDict: {
		type: Array,
		default: () => []
	},
	currentTodo: {
		type: String,
		default: ''
	},
	developProcess: {
		type: Array,
		default: () => []
	}
})
const { getCliamStatus } = useDemand()
const userStore = useUserStore()
// const { userInfo } = storeToRefs(userStore)
const taskFinishRef = ref()
const claimRef = ref()
// const demand_status = ref() // 需求状态
// const is_wait = ref() // 是否等待他人更新
const processDataList = computed(() => {
	const result = props.processList.map((item) => {
		return {
			...item,
			workflow_process_label: getLabel(demandProcessDict, item.workflow_process),
			type: demandProcessDict.find((pro) => pro.value == item.workflow_process)?.type
		}
	})
	console.log(mergeConsecutiveDuplicates(result))
	return mergeConsecutiveDuplicates(result)
})
const handleSearch = (item) => {
	emits('handleSearch', item)
}
const mergeConsecutiveDuplicates = (arr) => {
	const result = []
	let currentItem = null
	let currentGroup = []

	for (let i = 0; i < arr.length; i++) {
		const item = arr[i]

		if (currentItem === null) {
			// 初始化当前项和当前组
			currentItem = item
			currentGroup = [item]
		} else if (item?.workflow_process === currentItem?.workflow_process) {
			// 如果当前项与前一个项相同，则将其添加到当前组中
			currentGroup.push(item)
		} else {
			// 如果当前项与前一个项不同，则将当前组添加到结果数组中，并初始化新的当前项和当前组
			result.push(currentGroup)
			currentItem = item
			currentGroup = [item]
		}
	}

	// 添加最后一个组（如果有的话）到结果数组中
	if (currentGroup.length > 0) {
		result.push(currentGroup)
	}

	return result
}
const handleFinish = () => {
	taskFinishRef.value?.handleOpen()
}
const handleOpenReject = () => {
	taskFinishRef.value?.handleOpenReject()
}
const handleClaim = (id) => {
	claimRef.value?.handleClaimOpen(id)
}
onMounted(() => {
	userStore.getUserInfo()
})
defineExpose({
	handleFinish,
	handleOpenReject,
	handleClaim
})
</script>

<style scoped lang="scss">
.progress {
	max-height: calc(100vh - 300px);
	box-sizing: border-box;
	padding-bottom: 0px;
	&.no-scroll {
		height: auto;
		max-height: none;
		.progress-list {
			height: auto;
			max-height: none;
		}
	}
}
.progress-list {
	max-height: calc(100vh - 350px);
	margin-top: 10px;
	.progress-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		flex-wrap: wrap;
		margin: 10px 0px 10px 0;
		box-sizing: border-box;
		&:first-child {
			border: none;
		}
		&:hover {
			cursor: pointer;
			background: var(--boke-table-current-row-bg-color);
		}
		&.header:hover {
			background: none;
		}
		&.header {
			.item-cell {
				color: var(--boke-color-text-title);
			}
		}
		&.no-first {
			margin-left: calc(35% + 6px);
			width: calc(60% - 6px);
			margin-top: 6px;
			.item-cell:nth-child(1) {
				width: 100%;
				padding-left: 2px;
			}
		}
		.item-cell {
			color: var(--boke-color-text-content);
			position: relative;
			font-size: 12px;
			padding-left: 4px;
			.item-status {
				padding: 6px 4px;
				color: #fff;
				border-radius: 4px;
			}
			&.item-date {
				color: var(--boke-color-text-describe);
				font-size: 10px;
			}
			.item-tag {
				font-size: 11px;
			}
			.color-describe {
				font-size: 10px;
			}
		}
		.item-cell:nth-child(1) {
			width: 35%;
		}
		.item-cell:nth-child(2) {
			flex: 1;
		}
	}
	.develop {
		width: 100%;
		margin: 0 auto;
		background-color: var(--boke-table-th-bg);
		padding: 8px 0;
		padding-left: 8px;
		box-sizing: border-box;
		color: var(--boke-color-text-content);
		.one {
			width: 100%;
			font-size: 12px;
			padding-left: 0;
		}
		.two {
			width: 100%;
			font-size: 12px;
			padding: 4px 0;
			.two-p {
				padding: 5px 0;
				align-items: center;
				display: flex;
				gap: 6px;
				.two-name {
					max-width: 50px;
				}
				.two-date {
					font-size: 10px;
					padding-right: 6px;
				}
			}
			.two-content {
				display: block;
				flex: 1;
				white-space: pre-line;
				line-height: 15px;
				word-break: break-all;
				:deep(a) {
					color: var(--boke-color-main);
				}
			}
		}
	}
	.el-timeline-item {
		min-height: 70px;
	}
	.warn {
		color: var(--boke-color-warning);
	}
	.fail {
		color: var(--boke-color-fail);
	}
	.success {
		color: var(--boke-color-success);
	}
}
</style>
