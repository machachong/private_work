<template>
	<boke-text-button
		v-track-permission="{
			name: 'systemEdit',
			description: '系统编辑',
			permission_id: 12010104,
			behavior: 'edit'
		}"
		v-if="isEdit"
		@click="dialogVisible = true"
		><slot></slot
	></boke-text-button>
	<boke-button
		v-track-permission="{
			name: 'systemAdd',
			description: '新增系统',
			permission_id: 12010101,
			behavior: 'add'
		}"
		v-else
		type="primary"
		@click="dialogVisible = true"
		><slot></slot
	></boke-button>
	<BokeDialog
		title="新增系统"
		v-model:value="dialogVisible"
		width="1000px"
		top="50px"
		@open="handleOpen"
		@close="reset"
	>
		<BokeForm
			ref="formRef"
			formAlign="left"
			label-width="140px"
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
		<boke-tabs
			style="padding: 0 0 10px 40px"
			v-model:active="activeTabs"
			:tabs="tabs"
			size="small"
			noUrlChange
		></boke-tabs>
		<BokeForm
			v-show="activeTabs === 1"
			ref="frontFormRef"
			formAlign="left"
			label-width="140px"
			labelPosition="right"
			label-suffix=":"
			:form-data="frontFormData"
			:rules="frontRules"
			:dispable="isEdit"
			:columns="frontFormColumns"
		>
		</BokeForm>
		<BokeForm
			v-show="activeTabs === 2"
			ref="backFormRef"
			formAlign="left"
			label-width="140px"
			labelPosition="right"
			label-suffix=":"
			vertical
			:form-data="backFormData"
			:rules="backRules"
			mode="add"
			:dispable="isEdit"
			:columns="frontFormColumns"
		>
		</BokeForm>
		<template #footer>
			<el-row justify="end">
				<el-space>
					<boke-button @click="reset">取消</boke-button>
					<BokeButton type="primary" @click="handleSubmit(formRef)">保存</BokeButton>
				</el-space>
			</el-row>
		</template>
	</BokeDialog>
</template>

