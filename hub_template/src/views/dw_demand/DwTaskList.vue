<template>
	<div>
		<boke-card no-padding>
			<boke-tabs size="large" v-model:active="activeTabs" :tabs="tabs" @tabClick="changeTabs" noUrlChange></boke-tabs>
		</boke-card>
		<boke-card class="m-t-16 task-table">
			<template #header>
				<boke-form
					ref="formRef"
					:form-data="formModel"
					label-width="98px"
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
					<template #form_show_more>
						<div class="show-more">
							<div class="more-list">
								<template v-if="showMore">
									<el-form-item label="DS实例" class="more-item">
										<BokeSelect
											v-model="formModel.asset_item_id"
											:options="options.ds_instance"
											clearable
											@change="changeInstance"
										>
										</BokeSelect>
									</el-form-item>
									<el-form-item label="DS项目空间" class="more-item">
										<BokeSelect
											v-model="formModel.ds_project_code"
											:options="options.ds_space"
											clearable
											placeholder="请先选择DS实例"
											@change="changeSpace"
											@focus="getDsDict(1)"
										>
										</BokeSelect>
									</el-form-item>
									<el-form-item label="DS工作流" class="more-item">
										<BokeSelect
											v-model="formModel.ds_task_code"
											:options="options.ds_workflow"
											clearable
											placeholder="请先选择DS项目空间"
											@focus="getDsDict(2)"
										>
										</BokeSelect>
									</el-form-item>
								</template>
							</div>
							<boke-text-button class="more-btn" @click="showMore = true" v-if="!showMore">
								<el-space>
									<el-icon><ArrowDown /></el-icon>展开更多
								</el-space>
							</boke-text-button>
							<boke-text-button class="more-btn" @click="showMore = false" v-else>
								<el-space>
									<el-icon><ArrowUp /></el-icon> 收起更多
								</el-space>
							</boke-text-button>
						</div>
					</template>
					<template #form_more_content> </template>
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
				:columns="newColumns"
				:pagination="{ pageSize: 10, show: true }"
				:mountedDefault="false"
				row-key="id"
				:filterTableData="filterTableData"
				:row-class-name="setClassName"
				:expand-row-keys="expandKeys"
				@sort-change="sortChange"
				@expand-change="handleExpand"
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
								...newDemandType?.filter((item) => item.value != 0)
							]"
							@change="handleSearch"
							v-model="formModel.task_type"
						></bokeTableFilter>
					</el-space>
				</template>
				<template #expand="{ row }" v-if="getDemandType == 'dw'">
					<div class="expend-content">
						<div class="expand-table">
							<el-table :data="dsList" size="small">
								<el-table-column
									v-for="(item, index) in dsTaskColumnsTwo"
									:key="index"
									:prop="item.prop"
									:label="item.label"
									:width="item.width"
									:minWidth="item.minWidth"
									:sortable="item.sortable"
									:showOverflowTooltip="item?.showOverflowTooltip"
								>
									<template #default="{ row: sRow }">
										<template v-if="item.prop == 'name'">
											<boke-text-button @click="goDsUrl(sRow, row?.ds_base_url)">{{ sRow.name }}</boke-text-button>
										</template>
										<template v-if="item.prop == 'ds_bind_id'">
											{{ sRow.asset_item_name }}
										</template>

										<template v-if="item.prop == 'releaseState'">
											<div>
												<el-tag type="warning" v-if="sRow.releaseState == 'OFFLINE'">下线</el-tag>
												<el-tag type="success" v-else>上线</el-tag>
											</div>
										</template>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
				</template>
				<template #project_name="{ row }">
					{{ row.demand_detail?.project_name }}
					<!-- {{ projectList.find((item) => item.value == row.demand_detail?.project_id)?.label }} -->
				</template>

				<template #task_type="{ row }">
					{{ getLabel(newDemandType, row.task_type) }}
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
					<div class="one-line" style="max-height: 54px"
						><BokeMd :text="row.task_content || row.demand_detail?.demand_content"></BokeMd
					></div>
				</template>
				<template #task_process="{ row }">
					<DemandProcess :process="row?.demand_detail?.demand_process" :task_status="row.task_status"></DemandProcess>
				</template>
				<template #approval_user_id="{ row }">
					<a :href="row.demand_detail?.prd_url" :title="row.demand_detail?.prd_url" target="_blank" class="table-link">
						{{ row.demand_detail?.prd_url }}
					</a>
				</template>
				<template #demand_description="{ row }">
					<span v-html="row.demand_detail?.demand_description"></span>
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
			<div v-show="false">
				<DemandDetail
					ref="demandRef"
					readonly
					:demand_id="route.query?.demand_id"
					:task_id="route.query?.task_id"
					title="需求详情"
					@ok="handleSearch"
				>
				</DemandDetail>
				<TaskFinish
					ref="taskRef"
					:demandRow="taskInfo?.demand_detail"
					:taskRow="taskInfo"
					@ok="handleSearch"
				></TaskFinish>
			</div>
		</boke-card>
	</div>
