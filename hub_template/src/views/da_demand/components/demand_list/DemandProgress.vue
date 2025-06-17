<template>
	<div class="progress" :class="{ 'no-scroll': type == 'noScroll' }">
		<el-scrollbar height="100%">
			<template v-if="demandRow?.demand_source == 3">
				<LableOrderLog :wordkflow_id="demandRow?.tb_task_url"></LableOrderLog>
			</template>
			<section class="progress-list" v-else>
				<div class="progress-item header">
					<div class="item-cell"> 需求状态 </div>
					<div class="item-cell"> 进度信息 </div>
					<div class="item-cell"> 操作时间 </div>
				</div>
				<el-timeline class="time-line-content">
					<el-timeline-item
						v-for="(processData, processIndex) in processDataList"
						:color="processIndex == processDataList?.length - 1 ? '#eee' : '#2970ff'"
						:key="processIndex"
						hollow
					>
						<template v-for="(item, index) in processData" :key="index">
							<div
								class="progress-item"
								:class="{
									'no-first': (index != 0 && processData.length > 1) || item.workflow_process == -4
								}"
							>
								<div class="item-cell" v-if="!((index != 0 && processData.length > 1) || item.workflow_process == -4)">
									<el-tag
										:type="getLabel(demandProcessDict, item.workflow_process, 'type') || 'info'"
										:color="item.workflow_process == 0 ? '#fff' : ''"
										>{{ getLabel(demandProcessDict, item.workflow_process) }}</el-tag
									>
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
										<p class="color-describe f-s-12 p-t-4" v-if="item?.operation_feishu_user_id">
											已抄送至&nbsp;<span
												v-for="(reportUser, index) in item?.operation_feishu_user_id?.split(',')"
												:key="reportUser"
											>
												<BokeUserProfile
													:userName="getLabel(customUserDict, reportUser)"
													:feishuUserId="reportUser"
												></BokeUserProfile>
												<span v-if="index < item.operation_feishu_user_id?.split(',')?.length - 1">,</span>
											</span></p
										>
									</div>
								</div>
								<div class="item-cell"> {{ item.create_time }}</div>
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
					</el-timeline-item>
				</el-timeline>
			</section>
		</el-scrollbar>
		<el-divider style="margin-bottom: 10px"></el-divider>
		<el-row justify="center" align="middle" style="margin-bottom: 10px">
			<el-affix position="bottom" :offset="30">
				<el-space>
					<!-- <DevelopProgress
						v-if="isTaskUser && [4, 5].includes(demandRow.demand_process)"
						:task_id="taskRow?.id"
						:processDataList="processDataList"
						@ok="emits('updateProgress')"
					></DevelopProgress> -->
					<span>{{ currentTodo }}</span>
					<!-- <boke-button type="primary" v-if="is_wait" @click="handleReSend">发送飞书通知</boke-button> -->
				</el-space>
			</el-affix>
		</el-row>
	</div>
</template>

<script setup>
// import { storeToRefs } from 'pinia'
import { getLabel } from '@/utils/tools'
import { useUserStore } from '@/stores'
import { demandProcessDict, aduitDict } from '@/views/da_demand/service/config'
import { useDemand } from '@/views/da_demand/hook/useDemand'
// import DevelopProgress from './DevelopProgress.vue'
import LableOrderLog from '@/components/demand/LableOrderLog.vue'
// const emits = defineEmits(['ok', 'updateProgress'])
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
	developProcess: {
		type: Array,
		default: () => []
	}
})
const { getCustomerUser, customUserDict, currentTodo, getCurrentWorkflow } = useDemand()
const userStore = useUserStore()
// const { userInfo } = storeToRefs(userStore)
const processDataList = computed(() => {
	const result = props.processList.map((item) => {
		return {
			...item,
			workflow_process_label: getLabel(demandProcessDict, item.workflow_process),
			type: demandProcessDict.find((pro) => pro.value == item.workflow_process)?.type
		}
	})
	return mergeConsecutiveDuplicates(result)
})
// const isTaskUser = computed(() => {
// 	return props.taskRow?.feishu_user_id == userInfo.value?.union_id
// })
// const updateProd = (item) => {
// 	emits("updateProd", item)
// }
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
// 重新发送提醒
// const handleReSend = () => {

// }
onMounted(() => {
	userStore.getUserInfo()
	getCustomerUser()
})
defineExpose({
	getCurrentWorkflow
})
</script>

<style scoped lang="scss">
.progress {
	max-height: calc(100vh - 250px);
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
	max-height: calc(100vh - 300px);
	margin-top: 10px;
	.progress-item {
		display: flex;
		align-items: center;
		width: 100%;
		overflow: hidden;
		padding: 4px 0;
		flex-wrap: wrap;
		// border-top: 1px solid var(--boke-color-border-divider);
		&:first-child {
			border: none;
		}
		&:hover {
			cursor: pointer;
			// background: var(--boke-table-current-row-bg-color);
		}
		&.header:hover {
			background: none;
		}
		&.header {
			padding-left: 60px;
			box-sizing: border-box;
			.item-cell {
				color: var(--boke-color-text-title) !important;
			}
		}
		.item-cell {
			padding-right: 8px;
			box-sizing: content-box;
			color: var(--boke-color-text-content);
			.item-status {
				padding: 6px 4px;
				color: #fff;
				border-radius: 4px;
				font-size: 13px;
			}
			&.item-date {
				color: var(--boke-color-text-describe);
				font-size: 10px;
			}
		}
		.item-cell:nth-child(1) {
			width: 25%;
			min-width: 70px;
		}
		.item-cell:nth-child(2) {
			flex: 1;
			min-width: 60px;
		}
		.item-cell:nth-child(3) {
			width: 160px;
			color: var(--boke-color-text-describe);
		}
		&.no-first {
			margin-left: calc(25% + 8px);
			width: calc(75% - 8px);
			.item-cell:nth-child(1) {
				flex: 1;
				min-width: 60px;
			}
			.item-cell:nth-child(2) {
				width: 160px;
				flex: none;
				min-width: 80px;
				color: var(--boke-color-text-describe);
			}
		}
	}
	.develop {
		width: 95%;
		background-color: var(--boke-table-th-bg);
		padding: 8px 0;
		padding-left: 8px;
		box-sizing: border-box;
		color: var(--boke-color-text-content);
		margin-top: 10px;
		.one {
			width: 100%;
		}
		.two {
			width: 100%;
			font-size: 12px;
			padding: 4px 0;
			.two-p {
				padding: 5px 0;
				align-items: center;
				display: flex;
				gap: 12px;
				.two-name {
					width: 80px;
				}
			}
			.two-content {
				display: block;
				width: 330px;
				line-height: 15px;
				white-space: pre-line;
				:deep(a) {
					color: var(--boke-color-main);
				}
			}
		}
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
	.time-line-content {
		padding-left: 10px;
		padding-top: 20px;
	}
	.el-timeline-item {
		padding-bottom: 14px;
	}
}
:deep(.el-timeline-item__node--normal) {
	top: 5px;
}
:deep(.el-timeline-item__tail) {
	top: 5px;
}
</style>
