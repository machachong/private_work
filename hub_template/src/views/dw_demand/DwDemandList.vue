<template>
	<section class="dw-demand">
		<!-- <div class="project-list" :class="{ expend: !expendStatus }">
				<el-tooltip effect="dark" :content="expendStatus ? '收起' : '展开'" placement="top">
					<el-icon class="handle-expend" @click="handleExpend"><Operation /></el-icon>
				</el-tooltip>
				<Transition name="fade">
					<ProjectList v-if="expendStatus" @search="handleSearchProject"></ProjectList>
				</Transition>
			</div> -->
		<section class="demand-list">
			<BokePage
				ref="bookPage"
				:title="getDemandType == 'dw' ? '数仓需求池列表' : 'DBA需求池列表'"
				highlight-current-row
				labelWidth="90px"
				:searchColumns="formColumns"
				:form-data="formModel"
				:requestFunc="getList"
				:columns="newColumns"
				:filterParams="filterParams"
				:mounted-default="false"
				:filterTableData="filterTableData"
				:pagination="{ pageSize: 10, show: true }"
				@sort-change="sortChange"
				@search="handleSearch"
				@tableOption="tableOption"
				@handleReset="handleReset"
			>
				<template #demand_sourceHeader="{ row }">
					<el-space>
						<span>{{ row.label }}</span>
						<bokeTableFilter
							:options="
								[
									{
										label: '全部',
										value: ''
									}
								].concat(newDemandSource)
							"
							@change="reSearch"
							v-model="formModel.demand_source"
						></bokeTableFilter>
					</el-space>
				</template>
				<template #demand_typeHeader="{ row }">
					<el-space>
						<span>{{ row.label }}</span>
						<bokeTableFilter
							:options="newDemandType"
							@change="reSearch"
							v-model="formModel.demand_type"
						></bokeTableFilter>
					</el-space>
				</template>

				<template #form_assignee_feishu_user_id>
					<BokeExecutorSelect
						v-model="formModel.assignee_feishu_user_id"
						clearable
						isDesc
						itemDesc="department"
					></BokeExecutorSelect>
				</template>
				<template #form_close_flag>
					<el-switch v-model="formModel.close_flag" @change="reSearch"></el-switch>
				</template>
				<template #tableTitle>
					<el-space class="m-t-10">
						<EntryDemand ref="addDemandRef" @reSearch="reSearch"></EntryDemand>
					</el-space>
				</template>
				<template #demand_source="{ row }">
					<el-tooltip
						v-if="row.demand_source == 2"
						effect="dark"
						raw-content
						content="前往TeamBition查看任务"
						placement="top"
					>
						<a class="table-link" :href="row.tb_task_url">TB任务</a>
					</el-tooltip>
					<span v-else>{{ getLabel(newDemandSource, row.demand_source) }}</span>
				</template>
				<!-- <template #project_id="{ row }">
					{{ getLabel(projectList, row.project_id) }}
				</template> -->
				<template #demand_process="{ row }">
					<DemandProcess :process="row.demand_process" :showStatus="false" :prd_status="row.prd_status == 1">
					</DemandProcess>
				</template>
				<template #priority_num="{ row }">
					<el-tag :type="getLabel(priorityDict, row.priority_num, 'type') || 'info'">{{
						getLabel(priorityDict, row.priority_num)
					}}</el-tag>
				</template>
				<template #prd_url="{ row }">
					<a :href="row.prd_url" :title="row.prd_url" target="_blank" class="table-link">
						{{ row.prd_url }}
					</a>
				</template>
				<template #doc_url="{ row }">
					<a :href="row.doc_url" :title="row.doc_url_name" target="_blank" class="table-link">
						{{ row.doc_url_name }}
					</a>
				</template>

				<template #id="{ row }">
					<boke-text-button @click="goTask(row.id)">
						{{ row.id }}
					</boke-text-button>
				</template>
				<template #demand_content="{ row }">
					<!-- <el-tooltip effect="dark" raw-content placement="top">
						<template #content>
							<div class="demand-content" style="white-space: pre-line; max-width: 600px">
								<BokeMd :text="row?.demand_content"></BokeMd>
							</div>
						</template>
						<div class="one-line" style="max-height: 54px"><BokeMd :text="row?.demand_content"></BokeMd></div>
					</el-tooltip> -->
					<div class="one-line" style="max-height: 54px"><BokeMd :text="row?.demand_content"></BokeMd></div>
				</template>
				<template #attach_img="{ row }">
					<el-image
						style="max-width: 60px; max-height: 30px"
						v-if="resolveImg(row.attach_img).length"
						:src="resolveImg(row.attach_img)[0]"
						preview-teleported
						:preview-src-list="resolveImg(row.attach_img)"
					></el-image>
				</template>
				<template #executor_feishu_user_ids="{ row }">
					{{ getExcutor(row) }}
				</template>
				<template #assignee_feishu_user_id="{ row }">
					<BokeUserProfile
						:userName="getLabel(customUserDict, row.assignee_feishu_user_id)"
						:feishuUserId="row.assignee_feishu_user_id"
					></BokeUserProfile>
				</template>
				<template #prd_status="{ row }">
					<BokeTextStatus mode="text" :status="row.prd_status == 1 ? 'success' : 'default'">
						{{ getLabel(isOrNoDict, row.prd_status) }}
					</BokeTextStatus>
				</template>
				<template #demand_name="{ row }">
					<DemandDetail
						:demand_id="row.id"
						title="需求详情"
						:readonly="row.demand_process != 0"
						isDemand
						@ok="reSearch"
					>
						{{ row.demand_name }}
					</DemandDetail>
				</template>
				<template #handle="{ row }">
					<el-space spacer="|">
						<DemandCheck
							:demandRow="row"
							@reSearch="reSearch"
							v-if="
								row.demand_process == 9 &&
								row.demand_status == 1 &&
								row.assignee_feishu_user_id == userStore.userInfo?.union_id
							"
						></DemandCheck>
						<EntryDemand
							:demandRow="row"
							:cliamStatus="getCliamStatus(row, userStore.userInfo)"
							mode="claim"
							@reSearch="reSearch"
							v-else-if="getCliamStatus(row, userStore.userInfo)"
						></EntryDemand>
						<span
							v-else-if="
								row.demand_process < 10 && !row.executor_feishu_user_ids?.includes(userStore.userInfo?.union_id)
							"
							>等待他人更新</span
						>
						<span class="color-describe" v-else-if="row.demand_process == 10">需求完成</span>
						<span class="color-describe" v-else-if="row.demand_process == 12">需求完成-自动</span>
						<span class="color-describe" v-else-if="row.demand_process == 20">需求关闭</span>
						<boke-text-button type="danger" v-if="getCloseStatus(row)" @click="handleCloseDemand(row)"
							>关闭</boke-text-button
						>
					</el-space>
				</template>
			</BokePage>
		</section>

		<div v-show="false">
			<EntryDemand ref="claimRef" cliamStatus mode="claim" @reSearch="reSearch"></EntryDemand>
			<DemandDetail ref="infoRef" :demand_id="route.query?.demand_id" title="需求详情" readonly isDemand @ok="reSearch">
			</DemandDetail>
			<DemandCheck
				ref="demandCheckRef"
				:demandRow="demandInfo"
				@reSearch="reSearch"
				v-if="
					demandInfo?.demand_process == 9 &&
					demandInfo?.demand_status == 1 &&
					demandInfo?.assignee_feishu_user_id == userStore.userInfo?.union_id
				"
			></DemandCheck>
		</div>
	</section>
