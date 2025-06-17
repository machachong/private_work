<template>
	<BokePage
		ref="bookPage"
		highlight-current-row
		title="TB项目绑定"
		labelWidth="100px"
		:searchColumns="formColumns"
		:form-data="formModel"
		:requestFunc="getList"
		:columns="bindColumns"
		:filterParams="filterParams"
		:pagination="{ pageSize: 15, show: true }"
		@sort-change="sortChange"
		@search="handleSearch"
	>
		<template #handle="{ row }">
			<el-space spacer="|">
				<editBInd :projectList="pjList" :tbProjectList="tbProjectList" :row="row" @ok="reSearch">编辑</editBInd>
				<boke-text-button @click="handleDelete(row)">删除</boke-text-button>
			</el-space>
		</template>
		<template #project_id="{ row }">
			{{ getLabel(projectList, row.project_id) }}
		</template>
		<template #tb_project_id="{ row }">
			<el-space>
				<el-image
					style="max-width: 60px; max-height: 30px"
					:src="getLabel(tbProjectList, row.tb_project_id, 'logo_url')"
					preview-teleported
					:preview-src-list="[getLabel(tbProjectList, row.tb_project_id, 'logo_url')]"
				></el-image>
				<boke-text-button @click="goTb(row.tb_project_id)">{{
					getLabel(tbProjectList, row.tb_project_id)
				}}</boke-text-button>
			</el-space>
		</template>
		<template #creator_feishu_user_id="{ row }">
			{{ getLabel(customUserDict, row.creator_feishu_user_id) }}
		</template>
		<template #tableTitle>
			<editBInd :projectList="pjList" :tbProjectList="tbProjectList" @ok="reSearch">
				<el-space>
					<el-icon><Plus /></el-icon>新增TB项目绑定
				</el-space>
			</editBInd>
		</template>
	</BokePage>
</template>
<script setup>
import { Plus } from '@element-plus/icons-vue'
import { getBindListApi, delBindApi, getTbProjectListApi } from '@/views/dw_demand/service/dw_tb_bind'
import { bindColumns } from './service/config'
import { message, confirm, getLabel } from '@/utils/tools'
import { useDemand } from '@/views/dw_demand/hook/useDemand'
import { searchBindTrack, delBindTrack } from '@/views/dw_demand/service/track'
import editBInd from '@/views/dw_demand/components/dw_tb_bind/EditBInd.vue'

const { projectList, getProjectList, customUserDict, getCustomerUser } = useDemand()

const bookPage = ref()
const formModel = reactive({
	project_id: '',
	tb_project_id: ''
})
const tbProjectList = ref()
const pjList = computed(() => {
	return projectList.value
})
// 数据源
const formColumns = computed(() => {
	return [
		{
			label: '项目列表',
			prop: 'project_id',
			formProp: {
				el: 'BokeSelect',
				filterable: true,
				options: projectList.value,
				clearable: true
			}
		},
		{
			label: '空间列表',
			prop: 'tb_project_id',
			formProp: {
				el: 'BokeSelect',
				filterable: true,
				options: tbProjectList.value,
				isImg: true,
				isDesc: true,
				itemImg: 'logo_url',
				itemDesc: 'tb_project_id',
				clearable: true
			}
		}
	]
})
const filterParams = (params) => {
	if (!params) return params
	const { date } = params
	let begin_time,
		end_time = undefined
	if (date) {
		;[begin_time, end_time] = date
	}
	delete params.date
	return {
		begin_time,
		end_time,
		...params
	}
}
const getList = (params) => {
	return getBindListApi(params)
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
const handleDelete = async (row) => {
	try {
		await confirm('确定删除嘛？')
		await delBindApi({
			id: row.id
		})
		delBindTrack()
		reSearch()
		message.success('删除成功')
	} catch (error) {
		console.log(error)
	}
}
const getTbProjectList = async () => {
	const res = await getTbProjectListApi({
		op_type: 'tb_project'
	})
	tbProjectList.value = res.items?.map((item) => {
		return {
			...item,
			label: item.tb_project_name,
			value: item.tb_project_id
		}
	})
}
const handleSearch = () => {
	searchBindTrack({
		项目: getLabel(projectList.value, formModel.project_id),
		空间: getLabel(tbProjectList.value, formModel.tb_project_id)
	})
}
const goTb = (url) => {
	const newUrl = `https://teambition.pook.com/project/${url}/`
	window.open(newUrl, '_blank')
}
onMounted(() => {
	getProjectList()
	getTbProjectList()
	getCustomerUser()
})
</script>
<style lang="scss"></style>
