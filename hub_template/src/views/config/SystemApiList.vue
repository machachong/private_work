<template>
	<BokePage
		ref="bookPage"
		highlight-current-row
		title="接口配置"
		labelWidth="100px"
		:searchColumns="formColumns"
		:form-data="formModel"
		:requestFunc="getList"
		:columns="apiListColumns"
		:filterParams="filterParams"
		:pagination="{ pageSize: 15, show: true }"
		@sort-change="sortChange"
	>
		<template #tableTitle>
			<AddSystemApi @ok="reSearch">
				<el-space>
					<el-icon><Plus /></el-icon>新增
				</el-space>
			</AddSystemApi>
		</template>
		<template #system="{ row }">
			{{ getLabel(systemOptions, row.system) }}
		</template>
		<template #handle="{ row }">
			<el-space spacer="|">
				<AddSystemApi @ok="reSearch" :row="row">编辑</AddSystemApi>
				<boke-text-button type="primary" @click="handleDelete(row)">删除</boke-text-button>
			</el-space>
		</template>
	</BokePage>
</template>
<script setup>
import { Plus } from '@element-plus/icons-vue'
import { getLabel, message, confirm } from '@/utils/tools'
import { getSystemApiListApi, delSystemApiListApi } from './service/api_list_api.js'
import { apiListColumns } from './service/config'
import { useOptionsStore } from '@/stores'
import AddSystemApi from '@/views/config/components/AddSystemApi.vue'
const optionsStore = useOptionsStore()
const { systemOptions } = storeToRefs(optionsStore)
const bookPage = ref()
const formModel = reactive({
	system_id: null,
	url_path: null,
	path_name: null,
	sort_by: '',
	sort_order: ''
})
// 数据源
const formColumns = computed(() => {
	return [
		{
			label: '接口地址',
			prop: 'url_path',
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
		}
	]
})
const handleDelete = async ({ id }) => {
	try {
		await confirm('确定删除配置？')
		await delSystemApiListApi({
			id
		})
		message.success('删除成功')
		reSearch()
	} catch (error) {
		console.log(error)
	}
}
const filterParams = (params) => {
	if (!params) return params
	const { date } = params
	let begin_time,
		end_time = undefined
	if (date) {
		;[begin_time, end_time] = date
	}
	delete params.date
	console.log({
		begin_time,
		end_time,
		...params
	})
	return {
		begin_time,
		end_time,
		...params
	}
}
const getList = (params) => {
	return getSystemApiListApi(params)
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
	bookPage.value.tableRef.reloadTable()
}
onMounted(() => {
	optionsStore.getSystemOptions()
})
</script>
<style lang="scss"></style>