</template>
<script setup>
import { Search, Refresh, ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import {
	getTaskListApi,
	getBindDsListApi,
	getDsInstanceApi,
	getDsProjectListApi,
	getDSworkflowListApi
} from './service/task_api'
import { taskStatusDict, demandTypeDict, taskColumns, dsTaskColumnsTwo, dbDemandTypeDict } from './service/config'
import { useUserStore } from '@/stores'
import { useDemand } from './hook/useDemand.js'
import { getLabel, message, timeShortcuts } from '@/utils/tools'
import { searchTaskTrack } from '@/views/dw_demand/service/track'
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
	getDwUser,
	goDsUrl,
	getDemandType,
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
const showMore = ref(false) // 控制展开收起
const options = ref({
	ds_instance: [],
	ds_space: [],
	ds_workflow: []
})
// const branchOptions = reactive({
// 	branchList: [],
// 	commitList: [],
// 	list: []
// })
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
	ds_task_code: '',
	task_type: ''
})
const newColumns = computed(() => {
	if (getDemandType.value == 'db') {
		return taskColumns.filter((item) => item.prop != 'task_type' && item.prop != 'expand')
	}
	return taskColumns
})
const newDemandType = computed(() => {
	if (getDemandType.value == 'db') {
		return dbDemandTypeDict
	} else {
		return demandTypeDict
	}
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
				// width: '282px',
				clearable: true
			}
		},
		{
			label: '需求名称',
			prop: 'demand_name',
			formProp: {
				el: ElInput,
				// width: '282px',
				clearable: true
			}
		},
		{
			label: '项目',
			prop: 'project_id',
			formProp: {
				el: 'BokeSelect',
				// width: '282px',
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
				// width: '282px',
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
				// width: '282px',
				minWidth: '164px',
				filterable: true,
				childEl: ElOption,
				source: dwUserList.value,
				clearable: true
			}
		},
		{
			label: 'DS实例',
			prop: 'asset_item_id',
			hidden: getDemandType.value != 'dw',
			formProp: {
				el: 'BokeSelect',
				// width: '250px',
				minWidth: '164px',
				labelWidth: '90px',
				filterable: true,
				source: options.value.ds_instance,
				clearable: true,
				onChange: () => {
					changeInstance()
				}
			}
		},
		{
			label: 'DS项目空间',
			prop: 'ds_project_code',
			hidden: getDemandType.value != 'dw',
			formProp: {
				el: 'BokeSelect',
				// width: '300px',
				minWidth: '156px',
				filterable: true,
				source: options.value.ds_space,
				placeholder: '请选择DS项目',
				clearable: true,
				onChange: () => {
					changeSpace()
				},
				onFocus: () => {
					getDsDict(1)
				}
			}
		},
		{
			label: 'DS工作流',
			prop: 'ds_task_code',
			hidden: getDemandType.value != 'dw',
			formProp: {
				el: 'BokeSelect',
				// width: '258px',
				minWidth: '164px',
				filterable: true,
				source: options.value.ds_workflow,
				clearable: true,
				onFocus: () => {
					getDsDict(2)
				}
			}
		},
		{
			label: '任务ID',
			prop: 'task_id',
			formProp: {
				el: ElInput,
				// width: '282px',
				clearable: true
			}
		},
		// {
		// 	label: '任务状态',
		// 	prop: 'task_status',
		// 	formProp: {
		// 		el: ElSelect,
		// 		width: '300px',
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
				// width: '345px',
				labelWidth: '80px',
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
				// width: '328px',
				labelWidth: '80px',
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
	return getTaskListApi(params, getDemandType.value)
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
	searchTaskTrack(
		{
			需求ID: formModel.demand_id,
			需求名称: formModel.demand_name,
			项目名称: getLabel(projectList.value, formModel.project_id),
			执行人: getLabel(customUserDict.value, formModel.executor_feishu_user_id),
			任务状态: getLabel(taskStatusDict, formModel.task_status),
			开始时间: formModel.start_time,
			完成时间: formModel.complete_time
		},
		getDemandType.value
	)
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

