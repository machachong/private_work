<template>
	<div class="progress" :class="{ 'no-scroll': type == 'noScroll' }">
		<!-- <boke-title h3 style="margin-bottom: 10px">需求进度</boke-title> -->
		<el-scrollbar height="100%">
			<section class="progress-list">
				<div class="progress-item header">
					<div class="item-cell"> 节点名称 </div>
					<div class="item-cell"> </div>
					<div class="item-cell"> 进度信息 </div>
					<div class="item-cell"> 操作时间 </div>
					<!-- <div class="item-cell"> 操作时间 </div> -->
				</div>
				<template v-for="(processData, processIndex) in processDataList" :key="processIndex">
					<div v-for="(item, index) in processData" :key="index">
						<div class="progress-item" :class="{ 'no-first': index != 0 && processData.length > 1 }">
							<div class="item-cell" v-if="!(index != 0 && processData.length > 1)">
								{{ item.workflow_process_label }}
							</div>
							<div class="item-cell">
								<el-tag v-if="item.task_type">
									{{ getLabel(developerType, item.task_type) }}
								</el-tag>
							</div>
							<div class="item-cell">
								<template v-if="aduitList.includes(item.workflow_process)">
									{{ getLabel(userOptionsNopart, item.workflow_user_id) }} 验收
									<boke-text-status mode="text" :status="item.workflow_status == 1 ? 'success' : 'fail'">{{
										item.workflow_status == 1 ? '通过' : '拒绝'
									}}</boke-text-status>
									<p v-if="item.workflow_feedback" class="color-describe f-s-12 p-t-4 workflow-feedback">
										<span class="workflow-feedback-label"
											>{{
												item.workflow_status == 1 && item?.workflow_process_label == '正式验收' ? '验收报告' : '备注'
											}}:</span
										>
										<span class="workflow-feedback-content" v-html="item.workflow_feedback"></span>
									</p>
								</template>
								<div v-else>
									<div v-if="item.workflow_process == 4">
										{{ getLabel(userOptionsNopart, item.workflow_user_id) }}
										<boke-text-status mode="text" status="success" v-if="item.workflow_status == 1"
											>认领</boke-text-status
										>
										<boke-text-status mode="text" status="fail" v-else> 拒绝 </boke-text-status>
										需求
									</div>
									<div v-else-if="item.workflow_process == -4 && item.workflow_status == 1">
										{{ getLabel(userOptionsNopart, item.operation_user_id) }}
										<boke-text-status mode="text" status="success">转交给</boke-text-status>
										{{ getLabel(userOptionsNopart, item.workflow_user_id) }}
									</div>
									<div v-else-if="item.workflow_process == -4 && item.workflow_status == 2">
										{{ getLabel(userOptionsNopart, item.workflow_user_id) }}
										<boke-text-status mode="text" status="fail"> 退出 </boke-text-status>
										需求
									</div>
									<template v-else>
										{{ getLabel(userOptionsNopart, item.workflow_user_id) }}
										<boke-text-status mode="text" status="success" v-if="item.workflow_status == 1"
											>完成</boke-text-status
										>
										<boke-text-status mode="text" status="fail" v-else> 拒绝 </boke-text-status>
										{{ item.workflow_process_label }}
									</template>
								</div>
							</div>
							<div class="item-cell">
								<div class="item-date"> {{ item.create_time }} </div>
							</div>
						</div>
						<!-- // 旧的开发进度保留，兼容旧数据 -->
						<!-- 开发进度展示： 一条记录的时候展示在末尾，多条记录的时候展示在最后后面 -->
						<!-- <template v-if="getNodeProcess(item)?.length == 0">
							<section
								class="develop"
								v-if="
									item?.workflow_process == 4 &&
									developProcess.length != 0 &&
									((index != 0 && processData.length > 1 && index == processData.length - 1) ||
										processData.length == 1)
								"
							>
								<div class="item-cell one">进度信息1</div>
								<div class="item-cell two">
									<template v-for="dev in developProcess" :key="dev.id">
										<p class="two-p">
											<span class="two-content">{{ dev?.process_content }}</span>
											<span class="color-describe two-name">{{ dev?.process_user_name }}</span>
											<span class="color-describe two-date">{{ dev?.create_time }}</span>
										</p>
									</template>
								</div>
							</section>
						</template> -->
						<!-- <template > -->
						<!-- <div class="develop" v-if="getNodeProcess(item)?.length > 0">
							<div class="item-cell one">进度信息</div>
							<div class="item-cell two">
								<template v-for="dev in developProcess" :key="dev.id">
									<p class="two-p" v-if="dev.workflow_detail == item.id">
										<span class="two-content" v-html="dev?.process_content"></span>
										<span class="color-describe two-name">{{ dev?.process_user_name }}</span>
										<span class="color-describe two-date">{{ dev?.create_time }}</span>
									</p>
								</template>
							</div>
						</div> -->
						<!-- </template> -->
					</div>
				</template>
			</section>
		</el-scrollbar>
		<el-divider style="margin-bottom: 10px"></el-divider>
		<el-row
			justify="center"
			align="middle"
			v-if="![0, 1, 3, 9].includes(demandRow.demand_process) && Object.keys(taskRow).length"
		>
			<el-affix position="bottom" :offset="30">
				<el-space>
					<!-- v-if="isTaskUser && taskRow.task_process == 5 && taskRow.task_status == 1" -->
					<!-- <DevelopProgress
						v-if="isTaskUser && demandRow.demand_process <= 7 && !is_wait"
						:task_id="taskRow?.id"
						:processDataList="processDataList"
						@ok="emits('updateProgress')"
					></DevelopProgress> -->
					<DemandStatus
						:taskRow="taskRow"
						:demandRow="demandRow"
						:userInfo="userInfo"
						:currentTodo="currentTodo"
						v-model:demand_status="demand_status"
						v-model:is_wait="is_wait"
						@ok="handleSendOk"
						@updateProd="updateProd"
					></DemandStatus>
					<!-- <boke-button type="primary" v-if="is_wait" @click="handleReSend">发送飞书通知</boke-button> -->
				</el-space>
			</el-affix>
		</el-row>
		<el-row justify="center" align="middle" v-else>
			<span>{{ currentTodo }}</span>
		</el-row>
	</div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { getLabel } from '@/utils/tools'
