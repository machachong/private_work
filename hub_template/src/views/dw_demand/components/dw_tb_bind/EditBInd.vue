<template>
	<boke-text-button v-if="isEdit" @click="dialogVisible = true"><slot></slot></boke-text-button>
	<boke-button v-else type="primary" @click="dialogVisible = true"><slot></slot></boke-button>
	<BokeDialog
		:title="isEdit ? '编辑TB项目绑定' : '新增TB项目绑定'"
		v-model:value="dialogVisible"
		width="800px"
		@close="handleReset"
		@open="handleOpen"
	>
		<BokeForm
			ref="formRef"
			formAlign="left"
			label-width="150px"
			class="boke-form-add"
			labelPosition="right"
			label-suffix=":"
			vertical
			:form-data="formData"
			:rules="rules"
			mode="add"
			:dispable="isEdit"
			:columns="formColumns"
		>
		</BokeForm>
		<template #footer>
			<el-row justify="end">
				<el-space>
					<boke-button @click="handleReset">取消</boke-button>
					<BokeButton :loading="SaveLoading" type="primary" @click="handleSubmit(formRef)">确定</BokeButton>
				</el-space>
			</el-row>
		</template>
	</BokeDialog>
</template>

<script setup>
import { getLabel, message } from "@/utils/tools"
import { useUserStore } from "@/stores"
import { addBindApi, updateBindApi, getTbTaskFlowApi, getTbTaskStatusApi } from "@/views/dw_demand/service/dw_tb_bind"
import { addBindTrack, editBindTrack } from "@/views/dw_demand/service/track"

const props = defineProps({
	row: {
		type: Object,
		default: () => {}
	},
	projectList: {
		type: Array,
		default: () => []
	},
	tbProjectList: {
		type: Array,
		default: () => []
	}
})
const emits = defineEmits(["ok"])

const userStore = useUserStore()
const showSave = ref(false)
const SaveLoading = ref(false)
const dialogVisible = ref(false)
const formData = reactive({
	project_id: "",
	tb_project_id: "",
	end_status_id: "",
	tb_task_flow_id: ""
})
const options = reactive({
	tb_status_dict: [], // tb状态
	tb_workflow_list: [] // tb工作流
})
const rules = ref({
	project_id: [{ required: true, message: "请输入", trigger: "change" }],
	tb_project_id: [{ required: true, message: "请输入", trigger: "change" }],
	tb_task_flow_id: [{ required: true, message: "请输入", trigger: "change" }],
	end_status_id: [{ required: true, message: "请输入", trigger: "change" }]
})
const formRef = ref(null)
const formColumns = computed(() => [
	{
		label: "项目列表",
		prop: "project_id",
		formProp: {
			el: "BokeSelect",
			filterable: true,
			width: "100%",
			options: props.projectList,
			clearable: true
		}
	},
	{
		label: "空间列表",
		prop: "tb_project_id",
		formProp: {
			el: "BokeSelect",
			filterable: true,
			width: "100%",
			options: props.tbProjectList,
			isImg: true,
			isDesc: true,
			itemImg: "logo_url",
			itemDesc: "tb_project_id",
			clearable: true,
			onChange: () => {
				changeProject()
			}
		}
	},
	{
		label: "TB工作流",
		prop: "tb_task_flow_id",
		formProp: {
			el: "BokeSelect",
			filterable: true,
			width: "100%",
			options: options.tb_workflow_list,
			clearable: true,
			onChange: () => {
				changeWorkflow()
			}
		}
	},
	{
		label: "结束状态",
		prop: "end_status_id",
		formProp: {
			el: "BokeSelect",
			filterable: true,
			width: "100%",
			options: options.tb_status_dict,
			clearable: true
		}
	}
])
const isEdit = computed(() => {
	return !!props.row?.id
})
// 保存信息
const handleSubmit = async () => {
	console.log(formRef.value)
	const Api = isEdit.value ? updateBindApi : addBindApi
	try {
		const val = await formRef.value?.form.validate()
		if (!val) return false
		SaveLoading.value = true
		await Api({
			...formData,
			end_status_name: getLabel(options.tb_status_dict, formData.end_status_id),
			id: isEdit.value ? props.row?.id : undefined
		})
		SaveLoading.value = false
		message.success(isEdit.value ? "更新成功" : "新增成功")
		if (isEdit.value) {
			editBindTrack()
		} else {
			addBindTrack()
		}
		handleReset()
		emits("ok")
	} catch (error) {
		console.log(error)
		SaveLoading.value = false
	}
}
const handleReset = async () => {
	formRef.value?.form.resetFields()
	dialogVisible.value = false
}
const changeProject = async () => {
	if (formData.tb_project_id) {
		const res = await getTbTaskFlowApi({ tb_project_id: formData.tb_project_id })
		console.log(res)
		options.tb_workflow_list = res.items?.map((item) => {
			return {
				...item,
				label: item.name,
				value: item.id
			}
		})
	} else {
		options.tb_workflow_list = []
		formData.tb_task_flow_id = ""
		formData.end_status_id = ""
	}
}
const changeWorkflow = async () => {
	if (formData.tb_task_flow_id) {
		const res = await getTbTaskStatusApi({
			tb_project_id: formData.tb_project_id,
			tb_task_flow_id: formData.tb_task_flow_id,
			feishu_user_id: userStore?.userInfo?.union_id
		})
		console.log(res)
		options.tb_status_dict = res.items?.map((item) => {
			return {
				...item,
				label: item.name,
				value: item.id
			}
		})
	} else {
		options.tb_status_dict = []
		formData.end_status_id = ""
	}
}
const handleOpen = () => {
	userStore.getUserInfo()
	if (isEdit.value) {
		showSave.value = true
		const { project_id, tb_project_id, tb_task_flow_id, end_status_id } = props.row
		formData.project_id = project_id
		formData.tb_project_id = tb_project_id
		formData.tb_task_flow_id = tb_task_flow_id
		formData.end_status_id = end_status_id
		changeProject()
		changeWorkflow()
	}
}
</script>

<style scoped lang="scss">
.detail-info {
	border-right: 1px solid var(--boke-color-border-divider);
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
	max-height: calc(100vh - 220px);
	overflow-y: auto;
	.plan-list {
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
}
</style>
