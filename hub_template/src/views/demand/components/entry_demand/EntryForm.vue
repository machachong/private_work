<template>
	<section class="p-l-20 entry-form">
		<BokeForm
			ref="formRef"
			formAlign="left"
			label-width="110px"
			class="boke-form-add"
			labelPosition="top"
			label-suffix=":"
			vertical
			:form-data="formData"
			:rules="rules"
			mode="add"
			:columns="formColumns"
		>
			<template #formDoc>
				<div v-if="doc_url_name" style="padding-left: 10px; width: 100%" @click.stop="doc_url_name = ''">
					<boke-text-button>
						<a :href="formData.doc_url" :title="doc_url_name" target="_blank">{{ doc_url_name }}</a>
					</boke-text-button>
				</div>
				<el-input
					v-else
					v-model="formData.doc_url"
					@blur="changeDoc"
					clearable
					:disabled="demandIsEnd"
					placeholder="请输入需求文档地址"
				>
				</el-input>
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
			<template #formUpload>
				<BokeUpload
					v-model:value="formData.attach_img"
					:drag="true"
					:disabled="demandIsEnd"
					tipText="支持粘贴,拖拽上传"
				></BokeUpload>
			</template>
			<template #formItem>
				<section v-if="!!demandRow?.prd_url">
					<div class="prd-name">原型URL:</div>
					<div class="prd-bg">
						<boke-text-button>
							<a :href="demandRow?.prd_url" :title="demandRow?.prd_url" target="_blank">{{ prd_url_name }}</a>
						</boke-text-button>
					</div>
				</section>
			</template>
			<template #formSource>
				<el-tree-select
					check-strictly
					style="width: 100%"
					clearable
					:render-after-expand="false"
					v-model="formData.menu_source"
					:data="options.menuSource"
				/>
			</template>
		</BokeForm>
		<boke-list label-position="top" label="需求状态" v-if="demandInfo?.demand_status">{{
			getLabel(demandStatusDict, demandInfo?.demand_status)
		}}</boke-list>
		<boke-list label-position="top" label="预期时间" v-if="demandInfo?.deadline_time">{{
			taskInfo?.deadline_time || demandInfo?.deadline_time
		}}</boke-list>
		<!-- <div class="show-more">
			<boke-text-button>
				<el-space v-show="!showMore" @click="showMore = true">
					展开更多配置<el-icon class="rotate-90"><DArrowRight /></el-icon>
				</el-space>
				<el-space v-show="showMore" @click="showMore = false">
					收起<el-icon class="rotate-90"><DArrowLeft /></el-icon>
				</el-space>
			</boke-text-button>
		</div> -->
		<el-row justify="center" class="p-t-20 fix-bottom" v-if="!demandIsEnd && !readonly">
			<BokeButton :disabled="editStatus" width="120px" type="primary" @click="handleSubmit(formRef)">提交</BokeButton>
		</el-row>
	</section>
</template>

