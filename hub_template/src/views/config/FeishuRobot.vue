<template>
	<BokePage
		ref="bookPage"
		highlight-current-row
		title="飞书机器人"
		labelWidth="100px"
		:searchColumns="formColumns"
		:form-data="formModel"
		:requestFunc="getList"
		:columns="robotColumns"
		:filterParams="filterParams"
		:pagination="{ pageSize: 15, show: true }"
		@sort-change="sortChange"
	>
		<template #handle="{ row }">
			<el-space spacer="|">
				<AddRobot :row="row" @ok="reSearch">编辑</AddRobot>
				<boke-text-button
					@click="handleDelete(row)"
					v-track-permission="{
						name: 'feishuRobotDelete',
						description: '删除飞书机器人',
						permission_id: 12010203,
						behavior: 'delete'
					}"
					>删除</boke-text-button
				>
			</el-space>
		</template>
		<template #app_name="{ row }">
			<el-space>
				<el-image :src="row?.avatar_url" alt="" style="width: 32px; height: 32px"></el-image>
				<span>{{ row.app_name }}</span>
			</el-space>
		</template>
		<template #tableTitle>
			<AddRobot @ok="reSearch">
				<el-space>
					<el-icon><Plus /></el-icon>新增飞书机器人
				</el-space>
			</AddRobot>
		</template>
	</BokePage>
</template>
<script setup>
import { Plus } from "@element-plus/icons-vue"
import { getRobotListApi, deleteRobotApi } from "./service/feishu_api"
import { robotColumns } from "./service/config"
import { message, confirm } from "@/utils/tools"
import tracker from "@/utils/tracking"
import AddRobot from "./components/AddRobot.vue"
const bookPage = ref()
const formModel = reactive({
	app_name: null
})
// 数据源
const formColumns = computed(() => {
	return [
		{
			label: "机器人名称",
			prop: "app_name",
			formProp: {
				el: ElInput,
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
		name: "feishuRobotSearch",
		description: "飞书机器人列表搜索",
		behavior: "search",
		permission_id: 12010201,
		obj: JSON.stringify({
			params: {
				飞书机器人: formModel.app_name
			}
		})
	})
	return getRobotListApi(params)
}
const sortChange = ({ order, prop }) => {
	if (order === "ascending") order = "asc"
	if (order === "descending") order = "desc"
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
		await confirm("确定删除嘛？")
		await deleteRobotApi({
			app_id: row.app_id
		})
		reSearch()
		message.success("删除成功")
	} catch (error) {
		console.log(error)
	}
}
onMounted(() => {})
</script>
<style lang="scss"></style>
