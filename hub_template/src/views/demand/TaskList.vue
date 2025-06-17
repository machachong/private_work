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
				mode="search"
				:form-data="formModel"
				label-width="100px"
				:vertical="false"
				:columns="formColumns"
			>
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
			row-id="id"
			:filterTableData="filterTableData"
			@sort-change="sortChange"
			@selection-change="selectionChange"
		>
			<template #demand="{ row }">
				{{ systemOptions.find((item) => item.value == row.demand_detail?.system)?.label }}
			</template>
			<template #task_content="{ row }">
				<el-tooltip
					effect="dark"
					raw-content
					:content="`<div style='white-space: pre-line'>${row.task_content || row.demand_detail?.demand_content}</div>`"
					placement="top"
				>
					<div class="one-line">{{ row.task_content || row.demand_detail?.demand_content }}</div>
				</el-tooltip>
			</template>
			<!-- <template #flag_type="{ row }">
				<boke-text-status :status="row.flag_type == 1 ? 'success' : 'warning'">{{
					row.flag_type
				}}</boke-text-status>
			</template> -->
			<template #task_process="{ row }">
				<el-tag v-if="row.task_process == 20" :type="getLabel(demandProcessDict, row.task_process, 'type')">
					任务关闭
				</el-tag>
				<el-space v-else :size="4">
					<DemandProcess
						:process="row?.task_process"
						:task_status="row.task_status"
						:prd_status="row.demand_detail?.prd_status == 1"
					></DemandProcess>
					<span style="font-size: 12px" class="color-describe">
						{{ getLabel(demandStatusDict, row?.task_status) }}
					</span>
				</el-space>
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
			<template #task_user_id="{ row }">
				{{ getLabel(devOptions, row?.task_user_id) }}
			</template>
			<template #gitlab_url="{ row }">
				<!-- {{ getLabel(userOptions, row?.demand_detail?.demand_assignee_uid) }} -->
				<BokeUserProfile
					:userName="getLabel(userOptions, row?.demand_detail?.demand_assignee_uid, 'name')"
					:userId="row?.demand_detail?.demand_assignee_uid"
				></BokeUserProfile>
			</template>
			<template #handle="{ row }">
				<el-space>
					<span v-if="row.task_process == 20" class="color-describe">任务关闭</span>
					<DemandDetail
						v-else
						:demand_id="row.demand_detail?.id"
						:task_id="row?.id"
						title="需求详情"
						@ok="handleSearch"
						@updateProd="updateProd"
					>
						需求详情
					</DemandDetail>
					<TaskChangeDev
						mode="2"
						:row="row"
						@ok="handleSearch"
						:disabled="
							row.task_process > 5 ||
							(row.task_process == 5 && row.task_status == 2) ||
							row.task_type == 4 ||
							row.task_user_id != userInfo?.id
						"
						>转交</TaskChangeDev
					>
					<TaskChangeDev
						mode="1"
						:row="row"
						@ok="handleSearch"
						:disabled="
							row.task_process > 5 ||
							(row.task_process == 5 && row.task_status == 2) ||
							(row.demand_detail?.demand_process > 3 && row.task_type == 4) ||
							row.task_user_id != userInfo?.id
						"
						>退出</TaskChangeDev
					>
					<SendMsg
						v-if="![0, 1, 10, 11, 12, 20]?.includes(row?.demand_detail?.demand_process)"
						:id="row?.demand_detail?.id"
					></SendMsg>
				</el-space>
			</template>
			<template #tableHandle>
				<el-space>
					<boke-button type="primary" @click="handleBatch">批量更新正式</boke-button>
				</el-space>
			</template>
		</BokeTable>
		<BokeDialog
			title="批量更新正式-选择分支"
			v-model:value="branchVisible"
			width="750px"
			@open="handleOpen"
			@close="handleClose"
		>
			<el-space>
				请选择分支:
				<boke-select
					v-model="batchForm.branch_name"
					:options="branchOptions.branchList"
					placeholder="选择合并分支"
					@change="changeBranch"
				></boke-select>
			</el-space>
			<boke-title size="h3" class="m-t-16">提交信息</boke-title>
			<div v-if="branchOptions.commitList.length" class="branch-list">
				<div class="progress-item header">
					<div class="item-cell"> 提交名称 </div>
					<div class="item-cell">提交人</div>
					<div class="item-cell"> 提交时间 </div>
					<!-- <div class="item-cell"> 操作时间 </div> -->
				</div>
				<div class="progress-item" v-for="(item, index) in branchOptions.commitList" :key="index">
					<div class="item-cell">
						<a :href="item.commit_url" target="_blank">{{ item.commit_title }} </a>
					</div>
					<div class="item-cell">{{ item.commit_user }} </div>
					<div class="item-cell"> {{ item.commit_time }} </div>
				</div>
				<el-space> </el-space>
			</div>
			<div v-else> <el-empty :image-size="80"></el-empty> </div>
			<template #footer>
				<el-row justify="end">
					<el-space>
						<BokeButton @click="handleClose">取消</BokeButton>
						<BokeButton type="primary" @click="handleSubmit()">发起正式更新</BokeButton>
					</el-space>
				</el-row>
			</template>
		</BokeDialog>
	</boke-card>
