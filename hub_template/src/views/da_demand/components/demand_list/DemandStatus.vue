<template>
	<section>
		<!-- 需求认领，更新正式，在飞书卡片进行，完成开发不许要交互，直接调接口 -->
		<template v-if="is_wait && isSmall">
			<div style="white-space: nowrap">{{ demandStatus }}</div>
		</template>
		<template v-else-if="['更新正式', '完成开发'].includes(demandStatus)">
			<boke-button :class="{ 'px-40': !isSmall }" type="primary" @click="handleAction">{{ demandStatus }}</boke-button>
		</template>
		<!-- 需求对接，需求认领,需求人验收，原型审批由需求人操作，在需求列表进行 -->
		<template v-else-if="['需求对接', '需求人验收', '原型审批', '需求认领'].includes(demandStatus)">
			<boke-text-button :disabled="!isDeveloper && demandStatus == '需求对接'" @click="demandClick"
				>{{ demandStatus }}
			</boke-text-button>
		</template>
		<!-- 需要两端更新时提示 -->
		<template v-else-if="['需求完成-不符合预期', '需求完成-符合预期'].includes(demandStatus) || is_wait">
			<div style="white-space: nowrap">{{ demandStatus }}</div>
		</template>
		<!-- 需要交互的情况 -->
		<template v-else>
			<boke-button :class="{ 'px-40': !isSmall }" type="primary" @click="dialogVisible = true"
				>{{ demandStatus }}
			</boke-button>
		</template>
		<BokeDialog
			:title="demandStatus"
			v-model:value="dialogVisible"
			width="1000px"
			@open="handleOpen"
			@close="handleReset"
		>
			<section class="detail-info">
				<BokeForm
					ref="formRef"
					formAlign="left"
					label-width="150px"
					class="boke-form-add"
					label-suffix=":"
					label-position="top"
					vertical
					:form-data="entryFormData"
					:rules="entryRules"
					mode="add"
					:columns="entryFormColumns"
				>
					<template #formDoc>
						<div v-if="doc_url_name" style="padding-left: 10px; width: 100%" @click.stop="doc_url_name = ''">
							<boke-text-button>
								<a :href="entryFormData.doc_url" :title="doc_url_name" target="_blank">{{ doc_url_name }}</a>
							</boke-text-button>
						</div>
						<el-input
							v-else
							v-model="entryFormData.doc_url"
							@blur="changeDoc"
							clearable
							placeholder="请输入需求文档地址"
						>
						</el-input>
					</template>
				</BokeForm>
				<el-form
					:model="specialFormData"
					label-suffix=":"
					v-if="entryFormData.prd_status == 2 && entryFormData.system && demandStatus == '需求对接'"
				>
					<el-form-item label="自定义开发者" prop="special_type">
						<el-switch v-model="specialFormData.special_type" @change="setDevper"></el-switch>
					</el-form-item>
					<el-form-item label="前端开发" prop="front_user_id" v-if="specialFormData.special_type">
						<boke-select
							style="width: 97%"
							v-model="specialFormData.front_user_id"
							:options="optionsStore.devOptions"
							clearable="true"
						></boke-select>
					</el-form-item>
					<el-form-item label="后端开发" prop="back_user_id" v-if="specialFormData.special_type">
						<boke-select
							style="width: 97%"
							v-model="specialFormData.back_user_id"
							:options="optionsStore.devOptions"
							clearable="true"
						></boke-select>
					</el-form-item>
				</el-form>
				<el-form
					:model="claimForm"
					label-width="100px"
					label-position="right"
					label-suffix=":"
					:rule="claimRules"
					v-if="demandStatus == '需求认领'"
				>
					<el-form-item label="认领类型" prop="demand_dev_type_name">
						{{ claimForm.demand_dev_type_name }}
						<!-- <el-radio-group v-model="claimForm.demand_dev_type_name" @change="changeClaim">
							<el-radio label="前端开发">前端</el-radio>
							<el-radio label="后端开发">后端</el-radio>
						</el-radio-group> -->
					</el-form-item>
					<el-form-item label="认领状态" prop="demand_process_result">
						<el-radio-group v-model="claimForm.demand_process_result" @change="changeClaim">
							<el-radio label="demand_claim_1">认领</el-radio>
							<el-radio label="demand_claim_2">不认领</el-radio>
							<el-radio label="demand_claim_3">转交</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item
						label="转交人"
						prop="option_user_info_uid"
						v-show="['demand_claim_3'].includes(claimForm.demand_process_result)"
					>
						<boke-select
							style="width: 97%"
							v-model="claimForm.option_user_info_uid"
							:options="optionsStore.devOptions"
							clearable="true"
						></boke-select>
					</el-form-item>
				</el-form>
			</section>
			<template #footer>
				<el-row justify="end">
					<el-space>
						<boke-button @click="handleReset">取消</boke-button>
						<BokeButton :loading="SaveLoading" type="primary" @click="handleSubmit(formRef)">确定</BokeButton>
					</el-space>
				</el-row>
			</template>
		</BokeDialog>
	</section>
