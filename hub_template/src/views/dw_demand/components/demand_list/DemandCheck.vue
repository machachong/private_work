<template>
	<div>
		<boke-button v-if="isMobile" type="primary" @click="openDialog">需求人验收</boke-button>
		<boke-text-button v-else @click="openDialog">需求人验收</boke-text-button>
		<boke-dialog
			class="boke-form-add"
			v-model="visible"
			title="需求人验收"
			width="660px"
			top="10px"
			destroy-on-close
			align-center
			@close="handleClose"
		>
			<el-form ref="formRef" :model="form" label-width="100px" :rules="formRules">
				<el-form-item label="需求人验收" prop="demand_process_result">
					<boke-select v-model="form.demand_process_result" :options="checkDict"></boke-select>
				</el-form-item>
				<el-form-item label="TB需求状态" prop="tb_task_status" v-if="demandRow?.demand_source == 2">
					<boke-select v-model="form.tb_task_status" :options="tb_status_dict"></boke-select>
				</el-form-item>
				<el-form-item label="验收备注" prop="workflow_feedback">
					<el-input
						type="textarea"
						v-model="form.workflow_feedback"
						:source="checkDict"
						:autosize="{ minRows: 4 }"
						clearable
					></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<div style="text-align: right">
					<boke-button @click="handleClose">取消</boke-button>
					<boke-button type="primary" @click="handleSubmit">确定</boke-button>
				</div>
			</template>
		</boke-dialog>
	</div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { updateDemandWorkflowApi } from '@/views/dw_demand/service/demand_api'
import { message } from '@/utils/tools'
import { checkDemandTrack } from '@/views/dw_demand/service/track'
import { useDemand } from '../../hook/useDemand'
import { useUserStore } from '@/stores'

const props = defineProps({
	isMobile: {
		type: Boolean,
		default: false
	},
	demandRow: {
		type: Object,
		default: () => {
			return {}
		}
	}
})
const emits = defineEmits(['reSearch'])

const { getTbTaskStatus, tb_status_dict, getDemandType } = useDemand()
const userStore = useUserStore()
const formRef = ref()
const form = reactive({
	demand_process_result: '',
	workflow_feedback: '',
	tb_task_status: undefined
})
const formRules = computed(() => {
	return {
		demand_process_result: [{ required: true, message: '请选择', trigger: 'change' }],
		tb_task_status: [
			{ required: form.demand_process_result == 'dw_process_9_1', message: '请选择', trigger: 'change' }
		],
		workflow_feedback: [
			{
				required: form.demand_process_result == 'dw_process_9_2',
				message: '请输入',
				trigger: 'change'
			}
		]
	}
})
const visible = ref(false)
const checkDict = computed(() => {
	if (getDemandType.value == 'db') {
		return [
			{ label: '通过', value: 'db_process_9_1' },
			{ label: '拒绝', value: 'db_process_9_2' }
		]
	}
	return [
		{ label: '通过', value: 'dw_process_9_1' },
		{ label: '拒绝', value: 'dw_process_9_2' }
	]
})
const handleOpen = () => {
	openDialog()
	form.demand_process_result = getDemandType.value == 'db' ? 'db_process_9_2' : 'dw_process_9_2'
}
const openDialog = () => {
	visible.value = true
	if (props.demandRow?.demand_source == 2) {
		getTbTaskStatus({
			feishu_user_id: userStore?.userInfo?.union_id,
			tb_task_id: props.demandRow?.tb_task_id,
			status_type: 'end'
		})
	}
}
const handleClose = () => {
	visible.value = false
}
const handleSubmit = async () => {
	try {
		await formRef.value?.validate()
		const params = {
			id: props.demandRow?.id,
			demand_process: 9,
			demand_process_result: form.demand_process_result,
			tb_task_status: form.tb_task_status,
			workflow_feedback: form.workflow_feedback,
			source: 'web' // 后端用于区分web和卡片调用
		}
		await updateDemandWorkflowApi(params, true, false, getDemandType.value)
		message.success('操作成功')
		checkDemandTrack(
			{
				需求名称: props.demandRow?.demand_name
			},
			getDemandType.value
		)
		handleClose()
		emits('reSearch')
	} catch (error) {
		console.log(error)
	}
}
defineExpose({
	handleOpen
})
</script>

<style scoped lang="scss">
:deep(.el-form-item__content) {
	background-color: var(--boke-table-th-bg);
}
</style>
