<template>
	<!-- <boke-card>
		<section class="kanban">
			<div class="kanban-item" v-for="item in dataInfo" :key="item.label">
				<div class="left">
					<p class="value">{{ item.value }}</p>
					<p class="title">{{ item.label }}</p>
				</div>
				<div class="right">
					<i class="iconfont">&#xe624;</i>
				</div>
			</div>
		</section>
	</boke-card> -->
	<boke-card no-padding>
		<boke-tabs size="large" v-model:active="activeTabs" :tabs="tabs" @tabClick="changeTabs" noUrlChange></boke-tabs>
	</boke-card>
	<boke-card class="m-t-16 task-table">
		<template #header>
			<boke-form
				ref="formRef"
				:form-data="formModel"
				label-width="90px"
				mode="search"
				:vertical="false"
				:columns="formColumns"
				@reset="handleReset"
			>
				<template #form_assignee_feishu_user_id>
					<BokeExecutorSelect
						v-model="formModel.assignee_feishu_user_id"
						clearable
						isDesc
						itemDesc="department"
					></BokeExecutorSelect>
				</template>
				<template #formFooter>
					<BokeButton type="primary" @click="handleSearch">
						<el-space>
							<el-icon> <Search /> </el-icon>筛选
						</el-space>
					</BokeButton>
					<BokeButton @click="handleReset">
						<el-space>
							<el-icon> <Refresh /> </el-icon>重置
						</el-space>
					</BokeButton>
				</template>
			</boke-form>
		</template>
		<BokeTable
			ref="bookPage"
			border
			highlight-current-row
			:requestFunc="getList"
			:columns="taskColumns"
			:pagination="{ pageSize: 10, show: true }"
			:mountedDefault="false"
			row-key="id"
			:filterTableData="filterTableData"
			@sort-change="sortChange"
		>
			<template #task_statusHeader="{ row }">
				<el-space>
					<span>{{ row.label }}</span>
					<bokeTableFilter
						:options="[
							{
								label: '全部',
								value: ''
							},
							...taskStatusDict
						]"
						@change="handleSearch"
						v-model="formModel.task_status"
					></bokeTableFilter>
				</el-space>
			</template>
			<template #task_typeHeader="{ row }">
				<el-space>
					<span>{{ row.label }}</span>
					<bokeTableFilter
						:options="[
							{
								label: '全部',
								value: ''
							},
							...demandTypeDict?.filter((item) => item.value != 0)
						]"
						@change="handleSearch"
						v-model="formModel.task_type"
					></bokeTableFilter>
				</el-space>
			</template>
			<template #project_name="{ row }">
				{{ row.demand_detail?.project_name }}
				<!-- {{ projectList.find((item) => item.value == row.demand_detail?.project_id)?.label }} -->
			</template>
			<template #demand_name="{ row }">
				<DemandDetail
					readonly
					:demand_id="row.demand_detail?.id"
					:task_id="row?.id"
					title="需求详情"
					:demandRow="row?.demand_detail"
					:taskRow="row"
					@ok="handleSearch"
				>
					{{ row?.demand_detail?.demand_name }}
				</DemandDetail>
			</template>
			<template #task_content="{ row }">
				<!-- <el-tooltip effect="dark" raw-content placement="top">
					<template #content>
						<div class="demand-content" style="white-space: pre-line; max-width: 600px">
							{{ row.task_content || row.demand_detail?.demand_content }}
						</div>
					</template>
					<div class="one-line" style="max-height: 54px"
						><BokeMd :text="row.task_content || row.demand_detail?.demand_content"></BokeMd
					></div>
				</el-tooltip> -->
				<div class="one-line" style="max-height: 54px"
					><BokeMd :text="row.task_content || row.demand_detail?.demand_content"></BokeMd
				></div>
			</template>
			<template #task_process="{ row }">
				<DemandProcess
					:row="row.demand_detail"
					:process="row?.demand_detail?.demand_process"
					:task_status="row.task_status"
				></DemandProcess>
			</template>
			<template #approval_user_id="{ row }">
				<a :href="row.demand_detail?.prd_url" :title="row.demand_detail?.prd_url" target="_blank" class="table-link">
					{{ row.demand_detail?.prd_url }}
				</a>
			</template>
			<template #task_user_name="{ row }">
				<el-image
					style="max-width: 60px; max-height: 30px"
					v-if="resolveImg(row.demand_detail?.attach_img).length"
					:src="resolveImg(row.demand_detail?.attach_img)[0]"
					preview-teleported
					:preview-src-list="resolveImg(row.demand_detail?.attach_img)"
				></el-image>
			</template>
			<template #feishu_user_id="{ row }">
				{{ getLabel(dwUserList, row?.feishu_user_id) }}
			</template>
			<template #demand_description="{ row }">
				<span v-html="row.demand_detail?.demand_description"></span>
			</template>
			<template #assignee_feishu_user_id="{ row }">
				<BokeUserProfile
					:userName="getLabel(customUserDict, row?.demand_detail?.assignee_feishu_user_id)"
					:feishuUserId="row?.demand_detail?.assignee_feishu_user_id"
				></BokeUserProfile>
			</template>
			<template #handle="{ row }">
				<template v-if="row?.feishu_user_id == feishuUserId">
					<el-space>
						<TaskFinish :demandRow="row?.demand_detail" :taskRow="row" @ok="handleSearch"></TaskFinish>
						<TaskChangeDev
							mode="2"
							:dwUserList="dwUserList"
							:row="row"
							@ok="handleSearch"
							v-if="row.task_status != 2 && row.demand_detail?.demand_process <= 5"
							>转交</TaskChangeDev
						>
						<TaskChangeDev
							mode="1"
							:dwUserList="dwUserList"
							:row="row"
							@ok="handleSearch"
							v-if="row.task_status != 2 && row.demand_detail?.demand_process <= 5"
							>退出</TaskChangeDev
						>
					</el-space>
				</template>
				<span class="color-describe" v-else-if="row.demand_detail?.demand_process == 10">需求结束</span>
				<span class="color-describe" v-else-if="row.demand_detail?.demand_process == 20">需求关闭</span>
				<span class="color-describe" v-else-if="row.demand_detail?.demand_process == 12">需求完成-自动</span>
				<span v-else>等待他人操作</span>
			</template>
		</BokeTable>
		<DemandDetail
			v-show="false"
			ref="demandRef"
			readonly
			:demand_id="route.query?.demand_id"
			:task_id="route.query?.task_id"
			title="需求详情"
			@ok="handleSearch"
		>
		</DemandDetail>
		<TaskFinish
			v-show="false"
			ref="taskRef"
			:demandRow="taskInfo?.demand_detail"
			:taskRow="taskInfo"
			@ok="handleSearch"
		></TaskFinish>
	</boke-card>