</template>
<script setup>
import { Search, Refresh } from '@element-plus/icons-vue'
import { getTaskListApi, getBranchApi, batchUpdateApi } from './service/demand_api'
import { demandProcessDict, demandStatusDict, taskStatusDict } from './service/config'
import { taskColumns } from './service/config'
import { useOptionsStore, useUserStore } from '@/stores'
import { useDemandList } from './hook/useDemandList.js'
import { getLabel, timeShortcuts, message, showLoading, hideLoading } from '@/utils/tools'
import tracker from '@/utils/tracking'
import DemandDetail from './components/demand_list/DemandDetail.vue'
import DemandProcess from './components/demand_list/DemandProcess.vue'
import TaskChangeDev from './components/task/TaskChangeDev.vue'
import SendMsg from '@/views/demand/components/demand_list/SendMsg.vue'
// import DemandStatus from "./components/demand_list/DemandStatus.vue"
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
const optionsStore = useOptionsStore()
const userStore = useUserStore()
const route = useRoute()
const { resolveImg, getFeishuDocument } = useDemandList()
const { systemOptions, userOptions, devOptions } = storeToRefs(optionsStore)
const { userInfo } = storeToRefs(userStore)
const branchVisible = ref(false) // 选择分支弹窗
const tabs = ref(defaultTabs)
// const dataInfo = [
// 	{
// 		label: "我的全部",
// 		value: "123"
// 	},
// 	{
// 		label: "逾期任务",
// 		value: "123"
// 	},

// 	{
// 		label: "本周任务",
// 		value: "123"
// 	},
// 	{
// 		label: "本月任务",
// 		value: "123"
// 	}
// ]
const activeTabs = ref('我的任务')
const bookPage = ref()
const formRef = ref()
const selectTask = ref([])
// 批量操作内容
const batchForm = reactive({
	system_id: null,
	task_type: null,
	task_id_list: null,
	branch_name: null
})
const branchOptions = reactive({
	branchList: [],
	commitList: [],
	list: []
})
const formModel = reactive({
	task_user_id: null,
	flag_type: 1,
	demand_id: null,
	demand_name: null,
	task_id: null,
	task_process: null,
	demand_assignee_uid: undefined,
	start_time: [],
	complete_time: [],
	sort_by: '',
	sort_order: ''
})
// 数据源
const formColumns = computed(() => {
	return [
		{
			label: '需求ID',
			prop: 'demand_id',
			formProp: {
				el: ElInput,
				clearable: true
			}
		},
		{
			label: '需求名称',
			prop: 'demand_name',
			formProp: {
				el: ElInput,
				clearable: true
			}
		},
		{
			label: '平台',
			prop: 'system_id',
			formProp: {
				el: 'BokeSelect',
				filterable: true,
				source: systemOptions,
				clearable: true
			}
		},
		{
			label: '需求人',
			prop: 'demand_assignee_uid',
			formProp: {
				el: 'BokeSelect',
				filterable: true,
				options: userOptions.value,
				clearable: true
			}
		},
		{
			label: '任务责任人',
			prop: 'task_user_id',
			formProp: {
				el: 'BokeSelect',
				filterable: true,
				childEl: ElOption,
				source: devOptions.value,
				clearable: true
			}
		},

		{
			label: '任务ID',
			prop: 'task_id',
			formProp: {
				el: ElInput,
				clearable: true
			}
		},
		{
			label: '任务状态',
			prop: 'flag_type',
			formProp: {
				el: ElSelect,
				filterable: true,
				childEl: ElOption,
				source: taskStatusDict,
				clearable: true
			}
		},
		{
			label: '需求进度',
			prop: 'task_process',
			formProp: {
				el: 'BokeSelect',
				filterable: true,
				childEl: ElOption,
				source: demandProcessDict.filter((item) => [2, 4, 5, 6, 7, 8, 20].includes(item.value)),
				clearable: true
			}
		},
		{
			label: '开始时间',
			prop: 'start_time',
			type: 'datetimerange',
			formProp: {
				// width: '388px',
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
				// width: '388px',
				el: ElDatePicker,
				type: 'daterange',
				'start-placeholder': '开始时间',
				'end-placeholder': '结束时间',
				shortcuts: timeShortcuts,
				'value-format': 'YYYY-MM-DD'
			}
		}
	]
})
const changeTabs = (val) => {
	activeTabs.value = val.name
	if (val.name == '全部任务') {
		formModel.task_user_id = null
		formModel.flag_type = null
	} else {
		formModel.task_user_id = userInfo.value?.id
		formModel.flag_type = 1
	}
	handleSearch()
}
const selectionChange = (newSelection) => {
	selectTask.value = newSelection
	console.log(selectTask.value)
}