<script setup>
// import { DArrowRight, DArrowLeft } from "@element-plus/icons-vue"
import { ElInput, ElSelect } from 'element-plus'
import { storeToRefs } from 'pinia'
import { demandTypeDict, demandStatusDict, demandScaleDict, demandSourceDict } from '@/views/demand/service/config'
import { useOptionsStore, useUserStore } from '@/stores'
import { addPool, updatePool } from '@/views/demand/service/demand_api'
import { uploadFile } from '@/api/publicApi'
import { message, getLabel } from '@/utils/tools'
import { useDemandList } from '../../hook/useDemandList'
import tracker from '@/utils/tracking'
import settings from '@/utils/config/settings'
import { useMilestone } from '@/views/milestone/service/useMilestone'
const optionsStore = useOptionsStore()
const route = useRoute()
const userStore = useUserStore()
const { milestoneNodeList, getMilestoneNodeList, cascaderProps } = useMilestone()
const { getFeishuDocument, getMenuSource } = useDemandList()
const { userOptions, systemOptions } = storeToRefs(optionsStore)
const props = defineProps({
	mobile: {
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
	isEdit: {
		type: Boolean,
		default: false
	},
	readonly: {
		type: Boolean,
		default: false
	}
})
const { isEdit, readonly } = toRefs(props)
const emits = defineEmits(['ok'])
const formData = reactive({
	demand_name: '',
	system: -1,
	menu_source: '',
	demand_type: 0,
	demand_scale: '',
	demand_assignee_uid: null, // 需求提出人
	demand_content: '',
	attach_img: [],
	doc_url: null,
	demand_description: '',
	demand_creator_uid: userStore.userInfo?.id, // 需求创建人
	demand_creator: userStore.userInfo?.real_name,
	demand_source: 1, // 需求来源： 1. 开发需求 2. 普通需求
	executor_user: [], // 普通需求的需求执行人
	milestone_node: null // 关联里程碑
})
const doc_url_name = ref()
const prd_url_name = ref()
const rules = ref({
	demand_name: [{ required: true, message: '请输入', trigger: 'change' }],
	// system: [{ required: true, message: "请选择", trigger: "change" }],
	executor_user: [{ required: true, message: '请选择', trigger: 'change' }],
	demand_assignee_uid: [{ required: true, message: '请选择', trigger: 'change' }]
})
// const showMore = ref(false)
const formRef = ref(null)
const options = reactive({
	menuSource: []
})
const demandInfo = computed(() => {
	return props.demandRow
})
// 需求完成或者关闭后，不可再修改需求详情
const demandIsEnd = computed(() => {
	console.log(props.demandRow?.demand_process)
	return [10, 11, 12, 20].includes(props.demandRow?.demand_process)
})
const formColumns = computed(() => {
	console.log(!props?.demandRow?.system || props?.demandRow?.system == -1)
	return [
		{
			label: '需求名称',
			prop: 'demand_name',
			formProp: {
				el: ElInput,
				width: '100%',
				clearable: true,
				placeholder: '请输入需求名称',
				disabled: demandIsEnd.value || readonly.value
			}
		},
		{
			label: '系统平台',
			prop: 'system',
			hidden: !props?.demandRow?.system || props?.demandRow?.system == -1,
			formProp: {
				el: 'BokeSelect',
				width: '100%',
				source: systemOptions,
				clearable: true,
				disabled: isEdit.value || readonly.value
			}
		},
		{
			label: '功能菜单',
			prop: 'menu_source',
			hidden: !props.isEdit,
			formProp: {
				el: ElInput,
				type: 'textarea',
				slot: 'formSource',
				autosize: { minRows: 2 },
				width: '100%',
				clearable: true,
				placeholder: '请选择'
			}
		},
		{
			label: '需求类型',
			prop: 'demand_type',
			hidden: !props?.demandRow?.demand_type,
			formProp: {
				el: ElSelect,
				childEl: ElOption,
				width: '100%',
				source: demandTypeDict,
				clearable: true,
				disabled: isEdit.value || readonly.value
			}
		},
		{
			label: '需求规模',
			prop: 'demand_scale',
			hidden: props?.demandRow?.demand_type != 1,
			formProp: {
				el: ElSelect,
				childEl: ElOption,
				width: '100%',
				source: demandScaleDict,
				clearable: true
			}
		},
		{
			label: '需求人',
			prop: 'demand_assignee_uid',
			formProp: {
				el: 'BokeSelect',
				width: '100%',
				source: userOptions,
				clearable: true,
				disabled: isEdit.value || readonly.value
			}
		},
		{
			label: '需求来源',
			prop: 'demand_source',
			hidden: props.isEdit,
			formProp: {
				el: 'BokeSelect',
				width: '100%',
				source: demandSourceDict,
				clearable: true
			}
		},
		{
			label: '执行人',
			prop: 'executor_user',
			hidden: formData.demand_source == 1,
			formProp: {
				el: 'BokeSelect',
				width: '100%',
				multiple: true,
				source: optionsStore.devOptions,
				clearable: true
			}
		},
		{
			label: '关联里程碑',
			prop: 'milestone_node',
			formProp: {
				width: '100%',
				slot: 'form_milestone_node'
			}
		},
		{
			label: '需求内容',
			prop: 'demand_content',
			formProp: {
				el: ElInput,
				type: 'textarea',
				autosize: { minRows: 4 },
				width: '100%',
				clearable: true,
				placeholder: '请输入需求需求内容',
				disabled: demandIsEnd.value || readonly.value
			}
		},
		{
			label: '需求文档地址',
			prop: 'doc_url',
			formProp: {
				el: ElInput,
				width: '100%',
				slot: 'formDoc',
				placeholder: '请输入需求文档地址',
				clearable: true,
				disabled: demandIsEnd.value || readonly.value
			}
		},
		{
			label: '备注',
			prop: 'demand_description',
			formProp: {
				el: ElInput,
				type: 'textarea',
				width: '100%',
				placeholder: '请输入需求文档地址',
				clearable: true,
				disabled: demandIsEnd.value || readonly.value
			}
		},
		{
			label: '附件',
			prop: 'attach_img',
			formProp: {
				clearable: true,
				slot: 'formUpload',
				width: '100%'
			}
		}
	]
})
// 判断当前内容是否有修改
const editStatus = computed(() => {
	if (!isEdit.value) return false
	const obj_key = ['menu_source', 'doc_url', 'demand_content', 'demand_description', 'milestone_node']
	// 特殊处理，附近和执行人要特别进行处理
	if (!props?.demandRow?.attach_img && formData.attach_img?.length > 0) {
		return false
	}
	const imgStr = formData.attach_img?.map((item) => item.response?.data?.items)?.join(',')
	if (!!props?.demandRow?.attach_img && props?.demandRow?.attach_img != imgStr) {
		return false
	}
	console.log(props?.demandRow, formData)

	for (let i of obj_key) {
		console.log(i, (!props?.demandRow?.[i] && !!formData?.[i]) || props?.demandRow?.[i] != formData?.[i])
		if (
			(!props?.demandRow?.[i] && !!formData?.[i]) ||
			(!!props?.demandRow?.[i] && props?.demandRow?.[i] != formData?.[i])
		) {
			return false
		}
	}
	return true
})
const changeDoc = () => {
	if (formData.doc_url) {
		getFeishuDocument({ url: formData.doc_url }).then((res) => {
			doc_url_name.value = res?.title
		})
	}
}
const handleSubmit = async () => {
	try {
		const Api = isEdit.value ? updatePool : addPool
		const val = await formRef.value?.form.validate()
		if (!val) return false
		let attach_img_new = null
		console.log(formData.attach_img)
		if (formData?.attach_img?.length > 0) {
			attach_img_new = formData.attach_img
				.map((item) => {
					return item?.response?.data?.items
				})
				.join(',')
		}
		console.log(formData.executor_user)

		let params = {
			...formData,
			executor_user: formData.executor_user?.join(','),
			attach_img: attach_img_new
		}
		delete params.menu_source
		delete params.demand_scale
		// 编辑才可以提交以下字段
		if (isEdit.value) {
			params.id = props.demandRow?.id
			params.demand_scale = props.demandRow?.demand_scale
			params.menu_source = formData.menu_source
			delete params.demand_source
			tracker.push({
				name: 'editDemand',
				description: '编辑需求',
				behavior: 'edit',
				permission_id: 12020103
			})
		} else {
			tracker.push({
				name: 'demandAdd',
				description: '新增需求',
				permission_id: 12020102,
				behavior: 'add'
			})
		}
		const res = await Api({ ...params }, true)
		console.log(res)
		console.log(formData)
		formData.attach_img = []
		// 2024-5-13 新增成功后置空
		doc_url_name.value = ''
		formRef.value?.form.resetFields()
		if (props.mobile) {
			emits('ok')
		} else {
			message.success(isEdit.value ? '更新成功' : '新增成功')
			emits('ok')
		}
	} catch (error) {
		console.log(error)
	}
}
const upload = async (file) => {
	const formData = new FormData()
	formData.append('file', file)
	const { items = '' } = await uploadFile(formData)
	return items
}
const getPrdName = async (prd_url) => {
	if (prd_url && prd_url.includes('boke.feishu.cn')) {
		getFeishuDocument({ url: prd_url }).then((res) => {
			prd_url_name.value = res?.title
		})
	}
	prd_url_name.value = prd_url
}
const init = () => {
	const propArr = [
		'demand_name',
		'demand_content',
		'demand_type',
		'system',
		'demand_description',
		'doc_url',
		'attach_img',
		'demand_assignee_uid',
		'demand_creator',
		'demand_creator_uid',
		'menu_source',
		'demand_scale',
		'milestone_node',
		'executor_user'
	]
	for (let i of propArr) {
		if (i == 'executor_user') {
			formData.executor_user = props.demandRow?.executor_user?.split(',')
		} else if (i == 'attach_img') {
			if (props.demandRow?.attach_img) {
				formData.attach_img = props.demandRow?.attach_img?.split(',').map((item, index) => {
					return {
						name: '粘贴上传' + index,
						url: settings.API_URL + '/develop_task/demand_pool/attach_img/?attach_img=' + item,
						response: {
							data: {
								items: item
							}
						}
					}
				})
			} else {
				formData.attach_img = []
			}
		} else {
			formData[i] = props.demandRow[i]
		}
	}
	// const {
	// 	demand_name = '',
	// 	demand_content = '',
	// 	demand_type = null,
	// 	system = null,
	// 	demand_description = '',
	// 	doc_url = '',
	// 	attach_img = '',
	// 	demand_assignee_uid = '',
	// 	demand_creator,
	// 	demand_creator_uid,
	// 	menu_source,
	// 	demand_scale,
	// 	milestone_node,
	// 	executor_user
	// } = props.demandRow
	// formData.demand_name = demand_name
	// formData.demand_content = demand_content
	// formData.demand_type = demand_type
	// formData.system = system
	// formData.demand_description = demand_description
	// formData.doc_url = doc_url
	// formData.demand_creator = demand_creator
	// formData.demand_creator_uid = demand_creator_uid
	// formData.menu_source = menu_source
	// formData.demand_scale = demand_scale
	// formData.milestone_node = milestone_node
	// formData.executor_user = executor_user?.split(',')
	// if (attach_img) {
	// 	formData.attach_img = attach_img?.split(',').map((item, index) => {
	// 		return {
	// 			name: '粘贴上传' + index,
	// 			url: settings.API_URL + '/develop_task/demand_pool/attach_img/?attach_img=' + item,
	// 			response: {
	// 				data: {
	// 					items: item
	// 				}
	// 			}
	// 		}
	// 	})
	// } else {
	// 	formData.attach_img = []
	// }
	// formData.demand_assignee_uid = demand_assignee_uid
	changeDoc()
	getPrdName(props?.demandRow?.prd_url)
	getMenuSource(formData.system).then((res) => {
		options.menuSource = res
	})
}
watch(
	() => [props.demandRow, props.taskRow],
	() => {
		if (props.demandRow) {
			init()
		}
	},
	{
		immediate: true,
		deep: true
	}
)
onMounted(() => {
	getMilestoneNodeList()
	optionsStore.getUserOptions()
	optionsStore.getSystemOptions()
	optionsStore.getDevOptions()
	console.log(props.demandRow, props.taskRow)
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
	// 2025-2-28 从里程碑通知卡片进入需求，自动填入里程碑节点
	if (route.query.milestone_node_id) {
		formData.milestone_node = Number(route.query.milestone_node_id)
	}
	// 2025-3-4 从里程碑通知卡片进入需求，自动填入里需求人
	if (route.query?.assignee_user_id) {
		formData.demand_assignee_uid = Number(route.query.assignee_user_id)
	}
	nextTick(() => {
		formRef.value?.form.clearValidate()
	})
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
	width: 100%;
	background-color: var(--boke-table-th-bg);
	margin-bottom: 16px;
	text-indent: 10px;
}
.entry-form {
	padding-bottom: 20px;
	position: relative;
	.fix-bottom {
		position: sticky;
		bottom: 10px;
	}
}
</style>
