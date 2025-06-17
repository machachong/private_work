<template>
	<section class="p-l-20 entry-form" :class="{ 'mobile-form': isMobile }">
		<BokeForm
			ref="formRef"
			formAlign="left"
			label-width="110px"
			class="boke-form-add"
			labelPosition="top"
			label-suffix=":"
			:vertical="false"
			:form-data="formData"
			:rules="rules"
			mode="add"
			:columns="formColumns"
		>
			<template #form_demand_name>
				<BokeTooltip v-if="canEditDemand2" :content="formData.demand_name"></BokeTooltip>
				<el-input v-else v-model="formData.demand_name" clearable placeholder="请输入需求名称"></el-input>
			</template>
			<template #formStatus>
				<el-tag>未认领</el-tag>
			</template>
			<template #form_project_id>
				<BokeTooltip
					v-if="canEditDemand3 || !!demandRow?.project_id"
					:content="getLabel(projectList, formData.project_id) || formData.project_id || '&nbsp;'"
				></BokeTooltip>
				<boke-select
					v-else
					v-model="formData.project_id"
					clearable
					:options="projectList"
					@change="changeProject"
				></boke-select>
			</template>
			<template #form_assignee_feishu_user_id>
				<BokeTooltip
					v-if="canEditDemand2"
					:content="getLabel(customUserDict, formData.assignee_feishu_user_id)"
				></BokeTooltip>
				<!-- <boke-select
					v-else
					v-model="formData.assignee_feishu_user_id"
					clearable
					:options="customUserDict"
					isDesc
					itemDesc="department"
				></boke-select> -->
				<BokeExecutorSelect
					v-else
					v-model="formData.assignee_feishu_user_id"
					clearable
					isDesc
					itemDesc="department"
				></BokeExecutorSelect>
			</template>
			<template #form_executor_feishu_user_ids>
				<div v-if="canEditDemand3" class="px-12">
					<el-space>
						<span v-for="item in formData.executor_feishu_user_ids" :key="item">
							<BokeUserProfile :userName="getLabel(doUserList, item)" :feishuUserId="item"></BokeUserProfile>
						</span>
					</el-space>
				</div>
				<boke-select
					v-else
					v-model="formData.executor_feishu_user_ids"
					multiple
					:options="doUserList"
					:clearable="mode == 'add'"
				></boke-select>
			</template>
			<template #form_priority_num>
				<BokeTooltip v-if="canEditDemand2" :content="getLabel(priorityDict, formData.priority_num)"></BokeTooltip>
				<boke-select v-else v-model="formData.priority_num" clearable :options="priorityDict"></boke-select>
			</template>
			<template #form_deadline_time>
				<div class="px-12" v-if="canEditDemand5 || props.demandRow?.deadline_time ? true : false">
					{{ formData.deadline_time }}
				</div>
				<el-date-picker
					v-else
					v-model="formData.deadline_time"
					type="datetime"
					value-format="YYYY-MM-DD HH:mm:ss"
					:default-time="new Date(2000, 1, 1, 23, 45, 0)"
					placeholder="请选择截止时间"
					:disabledDate="disabledDate"
				></el-date-picker>
			</template>
			<template #form_demand_process_result>
				<BokeTooltip
					v-if="canEditDemand3"
					:content="getLabel(priorityDict, formData.demand_process_result)"
				></BokeTooltip>
				<el-radio-group v-else v-model="formData.demand_process_result" class="no-bg">
					<el-radio v-for="item in claimDict" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
				</el-radio-group>
			</template>
			<template #form_demand_description>
				<div v-if="canEditDemand1" style="width: 610px">
					<BokeTooltip :content="formData.demand_description" isHtml></BokeTooltip>&nbsp;
				</div>
				<!-- <el-input
					v-else
					v-model="formData.demand_description"
					clearable
					type="textarea"
					placeholder="请输入需求描述"
					:autosize="{ minRows: 2 }"
				></el-input> -->
				<BokeWangEditor
					v-else
					v-model="formData.demand_description"
					height="50px"
					pasteIgnoreImg
					mode="simple"
					class="editor-chart"
					placeholder="请输入内容"
					:hideTool="true"
				></BokeWangEditor>
			</template>
			<template #form_task_type>
				<div class="px-12" v-if="canEditDemand6Disabled">{{ getLabel(demandTypeDict, formData.task_type) }}</div>
				<boke-select
					v-else
					v-model="formData.task_type"
					:options="demandTypeDict?.filter((item) => item.value != 0)"
				></boke-select>
			</template>
			<template #form_send_feishu_user_id>
				<div class="px-12" v-if="canEditCcAndSendDisabled">
					<el-space>
						<span v-for="item in formData.send_feishu_user_id" :key="item">
							<BokeUserProfile :userName="getLabel(customUserDict, item)" :feishuUserId="item"></BokeUserProfile>
						</span>
					</el-space>
				</div>
				<boke-select
					v-else
					v-model="formData.send_feishu_user_id"
					:options="sendUserList"
					clearable
					multiple
				></boke-select>
			</template>
			<template #form_cc_feishu_user_id>
				<div class="px-12" v-if="canEditCcAndSendDisabled">
					<el-space>
						<span v-for="item in formData.cc_feishu_user_id" :key="item">
							<BokeUserProfile :userName="getLabel(customUserDict, item)" :feishuUserId="item"></BokeUserProfile>
						</span>
					</el-space>
					&nbsp;
				</div>
				<BokeExecutorSelect
					v-else
					v-model="formData.cc_feishu_user_id"
					:disabled="canEditCcAndSendDisabled"
					multiple
					clearable
					isDesc
					itemDesc="department"
				></BokeExecutorSelect>
			</template>
			<template #form_milestone_node>
				<el-cascader
					style="width: 100%"
					v-model="formData.milestone_node"
					:props="cascaderProps"
					:options="milestoneNodeList"
					:show-all-levels="false"
				/>
			</template>

			<template #form_demand_content>
				<BokeMdEditor
					:height="isMobile ? '200px' : '250px'"
					:width="isMobile ? '100%' : '624px'"
					ref="mdEditorRef"
					:hideTool="isMobile"
					v-model="formData.demand_content"
					:readonly="canEditDemand1 || isTbDemand"
				></BokeMdEditor>
			</template>
			<template #form_task_doc>
				<BokeWangEditor
					v-model="formData.task_doc"
					height="250px"
					style="max-width: 720px"
					pasteIgnoreImg
					mode="simple"
					class="editor-chart"
					placeholder="请输入内容"
					:excludeKeys="contentExcludeKeys"
				></BokeWangEditor>
			</template>

			<template #form_task_upload>
				<BokeUpload
					v-model:value="formData.task_file_path"
					listType="text"
					:limit="6"
					accept=".csv,.xls,.xlsx,.doc,.docx"
					uploadUrl="/data_task/data_demand_task/attach_file/"
					:disabled="!(props.demandRow?.demand_process == 5 && props.mode == 'finish')"
					@onPreview="handleOnPreview"
				></BokeUpload>
			</template>
			<template #formUpload>
				<BokeUpload
					v-model:value="formData.attach_img"
					:drag="true"
					:disabled="canEditDemand1"
					uploadUrl="/data_task/data_demand_pool/attach_img/"
					tipText="支持粘贴,拖拽上传"
				></BokeUpload>
			</template>
			<template #formTbLink>
				<span class="table-link p-l-6" :title="demandRow?.tb_task_url" @click="goUrl(demandRow?.tb_task_url)"
					>点击跳转</span
				>
			</template>
		</BokeForm>
		<el-row justify="end" class="fix-bottom" v-if="mode == 'claim'">
			<BokeButton
				@click="
					() => {
						emits('ok')
					}
				"
				>取消</BokeButton
			>
			<BokeButton type="primary" @click="handleSubmit('claim')">确定</BokeButton>
		</el-row>
		<el-row justify="end" class="fix-bottom" v-else-if="mode == 'finish'">
			<BokeButton
				@click="
					() => {
						emits('ok')
					}
				"
				>取消</BokeButton
			>
			<BokeButton type="primary" @click="handleSubmit('finish')">完成</BokeButton>
		</el-row>
		<el-row justify="center" class="fix-bottom" v-else-if="canSubmit && !['clain', 'finish', 'task']?.includes(mode)">
			<BokeButton :disabled="editStatus" width="120px" type="primary" @click="handleSubmit('save')">提交</BokeButton>
		</el-row>
	</section>
