<template>
	<BokePage
		ref="bookPage"
		highlight-current-row
		title="需求报表统计"
		labelWidth="100px"
		:searchColumns="formColumns"
		:form-data="formModel"
		:requestFunc="getList"
		:columns="sysVersionColumns"
		:filterParams="filterParams"
		:pagination="{ pageSize: 15, show: true }"
		:mountedDefault="false"
		@sort-change="sortChange"
		@expand-change="handleExpand"
	>
		<template #tableTitle>
			<AddVersion>新增版本</AddVersion>
		</template>
	</BokePage>
</template>
<script setup>
import dayjs from "dayjs"

import { getSessionFullLogApi } from "./service/report_api"
import { timeShortcuts } from "@/utils/tools/date.js"
import { sysVersionColumns } from "./service/config"

import AddVersion from "@/views//report/components/system_version/AddVersion.vue"

const bookPage = ref()
const getDate = () => {
	const date = new Date()
	const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
	const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
	startOfDay.setTime(startOfDay.getTime() - 3600 * 1000 * 24 * 7)
	endOfDay.setTime(endOfDay.getTime() - 3600 * 1000 * 24 * 1)
	return [
		dayjs(startOfDay).format("YYYY-MM-DD HH:mm:ss"),
		dayjs(endOfDay).format("YYYY-MM-DD HH:mm:ss")
	]
}
const formModel = reactive({
	date: null,
	account_name: null,
	host_name: null
})
formModel.date = getDate()
// 数据源
const formColumns = computed(() => {
	return [
		{
			label: "版本名称",
			prop: "host_name",
			formProp: {
				// width: '300',
				el: ElInput,
				clearable: true
			}
		},
		{
			label: "日期范围",
			prop: "date",
			type: "datetimerange",
			formProp: {
				width: "480px",
				el: ElDatePicker,
				type: "datetimerange",
				"start-placeholder": "开始时间",
				"end-placeholder": "结束时间",
				shortcuts: timeShortcuts,
				"value-format": "YYYY-MM-DD HH:mm:ss"
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
	return getSessionFullLogApi(params)
}
const sortChange = ({ order, prop }) => {
	if (order === "ascending") order = "asc"
	if (order === "descending") order = "desc"
	const params = filterParams({
		...formModel,
		sort_by: prop,
		sort_order: order
	})
	bookPage.value.tableRef.loadData(params, { page: 1 })
}
onMounted(() => {})
</script>
<style lang="scss"></style>