</template>
<script setup>
import { getPoolListApi, deletePoolApi } from './service/demand_api.js'
import { timeShortcuts, message, confirm, getLabel } from '@/utils/tools'
import { demandColumns } from './service/config.js'
import { useUserStore } from '@/stores'
import {
	demandProcessDict,
	isOrNoDict,
	priorityDict,
	demandSourceDict,
	dbDemandSourceDict,
	dbDemandTypeDict
} from './service/config.js'
import { useDemand } from './hook/useDemand.js'
import { searchDemandTrack, closeDemandTrack } from './service/track.js'
import DemandDetail from './components/demand_list/DemandDetail.vue'
import DemandProcess from './components/demand_list/DemandProcess.vue'
import BokeSelect from '@/components/form/select/BokeSelect.vue'
import EntryDemand from '@/views/dw_demand/components/entry_demand/EntryDemand.vue'
import DemandCheck from '@/views/dw_demand/components/demand_list/DemandCheck.vue'

const {
	projectList,
	getProjectList,
	resolveImg,
	getFeishuDocument,
	getCustomerUser,
	customUserDict,
	dwUserList,
	getDwUser,
	getDemandType,
	getDemandInfo,
	demandInfo,
	getCliamStatus
} = useDemand()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const bookPage = ref()
const claimRef = ref()
const infoRef = ref()
const addDemandRef = ref()
const demandCheckRef = ref()
const formModel = reactive({
	// flag_type: 1,
	project_id: null,
	id: null,
	demand_name: null,
	assignee_feishu_user_id: null,
	executor_feishu_user_id: null,
	demand_process: null,
	create_time: [],
	complete_time: [],
	close_flag: true,
	sort_by: '',
	sort_order: '',
	demand_source: '',
	demand_type: ''
})
// formModel.date = getDate()
const newDemandType = computed(() => {
	return [
		{
			label: '全部',
			value: ''
		}
	].concat(dbDemandTypeDict.filter((item) => item.value !== 0))
})
// 数据源
const newColumns = computed(() => {
	if (getDemandType.value == 'db') {
		return demandColumns
	} else {
		return demandColumns.filter((item) => item.prop != 'demand_type')
	}
})
const newDemandSource = computed(() => {
	if (getDemandType.value == 'db') {
		return dbDemandSourceDict
	} else {
		return demandSourceDict
	}
})
const formColumns = computed(() => {
	return [
		{
			label: '需求ID',
			prop: 'id',
			formProp: {
				el: ElInput,
				width: '282px',
				clearable: true
			}
		},
		{
			label: '需求名称',
			prop: 'demand_name',
			formProp: {
				el: ElInput,
				width: '282px',
				placeholder: '请输入需求名称',
				clearable: true
			}
		},
		{
			label: '项目',
			prop: 'project_id',
			formProp: {
				el: BokeSelect,
				width: '282px',
				filterable: true,
				options: projectList.value,
				clearable: true
			}
		},
		{
			label: '执行人',
			prop: 'executor_feishu_user_id',
			formProp: {
				el: BokeSelect,
				width: '282px',
				minWidth: '164px',
				filterable: true,
				options: dwUserList.value,
				clearable: true
			}
		},
		{
			label: '需求进度',
			prop: 'demand_process',
			formProp: {
				el: BokeSelect,
				width: '282px',
				minWidth: '164px',
				filterable: true,
				options: demandProcessDict?.filter((item) => {
					return item.value != 4
				}),
				clearable: true
			}
		},
		{
			label: '需求人',
			prop: 'assignee_feishu_user_id',
			formProp: {
				el: BokeSelect,
				width: '282px',
				filterable: true,
				slot: 'form_assignee_feishu_user_id',
				options: customUserDict.value,
				clearable: true,
				isDesc: true,
				itemDesc: 'department'
			}
		},
		// {
		// 	label: "需求来源",
		// 	prop: "demand_source",
		// 	formProp: {
		// 		el: BokeSelect,
		// 		width: "300px",
		// 		filterable: true,
		// 		options: demandSourceDict,
		// 		clearable: true
		// 	}
		// },
		{
			label: '创建时间',
			prop: 'create_time',
			type: 'datetimerange',
			formProp: {
				width: '400px',
				el: ElDatePicker,
				type: 'daterange',
				'start-placeholder': '开始时间',
				'end-placeholder': '结束时间',
				shortcuts: timeShortcuts,
				'value-format': 'YYYY-MM-DD'
			}
		},
		{
			label: '截止时间',
			prop: 'complete_time',
			type: 'datetimerange',
			formProp: {
				width: '400px',
				labelWidth: '110px',
				el: ElDatePicker,
				type: 'daterange',
				'start-placeholder': '开始时间',
				'end-placeholder': '结束时间',
				shortcuts: timeShortcuts,
				'value-format': 'YYYY-MM-DD'
			}
		},
		{
			label: '过滤关闭需求',
			prop: 'close_flag',
			formProp: {
				width: '180px',
				labelWidth: '110px',
				slot: 'form_close_flag'
			}
		}
	]
})
// const isSuper = computed(() => {
// 	return userStore.userInfo?.is_super || userStore.userInfo?.super_system_ids?.includes(9)
// })
const downFile = ref({
	loading: false,
	disabled: false
})
// const handleSearchProject = (val) => {
// 	if (val.length > 0) {
// 		formModel.project_id = val?.join(",")
// 	} else {
// 		formModel.project_id = ""
// 	}
// 	reSearch()
// }
// 解析执行人
const getExcutor = (row) => {
	// 认领之后显示认领之后的人，认领前显示选择的需求人
	const ids = row.demand_process >= 5 ? row.accept_executors : row.executor_feishu_user_ids
	const excutors = ids?.split(',')?.map((item) => {
		return getLabel(customUserDict.value, item)
	})
	if (excutors && excutors?.length > 1) {
		return excutors?.join(',')
	} else if (excutors) {
		return excutors[0]
	} else {
		return excutors
	}
}
const tableOption = (value) => {
	if (value?.total == 0) {
		downFile.value.disabled = true
	} else {
		downFile.value.disabled = false
	}
}
const getDocName = async (url) => {
	if (!url) {
		return ''
	} else {
		const { title = '' } = await getFeishuDocument({ url })
		return title
	}
}
// 格式化数据中的文档地址为飞书文档名称
const filterTableData = async (res) => {
	for (const i of res) {
		if (!i.doc_url) continue
		i.doc_url_name = await getDocName(i.doc_url)
		if (i?.prd_url && i?.prd_url.includes('boke.feishu.cn')) {
			i.prd_url = await getDocName(i.prd_url)
		}
	}
	return res
}

