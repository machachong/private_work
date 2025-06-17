<template>
	<BokePage
		ref="bookPage"
		highlight-current-row
		title="飞书卡片模板"
		labelWidth="100px"
		:searchColumns="formColumns"
		:form-data="formModel"
		:requestFunc="getList"
		:columns="cardTemplateColumns"
		:filterParams="filterParams"
		:pagination="{ pageSize: 15, show: true }"
		@sort-change="sortChange"
	>
		<template #tableTitle>
			<AddCardTemplate :robot="options.robot" @ok="reSearch">
				<el-space>
					<el-icon><Plus /></el-icon>新增
				</el-space>
			</AddCardTemplate>
		</template>
		<template #robot_form>
			<BokeRobotSelect v-model="formModel.robot"></BokeRobotSelect>
		</template>
		<template #system="{ row }">
			{{ getLabel(systemOptions, row.system) }}
		</template>
		<template #user_id="{ row }">
			{{ getLabel(devOptions, row.user_id) }}
		</template>
		<template #robot="{ row }">
			<el-space>
				<el-image
					:src="options.robot?.find((item) => item.value == row.robot)?.avatar_url"
					alt=""
					style="width: 32px; height: 32px"
				></el-image>
				<span>{{ options.robot?.find((item) => item.value == row.robot)?.label }}</span>
			</el-space>
		</template>
		<template #code_info="{ row }">
			<boke-text-button @click="handleLook(row.code_info)">查看详情</boke-text-button>
		</template>
		<template #handle="{ row }">
			<el-space spacer="|">
				<AddCardTemplate @ok="reSearch" :row="row">编辑</AddCardTemplate>
				<boke-text-button type="primary" @click="handleDelete(row)">删除</boke-text-button>
				<boke-text-button type="primary" @click="goFeishuOpen(row)">模板配置</boke-text-button>
			</el-space>
		</template>
	</BokePage>
	<BokeEditorDialog
		title="飞书卡片模板详情"
		v-model="currentTemplate.visible"
		width="1000px"
		destroy-on-close
		:content="currentTemplate.content"
		mode="json"
	>
	</BokeEditorDialog>
</template>
<script setup>
import { Plus } from "@element-plus/icons-vue"
import { getLabel, message, confirm } from "@/utils/tools"
import { getCardTemplateApi, delCardTemplateApi } from "./service/card_template_api.js"
import { cardTemplateColumns } from "./service/config"
import { useOptionsStore } from "@/stores"
import { getRobotListApi } from "@/views/config/service/feishu_api"
import AddCardTemplate from "@/views/config/components/AddCardTemplate.vue"
const optionsStore = useOptionsStore()

const { systemOptions, devOptions } = storeToRefs(optionsStore)
const bookPage = ref()
const options = reactive({
	robot: []
})
const formModel = reactive({
	template_id: null,
	card_name: null,
	robot: null,
	user_id: "",
	sort_by: "",
	sort_order: ""
})
const currentTemplate = ref({
	visible: false,
	content: ''
})
// 数据源
const formColumns = computed(() => {
	return [
		{
			label: '卡片模板ID',
			prop: 'template_id',
			formProp: {
				el: ElInput,
				clearable: true,
				placeholder: '请输入'
			}
		},
		{
			label: '卡片名称',
			prop: 'card_name',
			formProp: {
				el: ElInput,
				clearable: true,
				placeholder: '请输入接口名称'
			}
		},
		{
			label: "发送机器人",
			prop: "robot",
			formProp: {
				el: "BokeSelect",
				slot: "robot_form",
				filterable: true,
				childEl: ElOption,
				// source: options.robot,
				// "item-value": "app_id",
				// "item-label": "app_name",
				clearable: true
			}
		},
		{
			label: '创建人',
			prop: 'user_id',
			formProp: {
				el: ElSelect,
				filterable: true,
				childEl: ElOption,
				source: devOptions.value,
				clearable: true
			}
		}
	]
})
const handleLook = (value) => {
	currentTemplate.value.visible = true
	currentTemplate.value.content = value
}
const handleDelete = async ({ template_id }) => {
	try {
		await confirm('确定删除配置？')
		await delCardTemplateApi({
			template_id
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
	return getCardTemplateApi(params)
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
const goFeishuOpen = (row) => {
	const url = `https://open.feishu.cn/cardkit/editor?cardId=${row.template_id}&cardLocale=zh_cn`
	window.open(url, "_target")
}
const reSearch = () => {
	bookPage.value.tableRef.reloadTable()
}
// "item-value": "app_id",
// 				"item-label": "app_name",
const getDict = async () => {
	const res = await getRobotListApi({ size: 9999 })
	options.robot = res?.items?.map((item) => {
		return {
			label: item.app_name,
			value: item.app_id,
			...item
		}
	})
}
onMounted(() => {
	optionsStore.getSystemOptions()
	optionsStore.getDevOptions()
	getDict()
})
</script>
<style lang="scss"></style>