</template>

<script setup>
// import { DArrowRight, DArrowLeft } from "@element-plus/icons-vue"
// import { Plus } from "@element-plus/icons-vue"
import dayjs from 'dayjs'
import { ElInput, ElRadio, ElRadioGroup, ElSelect } from 'element-plus'
import { demandTypeDict, priorityDict, claimDict } from '@/views/da_demand/service/config'
import { addPool, updatePool, updateDemandWorkflowApi } from '@/views/da_demand/service/demand_api'
import { updateTaskApi, getSendUserApi } from '@/views/da_demand/service/task_api'
import { uploadFile } from '@/api/publicApi'
import { getLabel, message, confirm, getWangEditorEmpty } from '@/utils/tools'
import { useDemand } from '../../hook/useDemand'
import { addDemandTrack, editDemandTrack, claimDemandTrack, finishTaskTrack } from '@/views/da_demand/service/track'
import { useUserStore } from '@/stores'
import { contentExcludeKeys } from '@/components/demand/config'
import { useMilestone } from '@/views/milestone/service/useMilestone'
// import tracker from "@/utils/tracking"
import settings from '@/utils/config/settings'
import router from '@/router'
import { cloneDeep } from 'lodash'

const props = defineProps({
	isMobile: {
		type: Boolean,
		default: false
	},
	demandRow: {
		type: Object,
		default: () => {
			return undefined
		}
	},
	taskRow: {
		type: Object,
		default: () => {
			return undefined
		}
	},
	readonly: {
		type: Boolean,
		default: false
	},
	mode: {
		type: String,
		default: 'add' //  add新增， edit 编辑，task任务里面的需求内容，claim认领, finish完成
	},
	validateOrder: {
		type: Function,
		default: () => {
			return new Promise((resolve) => {
				return resolve(true)
			})
		}
	},
	isDemand: {
		type: Boolean,
		default: false
	}
})
const emits = defineEmits(['ok'])

