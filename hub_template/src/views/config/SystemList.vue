<template>
	<BokePage
		ref="bookPage"
		title="系统平台"
		labelWidth="100px"
		:searchColumns="formColumns"
		:form-data="formModel"
		:requestFunc="getList"
		:columns="systemColumns"
		:filterTableData="filterTableData"
		:filterParams="filterParams"
		:pagination="{ pageSize: 15, show: true }"
		row-id="system_id"
		@sort-change="sortChange"
		@expand-change="handleExpand"
	>
		<template #tableTitle>
			<AddSystem @ok="reSearch"
				><el-space>
					<el-icon><Plus /></el-icon>新增系统
				</el-space>
			</AddSystem>
		</template>
		<template #prod_url="{ row }">
			<el-space>
				<span>正式环境：</span>
				<a class="text-executed-sql" :href="row.prod_url" target="_blank">{{ row.prod_url }}</a>
			</el-space>
			<el-space>
				<span>测试环境：</span>
				<a class="text-executed-sql" :href="row.test_url" target="_blank">{{ row.test_url }}</a>
			</el-space>
			<p></p>
		</template>
		<template #expand="{ row }">
			<div class="px-20">
				<boke-title mode="list">仓库信息</boke-title>
				<el-table :data="gitlabData['val' + row.system_id]" style="width: 100%" row-id="system_id" resizable border>
					<template v-for="item in systemInfoColumns" :key="item.id">
						<el-table-column
							v-if="['repository_type', 'developer', 'repository_url'].includes(item.prop)"
							:prop="item.prop"
							:label="item.label"
							:width="item.width"
							:show-overflow-tooltip="item.showOverflowTooltip"
						>
							<template #default="{ row }">
								<div v-if="item.prop == 'developer'">
									{{ getDevloper(row.developer) }}
								</div>
								<div v-if="item.prop == 'repository_type'">
									{{ row.repository_type == 1 ? '前端' : '后端' }}
								</div>
								<div v-if="item.prop == 'repository_url'">
									<a class="text-executed-sql" :href="row.repository_url" target="_blank">{{ row.repository_url }}</a>
								</div>
							</template>
						</el-table-column>
						<el-table-column
							v-else
							:prop="item.prop"
							:label="item.label"
							:width="item.width"
							:show-overflow-tooltip="item.showOverflowTooltip"
						>
						</el-table-column>
					</template>
				</el-table>
			</div>
		</template>
		<template #handle="{ row }">
			<el-space spacer="|">
				<AddSystem :row="row" @ok="reSearch">编辑</AddSystem>
				<boke-text-button
					@click="handleDelete(row)"
					v-track-permission="{
						name: 'systemDelete',
						description: '删除系统',
						permission_id: 12010103,
						behavior: 'delete'
					}"
					>删除</boke-text-button
				>
			</el-space>
		</template>
	</BokePage>
</template>
<script setup>
import { Plus } from '@element-plus/icons-vue'
import { getSystemListApi, delSystemListApi } from './service/system_api'
import { message, confirm } from '@/utils/tools'
import { systemColumns, systemInfoColumns } from './service/config.js'
import { useOptionsStore } from '@/stores'
import { useSystem } from './hook/useSystem'
import tracker from '@/utils/tracking'
import AddSystem from './components/AddSystem.vue'

const optionsStore = useOptionsStore()
const useSystemHook = useSystem()
const bookPage = ref()
const expandId = ref()
const gitlabData = ref({})
const formModel = reactive({
	system_name: null,
	sort_by: '',
	sort_order: ''
})
// 数据源
const formColumns = computed(() => {
	return [
		{
			label: '系统名称',
			prop: 'system_name',
			formProp: {
				el: ElInput,
				clearable: true
			}
		}
	]
})
const getDevloper = (val) => {
	return optionsStore.devOptions.find((item) => item.value == val)?.label
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
	tracker.push({
		name: 'systemSearch',
		description: '列表列表搜索',
		behavior: 'search',
		permission_id: 12010101,
		obj: JSON.stringify({
			params: {
				系统名称: formModel.system_name
			}
		})
	})
	return getSystemListApi(params)
}
const reSearch = () => {
	bookPage.value.tableRef.reloadTable()
}
const handleExpand = async (val, expanded) => {
	if (expanded.length < 0) return
	expandId.value = val.system_id
	const res = await useSystemHook.getRepository(val.system_id)
	gitlabData.value['val' + expandId.value] = res
}
const filterTableData = (val) => {
	return val.map((item) => {
		return {
			...item,
			gitlab: []
		}
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
const handleDelete = async (row) => {
	try {
		await confirm('确定删除嘛？')
		await delSystemListApi({
			system_id: row.system_id
		})
		reSearch()
		message.success('删除成功')
	} catch (error) {
		console.log(error)
	}
}
onMounted(() => {
	optionsStore.getUserOptions()
	optionsStore.getDevOptions()
})
</script>
<style lang="scss">
.text-executed-sql {
	color: var(--boke-color-main);
	width: 100%;
	display: block;
	cursor: pointer;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