</template>

<script setup>
import dayjs from 'dayjs'
import { confirm, message } from '@/utils/tools'
import { demandTypeDict } from '../../service/config'
import { updateDemandWorkflowApi, updateDemandSpecialApi } from '../../service/demand_api'
import { useOptionsStore } from '@/stores'
import { useSystem } from '@/views/config/hook/useSystem'
import { useDemandList } from '../../hook/useDemandList'
const route = useRoute()
const optionsStore = useOptionsStore()
const useSystemHook = useSystem()
const { userOptions, systemOptions } = storeToRefs(optionsStore)
const { getFeishuDocument } = useDemandList()
const emits = defineEmits(['ok', 'updateProd', 'update:demand_status', 'update:is_wait'])
const props = defineProps({
	taskRow: {
		type: Object,
		default: () => {
			return {}
		}
	}, // 任务信息
	demandRow: {
		type: Object,
		default: () => {
			return {}
		}
	}, // 需求信息
	userInfo: {
		type: Object,
		default: () => {
			return {}
		}
	},
	demand_status: {
		type: String,
		default: ''
	},
	currentTodo: {
		type: String,
		default: ''
	},
	is_wait: {
		type: Boolean,
		default: false
	},
	isSmall: {
		type: Boolean,
		default: false
	},
	type: {
		type: String,
		default: ''
	}
})
const formRef = ref(null)
const { demandRow: demandInfo, taskRow: taskInfo } = toRefs(props)
const dialogVisible = ref(false)
const entryFormColumns = ref([])
const entryFormData = reactive({
	demand_type: null,
	system: null,
	demand_process: null,
	demand_process_result: null,
	demand_status: null,
	prd_status: null,
	deadline_time: null,
	demand_name: null,
	demand_content: null,
	demand_assignee_uid: null,
	doc_url: null,
	demand_description: null,
	prd_url: null,
	workflow_feedback: null,
	demand_detail: null,
	task_content: null
})
const specialFormData = reactive({
	special_type: null,
	back_user_id: null,
	front_user_id: null
})
const claimForm = reactive({
	back_user_id: '', // 需求默认的后端用户
	front_user_id: '', // 需求默认的前端用户
	demand_process_result: 'demand_claim_1', //  demand_claim_1/demand_claim_2/demand_claim_3 认领/不认领/转交
	demand_dev_type_name: null, // 前端开发/后端开发
	claim_user_info_uid: null, // 认领人
	claim_user_info_name: '', // 认领人
	option_user_info_uid: null, // 转交人
	option_user_info_name: '' // 转交人
})
// 需求拒绝的状态字典
const rejectStatus = [
	{
		label: '原型审批',
		value: 'process_3_2'
	},
	{
		label: '测试验收',
		value: 'process_6_2'
	},
	{
		label: '正式验收',
		value: 'process_8_2'
	},
	{
		label: '需求人验收',
		value: 'process_9_2'
	}
]
const claimRules = ref({
	option_user_info_uid: [{ required: true, message: '请选择', trigger: 'change' }]
})
const entryRules = computed(() => {
	let detailInfo = demandInfo.value
	return {
		system: [{ required: true, message: '请选择', trigger: 'change' }],
		demand_type: [{ required: true, message: '请选择', trigger: 'change' }],
		prd_status: [{ required: true, message: '请选择', trigger: 'change' }],
		deadline_time: [
			{
				required: entryFormData.prd_status == 1 || detailInfo?.demand_process == 5,
				message: '请选择',
				trigger: 'change'
			}
		],
		prd_url: [{ required: true, message: '请输入', trigger: 'change' }],
		demand_process_result: [{ required: true, message: '请选择', trigger: 'change' }],
		workflow_feedback: [
			{
				required: rejectStatus.map((item) => item.value).includes(entryFormData.demand_process_result),
				message: '请输入',
				trigger: 'change'
			}
		]
	}
})
// // 根据对应的节点生成对应的form
const getEntryFormColumns = () => {
	entryFormColumns.value = defaultFormColumns.value.filter((item) => {
		return item.status?.includes(demandStatus.value)
	})
	console.log(entryFormColumns.value)
}
const disabledDate = (time) => {
	if (dayjs(time.getTime()).format('YYYY-MM-DD') == dayjs().format('YYYY-MM-DD') || time.getTime() > Date.now()) {
		return false
	}
	return true
}
// 节点form组合， status为区分属于哪个节点的form
const defaultFormColumns = ref([
	{
		label: '系统平台',
		prop: 'system',
		formProp: {
			el: 'BokeSelect',
			width: '100%',
			source: systemOptions.value,
			clearable: true
		},
		status: ['需求对接']
	},
	{
		label: '需求类型',
		prop: 'demand_type',
		formProp: {
			el: ElSelect,
			childEl: ElOption,
			width: '100%',
			source: demandTypeDict,
			clearable: true
		},
		status: ['需求对接']
	},
	{
		label: '是否需要原型',
		prop: 'prd_status',
		formProp: {
			el: ElSelect,
			childEl: ElOption,
			source: [
				{ label: '是', value: 1 },
				{ label: '否', value: 2 }
			],
			clearable: true,
			width: '100%',
			onChange() {
				// 原型选中是时,则原型时间出现
				if (entryFormData.prd_status == 1) {
					for (let i of defaultFormColumns.value) {
						if (i?.prop == 'deadline_time') {
							i.hidden = false
							break
						}
					}
				} else {
					entryFormData.deadline_time = null
					for (let i of defaultFormColumns.value) {
						if (i?.prop == 'deadline_time') {
							i.hidden = true
							break
						}
					}
				}
				getEntryFormColumns()
			}
		},
		status: ['需求对接']
	},
	{
		label: '原型预计完成时间',
		prop: 'deadline_time',
		formProp: {
			width: '100%',
			el: ElDatePicker,
			type: 'date',
			// shortcuts: timeShortcuts,
			'value-format': 'YYYY-MM-DD',
			'disabled-date': disabledDate
		},
		status: ['需求对接'],

		hidden: true
	},
	{
		label: '需求名称',
		prop: 'demand_name',
		formProp: {
			width: '100%',
			el: ElInput,
			placeholder: '请输入需求名称',
			clearable: true
		},
		status: ['需求对接']
	},
	{
		label: '需求内容',
		prop: 'demand_content',
		formProp: {
			el: ElInput,
			type: 'textarea',
			autosize: { minRows: 2 },
			width: '100%',
			clearable: true,
			placeholder: '请输入需求需求内容'
		},
		status: ['需求对接']
	},
	{
		label: '需求人',
		prop: 'demand_assignee_uid',
		formProp: {
			el: 'BokeSelect',
			childEl: ElOption,
			width: '100%',
			filterable: true,
			source: userOptions.value,
			clearable: true
		},
		status: ['需求对接']
	},
	{
		label: '需求文档地址',
		prop: 'doc_url',
		formProp: {
			el: ElInput,
			width: '100%',
			placeholder: '请输入需求文档地址',
			clearable: true,
			slot: 'formDoc'
		},
		status: ['需求对接']
	},
	{
		label: '需求备注信息',
		prop: 'demand_description',
		formProp: {
			el: ElInput,
			width: '100%',
			type: 'textarea',
			autosize: { minRows: 2 },
			clearable: true,
			placeholder: '请输入需求备注信息'
		},
		status: ['需求对接']
	},
	{
		label: '原型设计地址',
		prop: 'prd_url',
		formProp: {
			el: ElInput,
			width: '100%',
			placeholder: '请输入原型设计地址',
			clearable: true
		},
		status: ['完成设计']
	},
	{
		label: '原型审批',
		prop: 'demand_process_result',
		formProp: {
			el: ElSelect,
			childEl: ElOption,
			source: [
				{ label: '通过', value: 'process_3_1' },
				{ label: '拒绝', value: 'process_3_2' }
			],
			clearable: true,
			width: '100%'
		},
		status: ['原型审批']
	},
	{
		label: '审批理由',
		prop: 'workflow_feedback',
		formProp: {
			el: ElInput,
			width: '100%',
			type: 'textarea',
			autosize: { minRows: 2 },
			clearable: true,
			placeholder: '请输入审批理由'
		},
		status: ['原型审批']
	},
	{
		label: '任务内容',
		prop: 'task_content',
		formProp: {
			el: ElInput,
			width: '100%',
			type: 'textarea',
			autosize: { minRows: 2 },
			clearable: true,
			placeholder: '请输入任务内容'
		},
		status: ['开发信息填写']
	},
	{
		label: '预期时间',
		prop: 'deadline_time',
		formProp: {
			width: '100%',
			el: ElDatePicker,
			type: 'date',
			// shortcuts: timeShortcuts,
			'value-format': 'YYYY-MM-DD',
			'disabled-date': disabledDate
		},
		status: ['开发信息填写']
	},
	{
		label: '测试验收',
		prop: 'demand_process_result',
		formProp: {
			el: ElSelect,
			childEl: ElOption,
			source: [
				{ label: '通过', value: 'process_6_1' },
				{ label: '拒绝', value: 'process_6_2' }
			],
			clearable: true,
			width: '100%'
		},
		status: ['测试验收']
	},
	{
		label: '正式验收',
		prop: 'demand_process_result',
		formProp: {
			el: ElSelect,
			childEl: ElOption,
			source: [
				{ label: '通过', value: 'process_8_1' },
				{ label: '拒绝', value: 'process_8_2' }
			],
			clearable: true,
			width: '100%'
		},
		status: ['正式验收']
	},
	{
		label: '需求人验收',
		prop: 'demand_process_result',
		formProp: {
			el: ElSelect,
			childEl: ElOption,
			source: [
				{ label: '通过', value: 'process_9_1' },
				{ label: '拒绝', value: 'process_9_2' }
			],
			clearable: true,
			width: '100%'
		},
		status: ['需求人验收']
	},
	{
		label: '验收备注',
		prop: 'workflow_feedback',
		formProp: {
			el: ElInput,
			width: '100%',
			type: 'textarea',
			autosize: { minRows: 2 },
			clearable: true,
			placeholder: '请输入验收备注'
		},
		status: ['正式验收', '测试验收', '需求人验收']
	}
])
const doc_url_name = ref('')
// 处理文档地址转文档名称
const changeDoc = () => {
	if (entryFormData.doc_url) {
		getFeishuDocument({ url: entryFormData.doc_url }).then((res) => {
			doc_url_name.value = res?.title
		})
	}
}
// 判断当前处于哪个操作节点
const demandStatus = computed(() => {
	const {
		demand_process = null,
		prd_status = null,
		demand_status = null,
		demand_assignee_uid = null,
		front_status = null,
		back_status = null
	} = demandInfo.value
	const { task_user_id = null, task_process = null, task_status = null, task_type = null } = taskInfo.value
	// const loginUser = 2
	const loginUser = props?.userInfo?.id
	let process_status = ''
	emits('update:is_wait', false)
	if (demand_process == 0 || demand_process == 1) {
		process_status = '需求对接'
	} else if (demand_process == 2 && prd_status == 1 && demand_status == 1 && task_user_id == loginUser) {
		process_status = '完成设计'
	} else if (demand_process == 3 && prd_status == 1 && demand_status == 1 && demand_assignee_uid == loginUser) {
		process_status = '原型审批'
	} else if (
		demand_process == 4 &&
		demand_status == 1 &&
		props.type == 'demand' &&
		([0].includes(front_status) || [0].includes(back_status))
	) {
		// demand_process == 4 && [0].includes(front_status) && [0].includes(back_status)
		process_status = '需求认领'
	} else if (
		[1, 2].includes(front_status) &&
		[1, 2].includes(back_status) &&
		demand_process == 5 &&
		task_process == 4 &&
		task_user_id == loginUser
	) {
		process_status = '开发信息填写'
	} else if (
		[1, 2].includes(front_status) &&
		[1, 2].includes(back_status) &&
		demand_process == 5 &&
		task_process == 5 &&
		task_status == 1 &&
		task_user_id == loginUser
	) {
		process_status = '完成开发'
	}
	// 分别判断开发合产品的状态
	else if (
		((demand_process == 6 && task_process == 5) ||
			(task_process == 2 && task_status == 2 && task_type == 4 && demand_process == 6)) &&
		task_user_id == loginUser
	) {
		process_status = '测试验收'
	} else if (demand_process == 7 && task_process == 6 && [1, 2].includes(task_type) && task_user_id == loginUser) {
		process_status = '更新正式'
	} else if (
		demand_process == 8 &&
		(task_process == 7 || (task_process == 6 && task_type == 4)) &&
		task_user_id == loginUser
	) {
		process_status = '正式验收'
	} else if (demand_process == 9 && demand_status == 1 && demand_assignee_uid == loginUser) {
		process_status = '需求人验收'
	} else if (demand_process == 10) {
		process_status = '需求完成-符合预期'
	} else if (demand_process == 11) {
		process_status = '需求完成-不符合预期'
	} else {
		process_status = props.currentTodo
		emits('update:is_wait', true)
	}
	emits('update:demand_status', process_status)
	return process_status
})
watch(
	() => demandStatus.value,
	() => {
		getEntryFormColumns()
	},
	{
		immediate: true
	}
)
// 是否是开发者
const isDeveloper = computed(() => {
	const keys = optionsStore.devOptions.map((item) => item.value)
	return keys?.includes(props?.userInfo?.id)
})
// 处理请求的数据
const updateDemandWorkflow = async () => {
	let params = {}
	const { prd_status, deadline_time, prd_url, demand_process_result, workflow_feedback, task_content, ...others } =
		entryFormData
	const publicParams = {
		id: demandInfo.value?.id
	}
	const task_id = taskInfo.value?.id
	switch (demandStatus.value) {
		case '需求对接':
			params = {
				...others,
				demand_process: 1,
				demand_process_result: 'process_1_1',
				demand_status: 1,
				prd_status,
				deadline_time,
				special_type: specialFormData.special_type ? 1 : null, // 特殊流程 1:快速选择开发人员 2:退出需求 3:转交其他开发者
				back_user_id: specialFormData.back_user_id || null,
				front_user_id: specialFormData.front_user_id || null
			}
			break
		case '完成设计':
			params = {
				task_id,
				demand_process: 2,
				demand_status: 2,
				prd_url
			}
			break
		case '原型审批':
			params = {
				task_id,
				demand_process: 3,
				demand_process_result,
				workflow_feedback
			}
			break
		case '需求认领':
			claimForm.option_user_info_name =
				optionsStore.devOptions.find((item) => item.value == claimForm.option_user_info_uid)?.label || ''
			if (claimForm.demand_process_result == 'demand_claim_3' && !claimForm.option_user_info_uid) {
				return message.error('请选择转交人')
			}
			params = {
				demand_process: 4,
				...claimForm
			}
			break
		case '开发信息填写':
			params = {
				task_id,
				demand_process: 5,
				demand_status: 1,
				task_content,
				deadline_time
			}
			break
		case '完成开发':
			params = {
				task_id,
				demand_process: 5,
				demand_status: 2
			}
			break
		case '测试验收':
			params = {
				task_id,
				demand_process: 6,
				demand_process_result,
				workflow_feedback
			}
			break
		case '更新正式':
			params = {
				demand_process_value: 'process_7_0',
				task_id
			}
			break
		case '正式验收':
			params = {
				task_id,
				demand_process: 8,
				demand_process_result,
				workflow_feedback
			}
			break
		case '需求人验收':
			params = {
				demand_process: 9,
				demand_process_result,
				workflow_feedback
			}
			break
		default:
			break
	}
	sendData({
		...publicParams,
		...params
	})
}
// 发送请求
const sendData = async (value, close = false) => {
	let api = updateDemandWorkflowApi
	if (specialFormData.special_type) {
		api = updateDemandSpecialApi
	}
	try {
		await api(value, true)
		if (!close) {
			message.success('操作成功')
			handleReset()
			emits('ok')
		}
	} catch (error) {
		console.log(error)
	}
}
// 验证信息
const handleSubmit = async () => {
	try {
		const val = await formRef.value?.form.validate()
		if (!val) return
		updateDemandWorkflow()
	} catch (error) {
		console.log(error)
	}
}
// 提示
const handleAction = () => {
	if (demandStatus.value == '更新正式') {
		emits('updateProd', {
			id: taskInfo.value?.id,
			task_type: taskInfo.value?.task_type,
			system: demandInfo.value?.system,
			task_process: taskInfo.value?.task_process
		})
	} else if (demandStatus.value == '需求认领') {
		confirm(demandStatus.value + '中，请在飞书卡片上操作', 'warning')
			.then()
			.catch((err) => {
				console.log(err)
			})
	}
	if (demandStatus.value == '完成开发') {
		updateDemandWorkflow()
	}
}
// 初始化默认值
const initData = () => {
	// 来自进度的操作不许初始化值
	let detailinfo = demandInfo.value
	const { demand_process, demand_name, demand_content, demand_assignee_uid, doc_url, demand_description } = detailinfo
	entryFormData.task_content = demand_content
	entryFormData.demand_name = demand_name
	entryFormData.demand_content = demand_content
	entryFormData.demand_assignee_uid = demand_assignee_uid
	entryFormData.doc_url = doc_url
	entryFormData.demand_description = demand_description
	changeDoc()
	if (demand_process == 0) {
		sendData(
			{
				id: detailinfo?.id,
				demand_process: 1,
				demand_process_result: 'process_1_0'
			},
			true
		)
	}
	// 解决需求对接时，动态表单生成过早，导致字典没有绑定上的问题
	if (demandStatus.value == '需求对接') {
		entryFormColumns.value.forEach((item) => {
			if (item.prop == 'demand_assignee_uid') {
				item.formProp.source = userOptions.value
			}
		})
		console.log(999, entryFormColumns.value)
	}
}
// 需求认领自动填写默认系统开发人
const setDefaultClaim = () => {
	const activeId = props?.userInfo?.id
	if (demandInfo.value?.front_status == 0 && demandInfo.value.claim_user_info?.front_type == activeId) {
		claimForm.demand_dev_type_name = '前端开发'
	}
	if (demandInfo.value?.back_status == 0 && demandInfo.value.claim_user_info?.back_type == activeId) {
		claimForm.demand_dev_type_name = '后端开发'
	}
	if (activeId == claimForm.front_user_id || activeId == claimForm.back_user_id) {
		claimForm.claim_user_info_uid = activeId
		claimForm.claim_user_info_name = props?.userInfo?.real_name
	}
}
// 需求认领自动填写前后端
const setClaim = async () => {
	const systemList = await useSystemHook.getRepository(props.demandRow?.system)
	claimForm.front_user_id = systemList.find((item) => item.repository_type === 1)?.developer
	claimForm.back_user_id = systemList.find((item) => item.repository_type === 2)?.developer
	setDefaultClaim()
	claimForm.demand_process_result = 'demand_claim_1'
}
// 后端要求不管啥类型都要传claim_user_info_uid，所以这里增加一下
const changeClaim = () => {
	setDefaultClaim()
}
// 设置开发者默认值
const setDevper = async () => {
	if (!specialFormData.special_type) {
		return
	}
	const systemList = await useSystemHook.getRepository(entryFormData.system)
	specialFormData.front_user_id = systemList.find((item) => item.repository_type === 1)?.developer
	specialFormData.back_user_id = systemList.find((item) => item.repository_type === 2)?.developer
}
const demandClick = async () => {
	try {
		if (demandStatus.value == '需求对接' && demandInfo.value?.demand_process == 0) {
			await confirm('确定进入需求对接流程？')
		}
		dialogVisible.value = true
	} catch (error) {
		console.log(error)
	}
}

const handleOpen = async () => {
	optionsStore.getSystemOptions()
	await optionsStore.getUserOptions()
	await optionsStore.getDevOptions()
	initData()
	getEntryFormColumns()
	setDevper()
	setClaim()
}
const handleReset = () => {
	formRef.value?.form.resetFields()
	dialogVisible.value = false
}

const showReject = () => {
	console.log(88, demandStatus.value)
	const timer = setTimeout(() => {
		rejectStatus.forEach((item) => {
			if (item.label == demandStatus.value) {
				dialogVisible.value = true
				entryFormData.demand_process_result = item.value
			}
		})
		clearTimeout(timer)
	}, 500)
}
onMounted(() => {
	optionsStore.getDevOptions()
	console.log(route.query)
	if (route.query.mode == 1) {
		showReject()
	}
})
defineExpose({
	showReject
})
</script>

<style scoped lang="scss">
.detail-info {
	padding-right: 16px;
	max-height: calc(100vh - 220px);
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