</template>
<script setup>
import { Search, Refresh } from '@element-plus/icons-vue'
import { getTaskListApi } from './service/task_api'
import { taskStatusDict, demandTypeDict, taskColumns } from './service/config'
import { useUserStore } from '@/stores'
import { useDemand } from './hook/useDemand.js'
import { getLabel, timeShortcuts } from '@/utils/tools'
import { searchTaskTrack } from '@/views/da_demand/service/track'
import DemandDetail from './components/demand_list/DemandDetail.vue'
import DemandProcess from './components/demand_list/DemandProcess.vue'
import TaskChangeDev from './components/task/TaskChangeDev.vue'
import TaskFinish from './components/task/TaskFinish.vue'
const defaultTabs = [
	{
		label: '我的任务',
		name: '我的任务',
		disabled: false
	},
	{
		label: '全部任务',
		name: '全部任务'
	}
]
const {
	projectList,
	getProjectList,
	resolveImg,
	getFeishuDocument,
	getCustomerUser,
	customUserDict,
	dwUserList,
	getDaUser,
	getTaskDetail,
	taskInfo
} = useDemand()
const userStore = useUserStore()
const route = useRoute()
const { userInfo } = storeToRefs(userStore)
const tabs = ref(defaultTabs)
const activeTabs = ref('我的任务')
const bookPage = ref()
const formRef = ref()
const demandRef = ref()
const taskRef = ref()
const formModel = reactive({
	feishu_user_id: null,
	task_status: 1,
	demand_id: null,
	demand_name: null,
	task_id: null,
	start_time: [],
	complete_time: [],
	assignee_feishu_user_id: undefined,
	sort_by: '',
	sort_order: '',
	asset_item_id: '',
	ds_project_code: '',
	ds_task_code: ''
})
const feishuUserId = computed(() => {
	return userInfo.value?.union_id
})
// 数据源
const formColumns = computed(() => {
	return [
		{
			label: '需求ID',
			prop: 'demand_id',
			formProp: {
				el: ElInput,
				// width: '300px',
				clearable: true
			}
		},

		{
			label: '需求名称',
			prop: 'demand_name',
			formProp: {
				el: ElInput,
				// width: '300px',
				clearable: true
			}
		},
		{
			label: '项目',
			prop: 'project_id',
			formProp: {
				el: 'BokeSelect',
				// width: '300px',
				filterable: true,
				source: projectList.value,
				clearable: true
			}
		},
		{
			label: '需求人',
			prop: 'assignee_feishu_user_id',
			formProp: {
				el: 'BokeSelect',
				// width: '300px',
				filterable: true,
				slot: 'form_assignee_feishu_user_id',
				options: customUserDict.value,
				clearable: true,
				isDesc: true,
				itemDesc: 'department'
			}
		},
		{
			label: '执行人',
			prop: 'feishu_user_id',
			formProp: {
				el: 'BokeSelect',
				// width: '300px',
				minWidth: '164px',
				filterable: true,
				childEl: ElOption,
				source: dwUserList.value,
				clearable: true
			}
		},
		{
			label: '任务ID',
			prop: 'task_id',
			formProp: {
				el: ElInput,
				// width: '300px',
				clearable: true
			}
		},
		// {
		// 	label: "任务状态",
		// 	prop: "task_status",
		// 	formProp: {
		// 		el: ElSelect,
		// 		width: "300px",
		// 		filterable: true,
		// 		childEl: ElOption,
		// 		source: taskStatusDict,
		// 		clearable: true
		// 	}
		// },
		// {
		// 	label: "任务类型",
		// 	prop: "task_type",
		// 	formProp: {
		// 		el: ElSelect,
		// 		width: "300px",
		// 		filterable: true,
		// 		childEl: ElOption,
		// 		source: demandTypeDict?.filter((item) => item.value != 0),
		// 		clearable: true
		// 	}
		// },
		{
			label: '开始时间',
			prop: 'start_time',
			type: 'datetimerange',
			formProp: {
				// width: '400px',
				el: ElDatePicker,
				type: 'daterange',
				'start-placeholder': '开始时间',
				'end-placeholder': '结束时间',
				shortcuts: timeShortcuts,
				'value-format': 'YYYY-MM-DD'
			}
		},
		{
			label: '完成时间',
			prop: 'complete_time',
			type: 'datetimerange',
			formProp: {
				// width: '400px',
				el: ElDatePicker,
				type: 'daterange',
				'start-placeholder': '开始时间',
				'end-placeholder': '结束时间',
				shortcuts: timeShortcuts,
				'value-format': 'YYYY-MM-DD'
			}
		}
		// {
		// 	label: "",
		// 	prop: "formShowMore",
		// 	formProp: {
		// 		width: "100%",
		// 		class: "no-bg",
		// 		"label-width": 0,
		// 		slot: "form_show_more"
		// 	}
		// }
		// {
		// 	label: "",
		// 	prop: "formMoreContent",
		// 	formProp: {
		// 		width: "100%",
		// 		class: "no-bg",
		// 		"label-width": 0,
		// 		slot: "form_more_content"
		// 	}
		// }
	]
})
const changeTabs = (val) => {
	activeTabs.value = val.name
	if (val.name == '全部任务') {
		formModel.feishu_user_id = null
		formModel.task_status = ''
	} else {
		formModel.feishu_user_id = feishuUserId.value
		formModel.task_status = 1
	}
	handleSearch()
}