const filterParams = (params) => {
	if (!params) return params
	const { complete_time, create_time } = params
	let begin_complete_time = undefined
	let end_complete_time = undefined
	let begin_create_time = undefined
	let end_create_time = undefined
	if (complete_time) [begin_complete_time, end_complete_time] = complete_time
	if (create_time) [begin_create_time, end_create_time] = create_time
	delete params.complete_time
	delete params.create_time
	delete params.update_time
	return {
		begin_complete_time,
		end_complete_time,
		begin_create_time,
		end_create_time,
		...params
	}
}
const getList = (params) => {
	console.log(getDemandType.value)
	return getPoolListApi(params, getDemandType.value)
}
const handleSearch = () => {
	searchDemandTrack(
		{
			需求ID: formModel.id,
			需求名称: formModel.demand_name,
			需求人: getLabel(customUserDict.value, formModel.assignee_feishu_user_id),
			项目: getLabel(projectList.value, formModel.project_id),
			执行人: getLabel(customUserDict.value, formModel.executor_feishu_user_id),
			需求进度: getLabel(demandProcessDict, formModel.demand_process),
			创建时间: formModel.create_time,
			截止时间: formModel.complete_time,
			需求来源: getLabel(newDemandSource.value, formModel.demand_source),
			过滤关闭需求: formModel.close_flag
		},
		getDemandType.value
	)
}
const sortChange = ({ order, prop }) => {
	if (order === 'ascending') order = 'asc'
	if (order === 'descending') order = 'desc'
	formModel.sort_by = prop
	formModel.sort_order = order
	const params = filterParams({
		...formModel,
		sort_by: prop,
		sort_order: order
	})
	bookPage.value.tableRef.loadData(params, { page: 1 })
}
const reSearch = async () => {
	const params = filterParams({
		...formModel
	})
	await bookPage.value.tableRef.loadData(params, { page: 1 })
}
const goTask = (demand_id) => {
	router.push({
		path: '/dw_demand/dw_tasklist',
		query: {
			demand_id
		}
	})
}
// 项目侧边栏展开收起
// const expendStatus = ref(true)
// const handleExpend = () => {
// 	expendStatus.value = !expendStatus.value
// }
const handleCloseDemand = async (row) => {
	try {
		await confirm('确定关闭需求吗？')
		await deletePoolApi(
			{
				id: row.id
			},
			getDemandType.value
		)
		message.success('关闭成功')
		closeDemandTrack(
			{
				需求名称: row.demand_name
			},
			getDemandType.value
		)
		reSearch()
	} catch (error) {
		console.log(error)
	}
}

