<template>
	<boke-card no-padding>
		<boke-tabs
			size="large"
			v-model:active="formModel.flag_type"
			:tabs="tabs"
			@tabClick="changeTabs"
			noUrlChange
		></boke-tabs>
	</boke-card>
	<section class="m-t-16">
		<BokePage
			ref="bookPage"
			highlight-current-row
			labelWidth="110px"
			:searchColumns="formColumns"
			:form-data="formModel"
			:requestFunc="getList"
			:columns="demandColumns"
			:filterParams="filterParams"
			:mounted-default="false"
			:filterTableData="filterTableData"
			:pagination="{ pageSize: 10, show: true }"
			@sort-change="sortChange"
			@search="handleSearch"
			@tableOption="tableOption"
		>
			<template #form_close_flag>
				<el-switch v-model="formModel.close_flag" @change="reSearch"></el-switch>
			</template>
			<template #tableTitle>
				<boke-button type="primary" @click="goDetail">
					<el-space>
						<el-icon><Plus /></el-icon>新增需求
					</el-space>
				</boke-button>
				<boke-button type="primary" :loading="downFile.loading" :disabled="downFile.disabled" @click="handleExport">
					<el-space>
						<el-icon><Download /></el-icon>
						导出需求
					</el-space>
				</boke-button>
			</template>
			<template #system="{ row }">
				{{ getLabel(systemOptions, row.system) }}
			</template>
			<template #demand_process="{ row }">
				<DemandProcess :process="row.demand_process" :showStatus="false" :prd_status="row.prd_status == 1">
				</DemandProcess>
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
				<el-tooltip
					effect="dark"
					raw-content
					:content="`<div style='white-space: pre-line'>${row.demand_content}</div>`"
					placement="top"
				>
					<div class="one-line">{{ row.demand_content }}</div>
				</el-tooltip>
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
			<template #demand_creator="{ row }">
				{{ getLabel(userOptions, row.demand_creator_uid) }}
			</template>
			<template #demand_assignee="{ row }">
				<!-- {{ getLabel(userOptions, row.demand_assignee_uid) }} -->
				<BokeUserProfile
					:userName="getLabel(userOptions, row?.demand_assignee_uid, 'name')"
					:userId="row?.demand_assignee_uid"
				></BokeUserProfile>
			</template>
			<template #prd_status="{ row }">
				<BokeTextStatus mode="text" :status="row.prd_status == 1 ? 'success' : 'default'">
					{{ getLabel(isOrNoDict, row.prd_status) }}
				</BokeTextStatus>
			</template>
			<template #demand_name="{ row }">
				<DemandDetail :demand_id="row.id" title="需求详情" isDemand @ok="reSearch">
					{{ row.demand_name }}
				</DemandDetail>
			</template>
			<template #handle="{ row }">
				<el-space spacer="|">
					<span v-if="[3, 9].includes(row.demand_process) && row.demand_assignee_uid != userStore.userInfo?.id"
						>需求进行中</span
					>
					<DemandStatus
						v-else-if="[0, 1, 3, 9].includes(row.demand_process) || getClaimStatus(row)"
						:demandRow="row"
						:userInfo="userStore.userInfo"
						type="demand"
						@ok="reSearch"
					></DemandStatus>
					<span v-else-if="row.demand_process == 20" class="color-describe">需求已关闭</span>
					<span v-else-if="[10, 11, 12].includes(row.demand_process)" class="color-describe">{{
						getLabel(demandProcessDict, row.demand_process)
					}}</span>
					<span v-else>需求进行中</span>
					<boke-text-button
						@click="closeDemand(row.id)"
						v-if="isSuper && ![10, 11, 12, 20].includes(row.demand_process)"
						>关闭</boke-text-button
					>
					<SendMsg v-if="![0, 1, 10, 11, 12, 20]?.includes(row?.demand_process)" :id="row?.id"></SendMsg>
				</el-space>
			</template>
		</BokePage>
	</section>