const getDocName = async (url) => {
	if (!url) {
		return ''
	} else {
		const { title = '' } = await getFeishuDocument({ url })
		return title
	}
}
const filterTableData = async (res) => {
	for (const i of res) {
		if (!i?.demand_detail?.prd_url) continue
		if (i?.demand_detail?.prd_url && i?.demand_detail?.prd_url.includes('boke.feishu.cn')) {
			i.demand_detail.prd_url = await getDocName(i?.demand_detail?.prd_url)
		}
	}
	return res
}
const getList = (params) => {
	expandKeys.value = []
	return getTaskListApi(params)
}
const filterParams = (params) => {
	if (!params) return params
	const { complete_time, start_time } = params
	let begin_complete_time,
		end_complete_time,
		begin_start_time,
		end_start_time = undefined
	if (complete_time) {
		;[begin_complete_time, end_complete_time] = complete_time
	}
	if (start_time) {
		;[begin_start_time, end_start_time] = start_time
	}
	delete params.complete_time
	delete params.start_time
	return {
		begin_complete_time,
		end_complete_time,
		begin_start_time,
		end_start_time,
		...params
	}
}
const sortChange = ({ order, prop }) => {
	if (order === 'ascending') order = 'asc'
	if (order === 'descending') order = 'desc'
	formModel.sort_by = prop
	formModel.sort_order = order
	const params = filterParams({
		...formModel
	})
	bookPage.value.loadData(params, { page: 1 })
}
const handleSearch = () => {
	const params = filterParams({
		...formModel
	})
	searchTaskTrack({
		需求ID: formModel.demand_id,
		需求名称: formModel.demand_name,
		项目名称: getLabel(projectList.value, formModel.project_id),
		执行人: getLabel(customUserDict.value, formModel.executor_feishu_user_id),
		任务状态: getLabel(taskStatusDict, formModel.task_status),
		开始时间: formModel.start_time,
		完成时间: formModel.complete_time
	})
	nextTick(() => {
		bookPage.value?.loadData(params, { page: 1 })
	})
}
const handleReset = () => {
	formRef.value?.form.resetFields()
	formModel.asset_item_id = ''
	formModel.ds_project_code = ''
	formModel.ds_task_code = ''
	formModel.task_type = ''
	formModel.task_status = ''
}

