<template>
	<div>
		<boke-text-button @click="handleOpen" class="m-r-10">绑定DS任务</boke-text-button>
		<boke-dialog
			v-model="visible"
			title="绑定DS任务"
			width="660px"
			top="10px"
			destroy-on-close
			align-center
			@close="handleClose"
		>
			<el-form :model="form" :rules="rules" ref="formRef" labelWidth="100px">
				<el-form-item label="DS实例" prop="asset_item_id">
					<boke-select
						v-model="form.asset_item_id"
						:options="ds_instance"
						clearable
						@change="changeInstance"
					></boke-select>
				</el-form-item>
				<el-form-item label="DS项目空间" prop="ds_project_code">
					<boke-select
						v-model="form.ds_project_code"
						:options="options.projectList"
						placeholder="请选择"
						clearable
						@change="changeSpace"
						@focus="getDsDict(1)"
					></boke-select>
				</el-form-item>
				<el-form-item label="DS工作流" prop="ds_task_code">
					<boke-select
						v-model="form.ds_task_code"
						:options="options.workflowList"
						multiple
						placeholder="请选择"
						clearable
						@focus="getDsDict(2)"
					></boke-select>
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
import { getDSworkflowListApi, getDsProjectListApi } from '@/views/dw_demand/service/task_api'
import { message } from '@/utils/tools'
const props = defineProps({
	project_id: {
		type: [Number, String],
		default: ''
	},
	taskRow: {
		type: Object,
		default: () => {
			return undefined
		}
	},
	dsList: {
		type: Array,
		default: () => []
	},
	ds_instance: {
		type: Array,
		default: () => []
	}
})
const emits = defineEmits(['ok'])
const visible = ref(false)
const form = ref({
	ds_project_code: '',
	asset_item_id: '',
	ds_task_code: []
})
const formRef = ref()
const rules = {
	ds_project_code: [{ required: true, message: '请输入', trigger: 'change' }],
	ds_task_code: [{ required: true, message: '请选择', trigger: 'change' }],
	asset_item_id: [{ required: true, message: '请选择', trigger: 'change' }]
}
const options = reactive({
	projectList: [],
	workflowList: []
})
const getDSworkflowList = async (params) => {
	try {
		const res = await getDSworkflowListApi(params)
		const ds_task_code = props.dsList?.map((item) => item?.code)

		options.workflowList = res.items?.map((item) => {
			// 同一个需求，ds任务只能选一次
			return {
				...item,
				disabled: ds_task_code?.includes(item.code),
				value: item.code,
				label: item.name
			}
		})
	} catch (error) {
		console.log(error)
	}
}
const getDsProjectList = async (asset_item_id) => {
	try {
		const res = await getDsProjectListApi({
			project_id: props.project_id,
			asset_item_id
		})
		options.projectList = res.items?.map((item) => {
			return {
				...item,
				value: item.ds_project_code,
				label: item.ds_project_name
			}
		})
	} catch (error) {
		console.log(error)
	}
}
const changeInstance = async () => {
	console.log(form.value.asset_item_id)
	if (form.value.asset_item_id) {
		getDsProjectList(form.value.asset_item_id)
	} else {
		options.projectList = []
		form.value.ds_project_code = ''
	}
}
const changeSpace = () => {
	if (!form.value.asset_item_id) {
		message.error('请先选择DS实例')
	}
	if (form.value.ds_project_code) {
		getDSworkflowList({
			asset_item_id: form.value.asset_item_id,
			ds_project_code: form.value.ds_project_code
		})
	} else {
		options.workflowList = []
		form.value.ds_task_code = []
	}
}
const getDsDict = (type) => {
	console.log(type, form.value.asset_item_id)
	if (type == 1 && options.projectList?.length == 0) {
		return message.error('当前实例下没有DS项目空间')
	}
	if (type == 1 && !form.value.asset_item_id) {
		return message.error('请先选择DS实例')
	}
	if (type == 2 && !form.value.ds_project_code) {
		return message.error('请先选择DS项目空间')
	}
}
const handleOpen = () => {
	visible.value = true
	if (props.ds_instance?.length >= 1) {
		form.value.asset_item_id = props.ds_instance[0]?.value
		changeInstance()
	}
}
const handleClose = () => {
	visible.value = false
}
const handleReset = () => {
	formRef.value?.resetFields()
	visible.value = false
}
const handleSubmit = () => {
	formRef.value
		?.validate()
		.then((res) => {
			if (res) {
				const { ds_task_code, ds_project_code, asset_item_id } = form.value
				emits('ok', {
					ds_task_code: ds_task_code?.join(','),
					ds_project_code,
					asset_item_id
				})
			}
		})
		.catch((err) => {
			console.log(err)
		})
}
defineExpose({
	handleReset
})
</script>

<style scoped lang="scss"></style>