// 获取是否可以关闭
const getCloseStatus = (row) => {
	if (row.executor_feishu_user_ids?.includes(userStore.userInfo?.union_id) && row.demand_process < 10) {
		return true
	} else {
		return false
	}
}
const handleReset = () => {
	formModel.demand_source = ''
}
const handleParams = async () => {
	const params = route.query
	if (params?.mode == 'add') {
		addDemandRef.value?.handleOpen()
	} else if (params?.mode == 'claim' && params?.demand_id) {
		claimRef.value?.handleClaimOpen(params?.demand_id)
	} else if (params?.mode == 'info' && params?.demand_id) {
		infoRef.value?.handleOpenDetail()
	} else if (params?.mode == 'accept' && params?.demand_id) {
		await getDemandInfo(params?.demand_id)
		demandCheckRef.value?.handleOpen()
	}
}
const init = async () => {
	formModel.demand_process = 0
	getProjectList()
	getCustomerUser()
	await getDwUser()
	await userStore.getUserInfo()
	const keys = dwUserList.value.map((item) => item.value)
	if (keys?.includes(userStore.userInfo?.union_id)) {
		formModel.executor_feishu_user_id = userStore.userInfo?.union_id
	}
	if (route.query?.demand_id) {
		// 筛选需求时去除参数，避免跳转过来看不到需求
		formModel.id = route.query?.demand_id
		formModel.demand_process = ''
		formModel.executor_feishu_user_id = ''
	}

	handleParams()
	reSearch()
}

onActivated(() => {
	init()
})
onMounted(() => {
	init()
})
</script>
<style lang="scss" scoped>
.dw-demand {
	// display: flex;
	// gap: 10px;
	margin-bottom: 10px;
	.project-list {
		width: 220px;
		border-right: 1px solid var(--boke-color-border-divider);
		height: auto;
		position: relative;
		transition: all 0.3s;
		&.expend {
			width: 0px;
			border-right: none;
		}
		.handle-expend {
			position: absolute;
			right: 0px;
			top: 4px;
			cursor: pointer;
			&:hover {
				color: var(--boke-color-main);
			}
		}
	}
	.demand-list {
		width: 100%;
		// flex: 1;
		// width: calc(100% - 280px);
	}
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