</template>
<script setup>
import { Plus, Download } from '@element-plus/icons-vue'
// import dayjs from "dayjs"
import { getPoolListApi, closeDemandApi } from './service/demand_api.js'
import { timeShortcuts, setSession, getSession } from '@/utils/tools'
import { demandColumns } from './service/config'
import { storeToRefs } from 'pinia'
import { useOptionsStore, useUserStore } from '@/stores'
import { getLabel, message, confirm, openFeishuDoc } from '@/utils/tools'
import { demandProcessDict, isOrNoDict, demandTypeDict } from './service/config'
import { useDemandList } from './hook/useDemandList.js'
import { exportDemandApi } from '@/views/demand/service/demand_api'
import tracker from '@/utils/tracking'
import DemandDetail from './components/demand_list/DemandDetail.vue'
import DemandStatus from './components/demand_list/DemandStatus.vue'
import DemandProcess from './components/demand_list/DemandProcess.vue'
import BokeSelect from '@/components/form/select/BokeSelect.vue'
import SendMsg from '@/views/demand/components/demand_list/SendMsg.vue'

const optionsStore = useOptionsStore()
const userStore = useUserStore()
const { resolveImg, getFeishuDocument } = useDemandList()
const router = useRouter()
const route = useRoute()
const { userOptions, systemOptions } = storeToRefs(optionsStore)
const bookPage = ref()
const tabs = ref([
	{
		label: '未排期',
		name: 1
	},
	{
		label: '开发中',
		name: 2
	},
	{
		label: '已完成',
		name: 3
	},
	{
		label: '全部',
		name: 4
	}
])
const formModel = reactive({
	demand_name: null,
	system_id: null,
	demand_process: null,
	prd_status: null,
	complete_time: [],
	create_time: [],
	update_time: [],
	demand_assignee_uid: null,
	flag_type: 1,
	id: null,
	close_flag: true,
	sort_by: '',
	sort_order: '',
	demand_type: ''
})
// formModel.date = getDate()
// 数据源
const formColumns = computed(() => {
	return [
		{
			label: '需求名称',
			prop: 'demand_name',
			formProp: {
				el: ElInput,
				placeholder: '请输入需求名称',
				clearable: true
			}
		},
		{
			label: '需求人',
			prop: 'demand_assignee_uid',
			formProp: {
				el: BokeSelect,
				filterable: true,
				options: userOptions.value,
				clearable: true
			}
		},
		{
			label: '平台',
			prop: 'system_id',
			formProp: {
				el: BokeSelect,
				filterable: true,
				options: systemOptions.value,
				clearable: true
			}
		},
		{
			label: '需求进度',
			prop: 'demand_process',
			formProp: {
				el: BokeSelect,
				filterable: true,
				options: newDemandProcessDict.value,
				clearable: true
			}
		},
		{
			label: '是否需要原型',
			prop: 'prd_status',
			formProp: {
				el: ElSelect,
				filterable: true,
				childEl: ElOption,
				source: isOrNoDict,
				clearable: true
			}
		},
		{
			label: '需求类型',
			prop: 'demand_type',
			formProp: {
				el: ElSelect,
				filterable: true,
				childEl: ElOption,
				source: demandTypeDict,
				clearable: true
			}
		},
		{
			label: '创建时间',
			prop: 'create_time',
			type: 'datetimerange',
			formProp: {
				// width: '490px',
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
				// width: '490px',
				el: ElDatePicker,
				type: 'daterange',
				'start-placeholder': '开始时间',
				'end-placeholder': '结束时间',
				shortcuts: timeShortcuts,
				'value-format': 'YYYY-MM-DD'
			}
		},
		{
			label: '更新时间',
			prop: 'update_time',
			type: 'datetimerange',
			formProp: {
				// width: '490px',
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
				slot: 'form_close_flag'
			}
		}
	]
})
const isSuper = computed(() => {
	return userStore.userInfo?.is_super || userStore.userInfo?.super_system_ids?.includes(9)
})
const downFile = ref({
	loading: false,
	disabled: false
})
const tableOption = (value) => {
	if (value?.total == 0) {
		downFile.value.disabled = true
	} else {
		downFile.value.disabled = false
	}
}
const handleExport = async () => {
	try {
		await confirm('确定导出当前列表内容？')
		const params = filterParams({
			...formModel
		})
		downFile.value.loading = true
		const { items } = await exportDemandApi(params)
		downFile.value.loading = false
		if (!items) return
		openFeishuDoc(items)
	} catch (error) {
		downFile.value.loading = false
		console.log(error)
	}
}
const closeDemand = async (id) => {
	try {
		await confirm('确定关闭需求嘛？')
		const res = await closeDemandApi({
			id
		})
		console.log(res)
		message.success('关闭成功')
		reSearch()
	} catch (error) {
		console.log(error)
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
const changeTabs = (val) => {
	formModel.flag_type = val.name
	// 2024-5-13 切换需求状态,需求进度变换,切置空
	formModel.demand_process = null
	setSession('demand_tabs', formModel.flag_type)
	reSearch()
}
const newDemandProcessDict = computed(() => {
	switch (formModel.flag_type) {
		case 1:
			return demandProcessDict.filter((item) => [0, 1, 2, 3, 4, 20].includes(item.value))
		case 2:
			return demandProcessDict.filter((item) => [5, 6, 7, 8].includes(item.value))
		case 3:
			// 2024-5-13 需求人验收分配为已完成
			return demandProcessDict.filter((item) => [9, 10, 11, 12].includes(item.value))
		default:
			return demandProcessDict
	}
})
// 判断认领状态是否可以点击认领
const getClaimStatus = (row) => {
	if (row.demand_process == 4 && row.claim_user_info?.front_type == userStore.userInfo?.id && row.front_status == 0) {
		return true
	}
	if (row.demand_process == 4 && row.claim_user_info?.back_type == userStore.userInfo?.id && row.back_status == 0) {
		return true
	}
	return false
}
const filterParams = (params) => {
	if (!params) return params
	const { complete_time, create_time, update_time } = params
	console.log(update_time)
	let begin_update_time,
		end_update_time,
		begin_complete_time,
		end_complete_time,
		begin_create_time,
		end_create_time = undefined
	if (complete_time) {
		;[begin_complete_time, end_complete_time] = complete_time
	}
	if (create_time) {
		;[begin_create_time, end_create_time] = create_time
	}
	if (update_time) {
		;[begin_update_time, end_update_time] = update_time
	}
	delete params.complete_time
	delete params.create_time
	delete params.update_time
	return {
		begin_complete_time,
		end_complete_time,
		begin_create_time,
		end_create_time,
		begin_update_time,
		end_update_time,
		...params
	}
}
const getList = (params) => {
	return getPoolListApi(params)
}
const handleSearch = () => {
	tracker.push({
		name: 'demandListSearch',
		description: '需求池列表搜索',
		behavior: 'search',
		permission_id: 12020101,
		obj: JSON.stringify({
			params: {
				需求名称: formModel.demand_name,
				需求人: formModel.demand_assignee_uid,
				平台: formModel.system_id,
				需求进度: formModel.demand_process,
				是否需要原型: formModel.prd_status,
				创建时间: formModel.create_time,
				完成时间: formModel.complete_time
			}
		})
	})
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
const reSearch = () => {
	const params = filterParams({
		...formModel
	})
	bookPage.value.tableRef.loadData(params, { page: 1 })
}
const goTask = (demand_id) => {
	router.push({
		path: '/demand/tasklist',
		query: {
			demand_id
		}
	})
}
const goDetail = () => {
	router.push({
		path: '/demand/adddemand'
	})
}
onBeforeMount(() => {
	try {
		const cacheTab = getSession('demand_tabs')
		if (cacheTab) {
			formModel.flag_type = Number(cacheTab)
		} else {
			setSession('demand_tabs', formModel.flag_type)
		}
	} catch (error) {
		console.log(error)
	}
})
const init = () => {
	optionsStore.getSystemOptions()
	optionsStore.getUserOptions()
	userStore.getUserInfo().then(() => {
		const queryType = route.query?.type
		if (route.query?.demand_id) {
			formModel.id = route.query?.demand_id
			changeTabs({
				name: 4
			})
		}
		if (queryType == 1) {
			formModel.demand_assignee_uid = userStore.userInfo?.id
			changeTabs({
				name: 4
			})
		} else if (queryType == 2) {
			formModel.demand_assignee_uid = userStore.userInfo?.id
			formModel.demand_process = 9
			changeTabs({
				name: 4
			})
		} else {
			formModel.demand_assignee_uid = null
			reSearch()
		}
	})
}
onActivated(() => {
	init()
})
</script>
<style lang="scss"></style>
