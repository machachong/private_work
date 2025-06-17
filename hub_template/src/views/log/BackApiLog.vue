<template>
	<BokePage
		ref="bookPage"
		highlight-current-row
		title="后端接口日志"
		labelWidth="100px"
		:searchColumns="formColumns"
		:form-data="formModel"
		:requestFunc="getList"
		:columns="backApiLogColumns"
		:filterParams="filterParams"
		:mountedDefault="false"
		:pagination="{ pageSize: 15, show: true }"
		@sort-change="sortChange"
	>
		<template #resp_code="{ row }">
			<el-tooltip class="box-item" effect="dark" :content="statusCodeDict[row.resp_code]" placement="top">
				<span v-if="!row.resp_code"></span>
				<boke-text-status v-else :status="getStatus(row.resp_code)">{{ row.resp_code }}</boke-text-status>
			</el-tooltip>
		</template>
		<template #cost_time="{ row }"> {{ row.cost_time }}秒 </template>
		<template #body="{ row }">
			<ResponesResult title="请求参数" :json="row.body"></ResponesResult>
		</template>
		<template #response="{ row }">
			<ResponesResult title="接口返回" :json="row.response"></ResponesResult>
		</template>
		<template #user_id="{ row }">
			{{ getLabel(userOptions, row.user_id) }}
		</template>
	</BokePage>
</template>
<script setup>
import { getLabel, timeShortcuts } from '@/utils/tools'
import { getBackLogApi } from './service/back_log_api'
import { backApiLogColumns, fetchTypeDict, statusCodeDict, useCodeDict } from './service/config'
import { useOptionsStore } from '@/stores'
import BokeSelect from '@/components/form/select/BokeSelect.vue'
import ResponesResult from '@/views/log/components/ResponesResult.vue'

const optionsStore = useOptionsStore()
const route = useRoute()
const { userOptions, systemOptions } = storeToRefs(optionsStore)
const bookPage = ref()
const formModel = reactive({
	app_name: null,
	sort_by: '',
	sort_order: ''
})
// 数据源
const formColumns = computed(() => {
	return [
		{
			label: '接口地址',
			prop: 'ex_url_path',
			formProp: {
				el: ElInput,
				clearable: true,
				placeholder: '请输入接口地址'
			}
		},
		{
			label: '接口名称',
			prop: 'path_name',
			formProp: {
				el: ElInput,
				clearable: true,
				placeholder: '请输入接口名称'
			}
		},
		{
			label: '系统平台',
			prop: 'system_id',
			formProp: {
				el: ElSelect,
				filterable: true,
				childEl: ElOption,
				source: systemOptions.value,
				clearable: true
			}
		},
		{
			label: '请求方式',
			prop: 'method',
			formProp: {
				el: ElSelect,
				filterable: true,
				childEl: ElOption,
				source: fetchTypeDict,
				clearable: true
			}
		},
		{
			label: '请求用户',
			prop: 'user_id',
			formProp: {
				el: BokeSelect,
				filterable: true,
				options: userOptions.value,
				clearable: true
			}
		},
		{
			label: '状态码',
			prop: 'resp_code',
			formProp: {
				el: BokeSelect,
				filterable: true,
				options: useCodeDict,
				clearable: true
			}
		},
		{
			label: '请求时间',
			prop: 'timeShortcuts',
			type: 'datetimerange',
			formProp: {
				width: '490px',
				el: ElDatePicker,
				type: 'datetimerange',
				'start-placeholder': '开始时间',
				'end-placeholder': '结束时间',
				shortcuts: timeShortcuts,
				'value-format': 'YYYY-MM-DD HH:mm:ss'
			}
		}
	]
})
const filterParams = (params) => {
	if (!params) return params
	const { timeShortcuts } = params
	let begin_timeShortcuts,
		end_timeShortcuts = undefined
	if (timeShortcuts) {
		;[begin_timeShortcuts, end_timeShortcuts] = timeShortcuts
	}
	delete params.timeShortcuts
	return {
		begin_timeShortcuts,
		end_timeShortcuts,
		...params
	}
}
const getList = (params) => {
	return getBackLogApi(params)
}
const sortChange = ({ order, prop }) => {
	if (order === 'ascending') order = 'asc'
	if (order === 'descending') order = 'desc'
	formModel.sort_by = prop
	formModel.sort_order = order
	const params = filterParams({
		...formModel
	})
	bookPage.value.tableRef.loadData(params, { page: 1 })
}
const getStatus = (resp_code) => {
	if (!resp_code) {
		return 'default'
	}
	resp_code = resp_code.toString()
	if (resp_code?.includes('20')) {
		return 'success'
	} else if (resp_code?.includes('40')) {
		return 'warning'
	} else if (resp_code?.includes('50')) {
		return 'fail'
	} else {
		return 'default'
	}
}
onMounted(() => {
	optionsStore.getSystemOptions()
	optionsStore.getUserOptions()
})
onActivated(() => {
	const params = route.query
	console.log(7878, params)
	if (params) {
		console.log(route.query)
		// timeShortcuts
		formModel.ex_url_path = params?.path
		formModel.timeShortcuts = [params?.start_date, params?.end_date]
	}
	if (params?.type == 2) {
		sortChange({ order: 'descending', prop: 'cost_time' })
	} else {
		sortChange({ order: '', prop: '' })
	}
})
</script>
<style lang="scss"></style>