// 显示全部任务
const setAll = () => {
	activeTabs.value = '全部任务'
	formModel.task_status = null
	formModel.feishu_user_id = null
}
const handleParams = async () => {
	const params = route.query
	if (params?.mode == 'info' && params?.demand_id && params?.task_id) {
		demandRef.value?.handleOpenDetail()
	} else if (params?.mode == 'finish' && params?.task_id) {
		await getTaskDetail({
			task_id: params?.task_id
		})
		console.log(taskRef.value)

		taskRef.value?.handleOpen()
	}
}
// 控制是否可以展开
const expandKeys = ref([])
const init = async () => {
	getProjectList()
	getCustomerUser()
	await getDaUser()
	await userStore.getUserInfo()
	const devDict = dwUserList.value?.map((item) => item.value) || []
	const isDever = devDict.includes(feishuUserId.value)
	formModel.demand_id = route.query?.demand_id || ''
	// 2025-2-28 用于处理全局搜索到任务时，查询任务
	formModel.task_id = route.query?.task_id || ''
	handleParams()
	if (isDever) {
		formModel.feishu_user_id = feishuUserId.value
		tabs.value = defaultTabs
		if (formModel.demand_id) {
			setAll()
		}
	} else {
		tabs.value = [
			{
				label: '全部任务',
				name: '全部任务'
			}
		]
		setAll()
	}
	if (formModel.demand_id && route.query?.tab == '1') {
		activeTabs.value = '我的任务'
		formModel.task_status = null
		formModel.feishu_user_id = feishuUserId.value
	} else if (formModel.demand_id) {
		setAll()
	}
	handleSearch()
}
onActivated(() => {
	init()
})
</script>
<style lang="scss" scoped>
.kanban {
	width: 100%;
	display: flex;
	padding: 10px 0;
	gap: 1%;

	.kanban-item {
		width: 24%;
		height: 56px;
		text-align: center;
		border-right: 2px solid var(--boke-color-border-divider-blue);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 40px;

		&:last-child {
			border: none;
		}

		& > .left {
			& > .value {
				font-size: 32px;
				color: var(--boke-color-open);
				line-height: 1;
				font-family: 'puhui-medium';
			}

			& > .title {
				font-size: 20px;
				margin-top: 14px;
				line-height: 1;
			}
		}

		& > .right {
			& > i {
				font-size: 80px;
			}
		}
	}
}

.more-list {
	display: flex;
	margin-left: -100px;
	.more-item {
		width: 300px;
		margin-right: 24px;
	}
}
.show-more {
	width: 100%;
	display: flex;
	justify-content: space-between;
	.more-list {
		min-width: 100px;
	}
	.more-btn {
		margin-right: -170px;
	}
}
:deep(.no-expand) {
	.el-table__expand-icon {
		// display: none
		// pointer-events: none;
		color: var(--boke-color-text-disable);
		cursor: not-allowed;
	}
}
.expend-content {
	width: calc(100vw - 300px);
	text-align: center;
	margin-left: 60px;
	.expand-table {
		max-width: 1200px;
	}
}
.demand-content {
	img {
		max-width: 600px;
	}
}
:deep(.el-card__body) {
	padding-top: 0;
}
</style>