// 控制是否可以展开
const expandKeys = ref([])
const dsList = ref([])
const dsLoading = ref(false)
const setClassName = ({ row }) => {
	if (row?.ds_bind_count && row?.ds_bind_count > 0) {
		return ''
	}
	return 'no-expand'
}
const getDSworkflowList = async (task_id) => {
	try {
		const params = {
			task_id
		}
		dsLoading.value = true
		const res = await getBindDsListApi(params)
		dsList.value = res.items
		dsLoading.value = false
		return res.items
	} catch (error) {
		console.log(error)
		dsLoading.value = false
	}
}
const handleExpand = (row) => {
	if (!row?.ds_bind_count || row?.ds_bind_count == 0) {
		expandKeys.value = []
		return
	}
	if (expandKeys.value?.includes(row.id)) {
		expandKeys.value = []
	} else {
		dsList.value = []
		expandKeys.value = [row.id]
		getDSworkflowList(row.id)
	}
}
const getDsInstance = async () => {
	try {
		const res = await getDsInstanceApi()
		options.value.ds_instance = res?.items?.map((item) => {
			return {
				...item,
				label: item.asset_item_name,
				value: item.asset_item_id
			}
		})
	} catch (error) {
		console.log(error)
	}
}
const getDsProjectList = async (asset_item_id) => {
	try {
		const res = await getDsProjectListApi({
			asset_item_id
		})
		options.value.ds_space = res?.items?.map((item) => {
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
const getDSworkflowListOptions = async (params) => {
	try {
		const res = await getDSworkflowListApi(params)
		options.value.ds_workflow = res.items?.map((item) => {
			return {
				...item,
				value: item.code,
				label: item.name
			}
		})
	} catch (error) {
		console.log(error)
	}
}
const changeInstance = async () => {
	if (formModel.asset_item_id) {
		getDsProjectList(formModel.asset_item_id)
	} else {
		options.value.ds_space = []
		formModel.ds_project_code = ''
	}
}
const changeSpace = () => {
	if (!formModel.asset_item_id) {
		message.error('请先选择DS实例')
	}
	if (formModel.ds_project_code) {
		getDSworkflowListOptions({
			asset_item_id: formModel.asset_item_id,
			ds_project_code: formModel.ds_project_code
		})
	} else {
		options.value.ds_workflow = []
		formModel.ds_task_code = ''
	}
}
const getDsDict = (type) => {
	if (type == 1 && !formModel.asset_item_id) {
		return message.error('请先选择DS实例')
	}
	if (type == 2 && !formModel.ds_project_code) {
		return message.error('请先选择DS项目空间')
	}
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
const init = async () => {
	getProjectList()
	getDsInstance()
	getCustomerUser()
	await getDwUser()
	await userStore.getUserInfo()
	const devDict = dwUserList.value?.map((item) => item.value) || []
	const isDever = devDict.includes(feishuUserId.value)
	formModel.demand_id = route.query?.demand_id
	formModel.task_id = route.query?.task_id
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
onMounted(() => {
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
.task-table {
	:deep(.el-card__body) {
		padding-top: 0;
	}
}
</style>