import { useOptionsStore, useUserStore } from '@/stores'
import { demandProcessDict, developerType } from '@/views/demand/service/config'
import { useDemand } from '@/views/demand/hook/useDemand'
import DemandStatus from './DemandStatus.vue'
// import DevelopProgress from './DevelopProgress.vue'
const emits = defineEmits(['ok', 'updateProd', 'updateProgress'])
const props = defineProps({
	processList: {
		type: Array,
		default: () => []
	},
	developProcess: {
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
	}
})
const aduitList = [3, 6, 8, 9] // 需要审批的节点
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const { currentTodo, getCurrentWorkflow } = useDemand(props)
const demand_status = ref() // 需求状态
const is_wait = ref() // 是否等待他人更新
const optionsStore = useOptionsStore()
const { userOptionsNopart } = storeToRefs(optionsStore)
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
// const isTaskUser = computed(() => {
// 	return props.taskRow?.task_user_id == userInfo.value?.id
// })
const handleSendOk = () => {
	emits('ok')
}
const updateProd = (item) => {
	emits('updateProd', item)
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
// 重新发送提醒
// const handleReSend = () => {

// }
onMounted(() => {
	// optionsStore.getUserOptions(false)
	userStore.getUserInfo()
})
defineExpose({
	getCurrentWorkflow
})
</script>

<style scoped lang="scss">
.progress {
	max-height: calc(100vh - 330px);
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
	max-height: calc(100vh - 380px);
	margin-top: 10px;
	.progress-item {
		display: flex;
		align-items: center;
		width: 100%;
		overflow: hidden;
		padding: 10px 0;
		border-top: 1px solid var(--boke-color-border-divider);
		&.no-first {
			margin-left: calc(25% + 8px);
			width: calc(75% - 8px);
			.item-cell:nth-child(1) {
				width: 20%;
			}
			.item-cell:nth-child(2) {
				flex: 1;
				min-width: 60px;
			}
			.item-cell:nth-child(3) {
				width: 34%;
				flex: none;
				min-width: 80px;
			}
		}
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
		.item-cell {
			padding-left: 8px;
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
			width: 15%;
			min-width: 70px;
		}
		.item-cell:nth-child(3) {
			flex: 1;
			min-width: 60px;
		}
		.item-cell:nth-child(4) {
			width: 25%;
			min-width: 80px;
		}
		.workflow-feedback {
			display: flex;
			span {
				display: inline-block;
				vertical-align: middle;
			}
			.workflow-feedback-label {
				color: var(--boke-color-text-describe);
			}
			.workflow-feedback-content {
				color: var(--boke-color-text-describe);
				color: var(--boke-color-text-describe);
				flex: 1;
				:deep(img) {
					max-width: 100%;
					height: auto;
				}
				:deep(a) {
					color: var(--boke-color-main);
					word-break: break-all;
				}
			}
		}
	}
	.develop {
		width: 100%;
		background-color: var(--boke-table-th-bg);
		padding: 8px 0;
		padding-left: 8px;
		box-sizing: border-box;
		color: var(--boke-color-text-content);
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
					width: 200px;
				}
			}
			.two-content {
				display: block;
				width: 270px;
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