const isAllEqual = (array) => {
	if (array.length > 0) {
		return !array.some(function (value) {
			return value !== array[0]
		})
	} else {
		return true
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
const filterTableData = async (res) => {
	for (const i of res) {
		if (!i?.demand_detail?.prd_url) continue
		if (i?.demand_detail?.prd_url && i?.demand_detail?.prd_url.includes('boke.feishu.cn')) {
			i.demand_detail.prd_url = await getDocName(i?.demand_detail?.prd_url)
		}
	}
	return res
}
const updateProd = (item) => {
	if (item?.task_process != 6) {
		return message.error('选择的任务必须处于测试验收完成')
	}
	batchForm.task_id_list = item?.id + ''
	batchForm.task_type = item?.task_type
	batchForm.system_id = item?.system
	branchVisible.value = true
}
// 批量操作
// 批量更新正式条件
// 1 必须时同一个任务类型,比如前端
// 2 必须是处于测试完成
// 3 必须是同一个系统,比如查询平台
const handleBatch = () => {
	const arrays = selectTask.value
	console.log(arrays)
	const system_same = arrays.map((item) => item?.demand_detail?.system)
	const task_type_same = arrays.map((item) => item?.task_type)
	// task_process = 6代表测试验收完成，demand_process代表前后端测试验收都完成
	const systemSame = arrays.filter((item) => item.task_process == 6 && item.demand_detail.demand_process == 7)
	if (arrays.length > 1) {
		if (!isAllEqual(system_same)) {
			return message.error('请选择同一个系统下的任务')
		}
		if (!isAllEqual(task_type_same)) {
			return message.error('请选择同一个类型的任务')
		}
	}
	if (systemSame.length != arrays.length) {
		return message.error('选择的所有任务必须处于测试验收完成')
	}
	batchForm.task_id_list = arrays
		?.map((item) => {
			return item.id
		})
		.join(',')
	batchForm.task_type = arrays[0]?.task_type
	batchForm.system_id = arrays[0]?.demand_detail?.system
	branchVisible.value = true
}
const getList = (params) => {
	tracker.push({
		name: 'taskListSearch',
		description: '任务列表搜索',
		behavior: 'search',
		permission_id: 12020201,
		obj: JSON.stringify({
			params: {
				需求名称: formModel.demand_name,
				需求ID: formModel.demand_id,
				任务责任人: formModel.task_user_id,
				需求进度: formModel.task_process,
				创建时间: formModel.start_time,
				完成时间: formModel.complete_time
			}
		})
	})
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
	console.log(bookPage.value)
	const params = filterParams({
		...formModel
	})
	nextTick(() => {
		bookPage.value?.loadData(params, { page: 1 })
	})
}
const handleReset = () => {
	formRef.value?.form.resetFields()
}
const changeBranch = async () => {
	const { system_id, task_type, branch_name } = batchForm
	// 增加分支的index给后端，为设置卡片上分支默认值
	// const branch_index = branchOptions.branchList?.findIndex(item => item.value == batchForm.branch_name)
	try {
		const { items = [] } = await getBranchApi(
			{
				branch_name,
				system_id,
				task_type
			},
			true
		)
		branchOptions.commitList = items
	} catch (error) {
		console.log(error)
	}
}
const handleOpen = async () => {
	branchVisible.value = true
	// 初始化
	branchOptions.branchList = []
	branchOptions.list = []
	branchOptions.commitList = []
	const { system_id, task_type } = batchForm
	try {
		const { items = [] } = await getBranchApi(
			{
				system_id,
				task_type
			},
			true
		)
		branchOptions.list = items
		branchOptions.branchList = items.map((item) => {
			return {
				label: item,
				value: item
			}
		})
		// ?.flatMap((obj) => Object.keys(obj))
		// ?.map((item) => {
		// 	return {
		// 		label: item,
		// 		value: item
		// 	}
		// })
	} catch (error) {
		console.log(error)
	}
}
const handleClose = () => {
	batchForm.branch_name = null
	branchVisible.value = false
}
const handleSubmit = async () => {
	if (!batchForm.branch_name) {
		return message.error('请选择分支')
	}
	if (branchOptions.commitList.length == 0) {
		return message.error('选择的分支没有提交内容,请提交后再更新')
	}
	const branch_list = branchOptions.branchList?.map((item) => {
		return {
			action_value: item.value,
			text: item.value
		}
	})
	const devDict = devOptions.value?.map((item) => item.value) || []
	const isDever = devDict.includes(userInfo.value?.id)
	if (!isDever) {
		return message.error('只允许开发组成员发起更新')
	}
	try {
		showLoading()
		console.log('如果报错了请看这里', {
			task_id_list: batchForm.task_id_list,
			branch_name: batchForm.branch_name,
			branch_list
		})
		const res = await batchUpdateApi(
			{
				task_id_list: batchForm.task_id_list,
				branch_name: batchForm.branch_name,
				branch_list
			},
			true
		)
		hideLoading()
		if (res?.data?.status_code == 200) {
			console.log(res)
			message.success('发起正式更新成功')
			handleClose()
			handleSearch()
		} else {
			message.error(res?.data?.message)
		}
	} catch (error) {
		hideLoading()
		console.log(error)
	}
}
// 显示全部任务
const setAll = () => {
	activeTabs.value = '全部任务'
	formModel.flag_type = null
	formModel.task_user_id = null
}
const init = async () => {
	console.log('init')
	await userStore.getUserInfo()
	optionsStore.getUserOptions()
	optionsStore.getSystemOptions()
	await optionsStore.getDevOptions()
	const devDict = devOptions.value?.map((item) => item.value) || []
	const isDever = devDict.includes(userInfo.value?.id)
	formModel.demand_id = route.query?.demand_id || ''
	formModel.task_id = route.query?.task_id || ''
	if (isDever) {
		formModel.task_user_id = userInfo.value?.id
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
		formModel.flag_type = null
		formModel.task_user_id = userInfo.value?.id
	} else if (formModel.demand_id) {
		setAll()
	}
	handleSearch()
}
onMounted(() => {
	// init()
})
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

.branch-list {
	margin-top: 12px;
	padding: 10px 10px 0 10px;
	border-bottom: 1px solid var(--boke-search-divider-color);

	.progress-item {
		display: flex;
		gap: 10px;
		padding: 10px 0;
		border-top: 1px solid var(--boke-search-divider-color);

		.item-cell:nth-child(1) {
			width: 40%;

			a {
				color: var(--boke-color-main);
			}
		}

		.item-cell:nth-child(2) {
			width: 25%;
		}

		.item-cell:nth-child(3) {
			width: 25%;
		}

		.item-cell {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
}
:deep(.el-card__body) {
	padding-top: 0;
}
</style>