const {
	getCustomerUser,
	customUserDict,
	projectList,
	getProjectList,
	dwUserList,
	getDaUser,
	goUrl,
	handleOnPreview,
	resolveFile,
	getTbTaskStatus,
	tb_status_dict
} = useDemand()
const userStore = useUserStore()
const { milestoneNodeList, getMilestoneNodeList, cascaderProps } = useMilestone()
const { mode } = toRefs(props)
const route = useRoute()
const formData = reactive({
	demand_name: '',
	demand_status: 0, // 0 未开始, 1 进行中, 2已完成
	project_id: undefined,
	task_type: '',
	assignee_feishu_user_id: '',
	executor_feishu_user_ids: [],
	priority_num: 0,
	deadline_time: '',
	demand_content: '',
	task_content: '',
	doc_url: '',
	attach_img: [],
	demand_process_result: 'data_demand_claim_1', // 认领状态
	claim_feishu_user_id: '', //认领人
	option_feishu_user_id: '', // 转交人
	task_doc: '', //任务内容
	task_file_path: [],
	demand_description: '',
	milestone_node: '',
	cc_feishu_user_id: [],
	send_feishu_user_id: []
})
const doc_url_name = ref()
const mdEditorRef = ref() // 需求内容
// const mdEditorRefTask = ref() // 任务内容
// const showMore = ref(false)
const formRef = ref(null)
// const demandInfo = computed(() => {
// 	return props.demandRow
// })
const sendUserList = ref([]) // 分析报告发送人
// 判断需求内容，附件是否可以编辑
const canEditDemand1 = computed(() => {
	return props.demandRow?.demand_process >= 9
})
// 判断需求名称相关是否可以编辑
const canEditDemand2 = computed(() => {
	return props.demandRow?.demand_process == 0 || !!props.demandRow?.demand_process
})
// 认领之前的时候可以编辑, // 来自TB的任务在认领的时候需要选择项目,预期时间
const canEditDemand3 = computed(() => {
	return props.demandRow?.demand_process >= 5
})
// 需求完成可以填写
const canEditDemand4 = computed(() => {
	return !(props.demandRow?.demand_process == 5 && props.mode == 'finish')
})
// TB同步过来的任务，如果没有时间，认领的时候需要填写，如果有，则不能修改
const canEditDemand5 = computed(() => {
	return (
		(props.mode != 'claim' ||
			(props.mode == 'claim' && props.demandRow?.deadline_time) ||
			props.demandRow?.demand_process < 5) &&
		(!['edit', 'add', 'claim']?.includes(props.mode) || (props.mode == 'edit' && props.demandRow?.deadline_time))
	)
})
// 认领之后和完成之前可以编辑
const canEditDemand6 = computed(() => {
	// return (
	// 	(props.demandRow?.demand_process != 5 && props.mode != 'claim') ||
	// 	props.mode == 'finish' ||
	// 	(props.mode != 'claim' && !props.taskRow?.id)
	// )
	return (
		props.mode == 'add' ||
		props.mode == 'finish' ||
		(props.mode == 'edit' && props.demandRow?.demand_process < 5) ||
		props.isDemand
	)
})
// 认领之后和完成之前可以编辑
const canEditDemand6Disabled = computed(() => {
	return (
		(props.demandRow?.demand_process != 5 && props.mode != 'claim') ||
		props.mode == 'finish' ||
		(props.mode != 'claim' && !props.taskRow?.id)
	)
})
// 提交按钮控制
const canSubmit = computed(() => {
	return (
		!props.demandRow?.demand_process ||
		props.demandRow?.demand_process < 5 ||
		(props.demandRow?.demand_process == 5 && props.taskRow.task_status != 2)
	)
})
// 任务类型为发送分析报告的时候并且等于完成时可以选择
const canEditCcAndSend = computed(() => {
	return (
		formData.task_type != 6 ||
		props.mode == 'add' ||
		props.mode == 'claim' ||
		(props.mode == 'edit' && props.demandRow?.demand_process < 9)
	)
})
// 任务类型不等于完成时置灰
const canEditCcAndSendDisabled = computed(() => {
	return props.mode != 'finish'
})
const formColumns = computed(() => {
	return [
		{
			label: '需求名称',
			prop: 'demand_name',
			hidden: mode.value == 'finish',
			formProp: {
				el: ElInput,
				required: true,
				slot: 'form_demand_name',
				width: '300px',
				clearable: true,
				placeholder: '请输入需求名称',
				disabled: canEditDemand2.value
			}
		},
		{
			label: '状态',
			prop: 'demand_status',
			hidden: mode.value != 'task' || mode.value == 'finish',
			class: 'no-bg',
			formProp: {
				el: 'BokeSelect',
				width: '300px',
				class: 'no-bg',
				slot: 'formStatus'
			}
		},
		{
			label: '项目',
			prop: 'project_id',
			hidden: mode.value == 'finish',
			formProp: {
				el: 'BokeSelect',
				width: '300px',
				slot: 'form_project_id',
				source: projectList.value,
				clearable: true,
				disabled: canEditDemand3.value || !!props.demandRow?.project_id,
				onChange: function (val) {
					changeProject(val)
				}
			}
		},
		{
			label: '需求人',
			prop: 'assignee_feishu_user_id',
			hidden: mode.value == 'finish',
			formProp: {
				el: 'BokeSelect',
				required: true,
				width: '300px',
				slot: 'form_assignee_feishu_user_id',
				source: customUserDict,
				clearable: true,
				isDesc: true,
				itemDesc: 'department',
				disabled: canEditDemand2.value
			}
		},
		{
			label: '执行人',
			prop: 'executor_feishu_user_ids',
			hidden: mode.value == 'finish',
			formProp: {
				el: 'BokeSelect',
				required: true,
				width: '300px',
				slot: 'form_executor_feishu_user_ids',
				multiple: true,
				source: doUserList.value,
				closeItem: mode.value != 'add',
				clearable: mode.value == 'add',
				disabled: canEditDemand3.value
			}
		},
		{
			label: '优先级',
			prop: 'priority_num',
			hidden: mode.value == 'finish',
			formProp: {
				el: 'BokeSelect',
				width: '300px',
				slot: 'form_priority_num',
				source: priorityDict,
				clearable: true,
				disabled: canEditDemand2.value
			}
		},
		{
			label: '截止时间',
			prop: 'deadline_time',
			hidden: mode.value == 'finish',
			require: true,
			formProp: {
				width: '300px',
				el: ElDatePicker,
				type: 'datetime',
				slot: 'form_deadline_time',
				disabled: canEditDemand5.value || props.demandRow?.deadline_time ? true : false,
				'value-format': 'YYYY-MM-DD HH:mm:ss',
				'default-time': new Date(2000, 1, 1, 23, 45, 0),
				disabledDate: disabledDate
			}
		},
		{
			label: '关联里程碑',
			prop: 'milestone_node',
			hidden: mode.value == 'finish',
			formProp: {
				width: '300px',
				slot: 'form_milestone_node',
				disabled: canEditDemand2.value
			}
		},
		{
			label: '任务类型',
			prop: 'task_type',
			hidden: canEditDemand6.value,
			formProp: {
				el: ElSelect,
				slot: 'form_task_type',
				required:
					formData.demand_process_result != 'data_demand_claim_2' &&
					formData.demand_process_result != 'data_demand_claim_3',
				childEl: ElOption,
				width: '300px',
				source: demandTypeDict?.filter((item) => item.value != 0),
				clearable: true,
				disabled: canEditDemand6Disabled.value
			}
		},
		{
			label: '抄送人',
			prop: 'cc_feishu_user_id',
			hidden: canEditCcAndSend.value,
			formProp: {
				el: ElSelect,
				multiple: true,
				childEl: ElOption,
				width: '300px',
				slot: 'form_cc_feishu_user_id',
				source: customUserDict.value,
				clearable: true
			}
		},
		{
			label: '发送人',
			prop: 'send_feishu_user_id',
			hidden: canEditCcAndSend.value,
			formProp: {
				el: ElSelect,
				required: true,
				multiple: true,
				width: '300px',
				childEl: ElOption,
				slot: 'form_send_feishu_user_id',
				source: sendUserList.value,
				clearable: true,
				disabled: canEditCcAndSendDisabled.value
			}
		},
		{
			label: '报告文档',
			prop: 'task_doc',
			hidden: canEditCcAndSend.value,
			formProp: {
				el: ElInput,
				type: 'textarea',
				width: '100%',
				slot: 'form_task_doc',
				autosize: { minRows: 4 },
				placeholder: '请输入',
				disabled: canEditDemand4.value,
				clearable: true
			}
		},
		{
			label: '认领状态',
			prop: 'demand_process_result',
			hidden: mode.value != 'claim',
			formProp: {
				el: ElRadioGroup,
				class: 'no-bg',
				slot: 'form_demand_process_result',
				required: true,
				childEl: ElRadio,
				width: '300px',
				source: claimDict,
				clearable: true,
				disabled: canEditDemand3.value
			}
		},
		{
			label: 'TB需求状态',
			prop: 'tb_task_status',
			hidden: !isTbClaim.value,
			formProp: {
				el: ElSelect,
				childEl: ElOption,
				width: '300px',
				source: tb_status_dict.value,
				clearable: true
			}
		},
		{
			label: '转交人',
			prop: 'option_feishu_user_id',
			hidden: mode.value != 'claim' || formData.demand_process_result != 'data_demand_claim_3',
			formProp: {
				el: ElSelect,
				required: true,
				childEl: ElOption,
				width: '300px',
				source: doUserList.value,
				clearable: true
			}
		},
		{
			label: '需求内容',
			prop: 'demand_content',
			hidden: mode.value == 'finish',
			formProp: {
				el: ElInput,
				type: 'textarea',
				autosize: { minRows: 4 },
				width: '100%',
				clearable: true,
				slot: 'form_demand_content',
				placeholder: '请输入需求需求内容',
				disabled: canEditDemand1.value
			}
		},
		{
			label: '附件',
			prop: 'attach_img',
			hidden: mode.value == 'claim' || mode.value == 'finish',
			formProp: {
				clearable: true,
				slot: 'formUpload',
				width: '100%'
			}
		},
		// {
		// 	label: '需求描述',
		// 	prop: 'demand_description',
		// 	hidden: mode.value == 'finish',
		// 	formProp: {
		// 		el: ElInput,
		// 		type: 'textarea',
		// 		slot: 'form_demand_description',
		// 		autosize: { minRows: 2 },
		// 		width: '100%',
		// 		clearable: true,
		// 		placeholder: '请输入需求描述',
		// 		disabled: canEditDemand1.value
		// 	}
		// },
		{
			label: '交付内容',
			prop: 'task_doc',
			hidden: showPayContent.value,
			formProp: {
				el: ElInput,
				type: 'textarea',
				width: '100%',
				slot: 'form_task_doc',
				autosize: { minRows: 4 },
				placeholder: '请输入',
				disabled: canEditDemand4.value,
				clearable: true
			}
		},
		{
			label: '交付附件',
			prop: 'task_file_path',
			hidden: showPayContent.value,
			formProp: {
				clearable: true,
				slot: 'form_task_upload',
				width: '100%',
				disabled: canEditDemand4.value
			}
		},
		{
			label: 'TB链接',
			prop: 'tb_link',
			hidden: props.demandRow?.demand_source != 2,
			formProp: {
				slot: 'formTbLink',
				width: '100%'
			}
		}
	]
})
const showPayContent = computed(() => {
	// 需求详情不展示交付内容
	return props.mode !== 'finish' || props.taskRow?.task_type == 6
})
const isTbDemand = computed(() => {
	return props.demandRow?.demand_source == 2
})
const isTbClaim = computed(() => {
	return mode.value == 'claim' && props.demandRow?.demand_source == 2
})
const rules = computed(() => {
	return {
		demand_name: [{ required: true, message: '请输入', trigger: 'change' }],
		project_id: [
			{
				required: formData.demand_process_result == 'data_demand_claim_1' && !formData.milestone_node,
				message: '请选择',
				trigger: 'change'
			}
		],
		assignee_feishu_user_id: [{ required: true, message: '请选择', trigger: 'change' }],
		executor_feishu_user_ids: [{ required: true, message: '请选择', trigger: 'change' }],
		deadline_time: [
			{ required: formData.demand_process_result == 'data_demand_claim_1', message: '请选择', trigger: 'change' }
		],

		task_type: [{ required: true, message: '请选择', trigger: 'change' }],
		demand_process_result: [{ required: true, message: '请选择', trigger: 'change' }],
		option_feishu_user_id: [{ required: true, message: '请选择', trigger: 'change' }],
		// task_doc: [{ required: true, message: '请输入', trigger: 'blur' }],
		tb_task_status: [
			{
				required: isTbClaim.value && formData.demand_process_result == 'data_demand_claim_1',
				message: '请选择',
				trigger: 'change'
			}
		],
		send_feishu_user_id: [{ required: true, message: '请选择', trigger: 'change' }]
	}
})
// 控制执行人禁止删除
const doUserList = computed(() => {
	const disArr = props?.demandRow?.executor_feishu_user_ids?.split(',')
	const newList = cloneDeep(dwUserList.value)
	// 后端不好控制删除，所以新增需求之后，控制执行人只能添加，不可以删除，删除需要退出需求
	if (!disArr || disArr?.length == 0) {
		return newList
	}
	return newList.map((item) => {
		if (disArr?.includes(item.value)) {
			item.disabled = true
		}
		return item
	})
})
// 判断当前内容是否有修改
const editStatus = computed(() => {
	// const obj_key = ['demand_content', 'milestone_node']
	const obj_key =
		props.demandRow?.demand_source == 2
			? ['milestone_node', 'deadline_time']
			: ['demand_content', 'milestone_node', 'deadline_time']
	console.log(mode.value)

	if (mode.value != 'edit') {
		return false
	}
	// 特殊处理，附近和执行人要特别进行处理
	if (
		(!props?.demandRow?.executor_feishu_user_ids && formData.executor_feishu_user_ids?.length > 0) ||
		(!props?.demandRow?.attach_img && formData.attach_img?.length > 0)
	) {
		return false
	}
	if (
		!!props?.demandRow?.executor_feishu_user_ids &&
		props?.demandRow?.executor_feishu_user_ids != formData.executor_feishu_user_ids?.join(',')
	) {
		return false
	}
	// tasktype没完成之前可以修改
	if (
		(!props.taskRow?.task_type && formData.task_type) ||
		(!!props.taskRow?.task_type && props.taskRow?.task_type != formData.task_type)
	) {
		return false
	}
	const imgStr = formData.attach_img?.map((item) => item.response?.data?.items)?.join(',')
	if (!!props?.demandRow?.attach_img && props?.demandRow?.attach_img != imgStr) {
		return false
	}

	for (let i of obj_key) {
		if (props?.demandRow[i] != formData[i]) {
			return false
		}
	}
	return true
})
const disabledDate = (time) => {
	if (dayjs(time.getTime()).format('YYYY-MM-DD') == dayjs().format('YYYY-MM-DD') || time.getTime() > Date.now()) {
		return false
	}
	return true
}
// 控制执行人禁止删除
// 后端不好控制删除，所以新增需求之后，控制执行人只能添加，不可以删除，删除需要退出需求
// const handleExecutorDisable = (arr) => {
// 	dwUserList.value.forEach((item) => {
// 		if (arr?.includes(item.value)) {
// 			item.disabled = true
// 		}
// 	})
// }
const changeProject = (val) => {
	const item = projectList.value?.find((item) => item.value == val)
	console.log(projectList, item)
	// TB任务切换项目，不清空执行人
	if (!props.demandRow?.demand_source) {
		if (item?.dw_user) {
			formData.executor_feishu_user_ids = [item.dw_user]
		} else {
			formData.executor_feishu_user_ids = []
		}
	}
}
// 更新任务信息
const updateTask = async (params) => {
	await updateTaskApi(params)
}
// 判断当前时间是否超过截止时间
const isAfterCliam = (complate) => {
	const now = dayjs()
	const deadline_time = dayjs(complate)
	const diffMinutes = deadline_time.diff(now, 'minute')
	if (diffMinutes < 0) {
		return '已经超过截止时间，确定认领吗？'
	} else if (diffMinutes <= 15) {
		return `距离截止时间仅剩${diffMinutes}分钟，确定认领吗？`
	} else {
		return 'ok'
	}
}
// 新增，修改需求信息
const handleSave = async () => {
	const Api = mode.value == 'edit' ? updatePool : addPool
	let attach_img_new = null
	if (formData?.attach_img?.length > 0) {
		attach_img_new = formData.attach_img
			.map((item) => {
				return item?.response?.data?.items
			})
			.join(',')
	}
	// const demand_content = mdEditorRef.value?.getValue()
	let params = {
		...formData,
		attach_img: attach_img_new,
		executor_feishu_user_ids: formData.executor_feishu_user_ids?.join(',')
	}
	// 为了后端需要,没有选择时,不传递这个参数
	if (!params.project_id) {
		params.project_id = undefined
	}
	if (!isTbDemand.value) {
		params.demand_content = formData.demand_content
	}
	if (mode.value == 'edit') {
		params.id = props.demandRow?.id
		// tracker.push({
		// 	name: "editDemand",
		// 	description: "编辑需求",
		// 	behavior: "edit",
		// 	permission_id: 12020103
		// })
		if (props.taskRow?.id) {
			await updateTask({
				id: props.taskRow?.id,
				task_type: formData.task_type
			})
		}
	}
	await Api({ ...params }, true)
	formData.attach_img = []
	// 2024-5-13 新增成功后置空
	doc_url_name.value = ''
	formRef.value?.form.resetFields()
	if (props.isMobile) {
		emits('ok')
	} else {
		message.success(mode.value == 'edit' ? '更新成功' : '新增成功')
		emits('ok')
	}
	if (mode.value == 'edit') {
		editDemandTrack()
	} else {
		addDemandTrack()
	}
}
// 认领
const handleSubmitClaim = async () => {
	try {
		const {
			demand_process_result,
			option_feishu_user_id,
			task_type,
			project_id,
			deadline_time,
			tb_task_status,
			demand_content,
			demand_description
		} = formData
		// 判断当前任务是否过期过着15分钟即将过期
		const afterTip = isAfterCliam(deadline_time)
		if (afterTip != 'ok') {
			await confirm(afterTip)
		}
		// const task_content = mdEditorRefTask.value?.getValue()
		// const demand_content = mdEditorRef.value?.getValue()
		const params = {
			id: props.demandRow?.id,
			demand_process_result,
			claim_feishu_user_id: userStore?.userInfo?.union_id,
			option_feishu_user_id,
			// task_content,
			// demand_content,
			task_type,
			tb_task_status,
			demand_process: props.demandRow?.demand_process,
			source: 'web', // 后端用于区分web和卡片调用
			demand_description
		}
		// TB任务可能不存在项目和预期时间，如果不存在，认领时需要填写
		// TB任务不可以修改任务信息
		if (isTbDemand.value) {
			if (!props.demandRow?.project_id) {
				params.project_id = project_id
			}
			if (!props.demandRow?.deadline_time) {
				params.deadline_time = deadline_time
			}
		} else {
			params.demand_content = demand_content
		}
		const res = await updateDemandWorkflowApi(params, true, true)
		claimDemandTrack({
			需求名称: props.demandRow.demand_name,
			执行人: userStore?.userInfo?.union_id,
			认领状态: getLabel(claimDict, demand_process_result)
		})
		if (res.data?.status_code == 200) {
			const { items } = res.data.data
			message.success('操作成功')
			// 如果是侧边栏，认领完携带任务ID调整侧边栏需求详情页
			if (props.isMobile) {
				router.push({
					path: '/mobile/data_demand_info',
					query: {
						demand_id: props.demandRow?.id,
						task_id: items
					}
				})
			}
			emits('ok', items)
		} else {
			message.error(res.data?.message)
		}
	} catch (error) {
		console.log(error)
	}
}
// 完成
const handleSubmitFinish = async () => {
	try {
		const { task_doc, task_file_path } = formData
		let new_file = null
		if (task_file_path?.length > 0) {
			new_file = task_file_path
				.map((item) => {
					return item?.response?.data?.items
				})
				.join(',')
		}
		if (!getWangEditorEmpty(task_doc)) {
			message.error('请输入交付内容')
			return
		}
		const params = {
			id: props.demandRow?.id,
			task_id: props.taskRow?.id,
			demand_process: props.demandRow?.demand_process,
			demand_status: 2,
			task_file_path: new_file,
			task_doc,
			source: 'web' // 后端用于区分web和卡片调用
		}
		// 分析报告类型的需求需要增加发送人和抄送人
		if (formData.task_type == 6) {
			params.cc_feishu_user_id = formData.cc_feishu_user_id?.join(',')
			params.send_feishu_user_id = formData.send_feishu_user_id?.join(',')
		}
		let isBind = true
		if (props.validateOrder && props.taskRow.task_type == 2) {
			isBind = await props.validateOrder(true)
			console.log(isBind)
		}
		// 判断是否绑定了工单
		if (!isBind) {
			return
		}
		console.log(params)
		await updateDemandWorkflowApi(params)
		message.success('操作成功')
		finishTaskTrack({
			需求名称: props.demandRow.demand_name,
			执行人: userStore?.userInfo?.union_id
		})
		emits('ok')
	} catch (error) {
		console.log(error)
	}
}
const handleSubmit = async (type) => {
	try {
		const val = await formRef.value?.form.validate()
		if (!val) return false
		if (type == 'save') {
			handleSave()
		} else if (type == 'claim') {
			handleSubmitClaim()
			if (props.isMobile) {
				router.push({
					path: '/mobile/data_demand_info',
					query: {
						demand_id: props.demandRow?.id
					}
				})
			}
		} else if (type == 'finish') {
			handleSubmitFinish()
		}
	} catch (error) {
		console.log(error)
	}
}
const upload = async (file) => {
	const newformData = new FormData()
	newformData.append('file', file)
	const { items = '' } = await uploadFile(newformData)
	return items
}
const init = () => {
	try {
		for (let i in formData) {
			if (i == 'attach_img') {
				if (!props?.demandRow?.attach_img) {
					formData.attach_img = []
				} else {
					formData.attach_img = props?.demandRow?.attach_img?.split(',').map((item, index) => {
						return {
							name: '粘贴上传' + index,
							url: `${settings.API_URL}/data_task/data_demand_pool/attach_img/?attach_img=${item}`,
							response: {
								data: {
									items: item
								}
							}
						}
					})
				}
			} else if (i == 'task_file_path') {
				if (!props?.taskRow?.task_file_path) {
					formData.task_file_path = []
				} else {
					formData.task_file_path = props?.taskRow?.task_file_path?.split(',').map((item) => {
						const lastOf = item.lastIndexOf('/')
						const name = item.substr(lastOf + 1)
						return {
							name,
							url: resolveFile(item),
							response: {
								data: {
									items: item
								}
							}
						}
					})
					console.log(792, formData.task_file_path)
				}
			} else if (['executor_feishu_user_ids', 'cc_feishu_user_id', 'send_feishu_user_id'].includes(i)) {
				if (props?.demandRow[i]) {
					formData[i] = props?.demandRow[i]?.split(',')
				} else {
					formData[i] = []
				}
			} else if (i == 'task_content') {
				formData.task_content = props?.demandRow?.demand_content
			} else if (['task_type', 'demand_process_result']?.includes(i)) {
				formData.task_type = props?.taskRow?.task_type
			} else if (i == 'project_id' && props?.demandRow[i] == 0) {
				formData.project_id = undefined
			} else {
				formData[i] = props?.demandRow[i]
			}
		}
		// 部分信息从任务中获取
		if (props.taskRow?.task_doc) {
			formData.task_doc = props.taskRow?.task_doc
		}
		if (props?.taskRow?.cc_feishu_user_id) {
			formData.cc_feishu_user_id = props?.taskRow.cc_feishu_user_id?.split(',')
		}
		if (props?.taskRow?.send_feishu_user_id) {
			formData.send_feishu_user_id = props?.taskRow.send_feishu_user_id?.split(',')
		}
		console.log(props?.taskRow)
	} catch (error) {
		console.log(error)
	}
}
const getSendUser = async () => {
	try {
		const res = await getSendUserApi()
		console.log(res)

		sendUserList.value = res?.option?.map((item) => {
			return {
				...item,
				label: item.user_name,
				value: item.feishu_user_id
			}
		})
	} catch (error) {
		console.log(error)
	}
}
onMounted(() => {
	getCustomerUser()
	getProjectList()
	getDaUser()
	getSendUser()
	getMilestoneNodeList()
	// 2025-2-28 从里程碑通知卡片进入需求，自动填入里程碑节点
	if (route.query.milestone_node_id) {
		formData.milestone_node = Number(route.query.milestone_node_id)
	}
	// 2025-3-4 从里程碑通知卡片进入需求，自动填入里需求人
	if (route.query?.assignee_user_id) {
		formData.assignee_feishu_user_id = route.query.assignee_user_id
	}

	// TB需求认领时获取tb的状态
	if (isTbClaim.value) {
		getTbTaskStatus({
			feishu_user_id: userStore?.userInfo?.union_id,
			tb_task_id: props.demandRow?.tb_task_id
		})
	}
	userStore?.getUserInfo()
	document.addEventListener('paste', function (event) {
		let items = event.clipboardData && event.clipboardData.items
		let file = null
		if (items && items.length) {
			for (var i = 0; i < items.length; i++) {
				if (items[i].type.indexOf('image') !== -1) {
					// 此时file就是剪切板中的图片文件
					file = items[i].getAsFile()
					break
				}
			}
		}
		if (!file) return
		upload(file).then((res) => {
			formData.attach_img.push({
				name: '粘贴上传',
				url: settings.API_URL + '/develop_task/demand_pool/attach_img/?attach_img=' + res,
				response: {
					data: {
						items: res
					}
				}
			})
		})
	})
})
defineExpose({
	init
})
</script>

<style scoped lang="scss">
.show-more {
	text-align: center;
}
.prd-name {
	margin-bottom: 8px;
	line-height: 22px;
}
.prd-bg {
	text-indent: 10px;
	width: 100%;
	background-color: var(--boke-table-th-bg);
	margin-bottom: 16px;
}
.entry-form {
	padding-bottom: 20px;
	position: relative;
	.fix-bottom {
		position: sticky;
		bottom: 10px;
	}
}
.mobile-form {
	width: 100%;
	box-sizing: border-box;
	:deep(.boke-form) {
		width: 100%;
		.boke-form__item-container {
			width: 100%;
		}
		.el-form-item {
			width: 100% !important;
			.boke-select {
				width: 100% !important;
			}
		}
	}
}
</style>