<script setup>
import { addRepositoryApi, editRepositoryApi, addSystemListApi, editSystemListApi } from '../service/system_api'
import { message, setDefalut } from '@/utils/tools'
import { useOptionsStore } from '@/stores'
import { useSystem } from '../hook/useSystem'
const tabs = [
	{
		name: 1,
		label: '前端仓库'
	},
	{
		name: 2,
		label: '后端仓库'
	}
]
const useSystemHook = useSystem()
const optionsStore = useOptionsStore()
const props = defineProps({
	row: {
		type: Object,
		default: () => {
			return {}
		}
	}
})
const emits = defineEmits(['ok'])
const editInfo = ref()
const repositoryList = ref([]) // 仓库列表，如果有仓库，则请求为put，如果没有则为Post
const activeTabs = ref(1)
const dialogVisible = ref(false)
const formData = reactive({
	system_id: null,
	system_name: null,
	prod_url: null,
	test_url: null,
	description: null,
	is_show_auth: true
})
const frontFormData = reactive({
	id: null,
	repository_name: '',
	repository_url: '',
	developer: null,
	repository_type: 1,
	prod_branch: '',
	test_branch: '',
	prod_server: '',
	system_path: '',
	description: ''
})
const backFormData = reactive({
	id: null,
	repository_name: '',
	repository_url: '',
	developer: null,
	repository_type: 2,
	prod_branch: '',
	test_branch: '',
	prod_server: '',
	system_path: '',
	description: ''
})
const formRef = ref(null)
const frontFormRef = ref(null)
const backFormRef = ref(null)
const rules = ref({
	system_id: [{ required: true, message: '请输入', trigger: 'blur' }],
	system_name: [{ required: true, message: '请输入', trigger: 'blur' }]
})
const frontRules = ref({
	repository_name: [{ required: true, message: '请输入', trigger: 'blur' }],
	repository_url: [{ required: true, message: '请输入', trigger: 'blur' }],
	developer: [{ required: true, message: '请选择', trigger: 'change' }],
	prod_branch: [{ required: true, message: '请选择', trigger: 'blur' }],
	test_branch: [{ required: true, message: '请选择', trigger: 'blur' }]
})
const backRules = ref({
	repository_name: [{ required: true, message: '请输入', trigger: 'blur' }],
	repository_url: [{ required: true, message: '请输入', trigger: 'blur' }],
	developer: [{ required: true, message: '请选择', trigger: 'change' }],
	prod_branch: [{ required: true, message: '请选择', trigger: 'blur' }],
	test_branch: [{ required: true, message: '请选择', trigger: 'blur' }]
})
const formColumns = computed(() => {
	return [
		{
			label: '系统ID',
			prop: 'system_id',
			formProp: {
				el: ElInput,
				width: '100%',
				clearable: true,
				placeholder: '请输入',
				disabled: isEdit.value
			}
		},
		{
			label: '系统名称',
			prop: 'system_name',
			formProp: {
				el: ElInput,
				width: '100%',
				clearable: true,
				placeholder: '请输入'
			}
		},
		{
			label: '正式环境地址',
			prop: 'prod_url',
			formProp: {
				el: ElInput,
				width: '100%',
				clearable: true,
				placeholder: '请输入'
			}
		},
		{
			label: '测试环境地址',
			prop: 'test_url',
			formProp: {
				el: ElInput,
				width: '100%',
				clearable: true,
				placeholder: '请输入'
			}
		},
		{
			label: '描述信息',
			prop: 'description',
			formProp: {
				el: ElInput,
				type: 'textarea',
				autosize: { minRows: 2 },
				width: '100%',
				clearable: true,
				placeholder: '请输入用途说明'
			}
		},
		{
			label: '是否配置权限',
			prop: 'is_show_auth',
			formProp: {
				el: ElSwitch,
				width: '100%'
			}
		}
	]
})
const frontFormColumns = computed(() => {
	return [
		{
			label: '仓库名称',
			prop: 'repository_name',
			formProp: {
				el: ElInput,
				width: '100%',
				clearable: true,
				placeholder: '请输入'
			}
		},

		{
			label: '仓库地址',
			prop: 'repository_url',
			formProp: {
				el: ElInput,
				width: '100%',
				clearable: true,
				placeholder: '请输入'
			}
		},
		{
			label: '负责人员',
			prop: 'developer',
			formProp: {
				el: ElSelect,
				filterable: true,
				width: '100%',
				childEl: ElOption,
				source: optionsStore.devOptions,
				clearable: true
			}
		},
		{
			label: '正式分支',
			prop: 'prod_branch',
			formProp: {
				el: ElInput,
				width: '100%',
				clearable: true,
				placeholder: '请输入'
			}
		},
		{
			label: '测试分支',
			prop: 'test_branch',
			formProp: {
				el: ElInput,
				width: '100%',
				clearable: true,
				placeholder: '请输入'
			}
		},
		{
			label: '部署服务器',
			prop: 'prod_server',
			formProp: {
				el: ElInput,
				width: '100%',
				clearable: true,
				placeholder: '请输入'
			}
		},
		{
			label: '部署路径',
			prop: 'system_path',
			formProp: {
				el: ElInput,
				width: '100%',
				clearable: true,
				placeholder: '请输入'
			}
		},
		{
			label: '描述信息',
			prop: 'description',
			formProp: {
				el: ElInput,
				type: 'textarea',
				autosize: { minRows: 2 },
				width: '100%',
				clearable: true,
				placeholder: '请输入描述信息'
			}
		}
	]
})
const isEdit = computed(() => {
	return props.row?.system_id || props.row?.system_id === 0 ? true : false
})
const handleSubmit = async () => {
	console.log(formRef.value)
	try {
		const validates = [
			formRef.value?.form.validate(),
			frontFormRef.value?.form.validate(),
			backFormRef.value?.form.validate()
		]
		const results = await Promise.allSettled(validates)
		console.log(results)
		if (results[1].status == 'rejected') {
			activeTabs.value = 1
			return
		}
		if (results[2].status == 'rejected') {
			activeTabs.value = 2
			return
		}
		const finaly =
			results[0].status == 'fulfilled' && results[1].status === 'fulfilled' && results[2].status === 'fulfilled'
		if (!finaly) return
		await submitSystem()
		await submitGitlab()
		message.success(isEdit.value ? '更新成功' : '新增成功')
		reset()
		emits('ok')
	} catch (error) {
		console.log(error)
	}
}
// 提交系统信息
const submitSystem = () => {
	console.log(isEdit.value)
	const Api = isEdit.value ? editSystemListApi : addSystemListApi
	console.log(addSystemListApi)
	return Api({ ...formData })
}
// 提交仓库信息，分两次，一次前端，一次后端
const submitGitlab = async () => {
	const Api = repositoryList.value.length ? editRepositoryApi : addRepositoryApi
	Promise.all([
		Api({
			...frontFormData,
			system: formData.system_id
		}),
		Api({
			...backFormData,
			system: formData.system_id
		})
	])
		.then((res) => {
			console.log(res)
			return Promise.resolve(res)
		})
		.catch((err) => {
			console.log(err)
			return Promise.reject(err)
		})
}
const handleOpen = async () => {
	if (props.row?.system_id) {
		editInfo.value = props.row
		const { system_id } = props.row
		setDefalut(props.row, formData)
		const res = await useSystemHook.getRepository(system_id)
		repositoryList.value = res
		res?.forEach((item) => {
			if (item.repository_type == 1) {
				setDefalut(item, frontFormData)
			} else {
				setDefalut(item, backFormData)
			}
		})
	}
	optionsStore.getDevOptions()
}
const reset = () => {
	console.log(formRef.value?.form)
	formRef.value?.form?.resetFields()
	frontFormRef.value?.form?.resetFields()
	backFormRef.value?.form?.resetFields()
	dialogVisible.value = false
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
