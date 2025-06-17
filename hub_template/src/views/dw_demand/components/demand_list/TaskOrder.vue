<template>
	<div class="px-12">
		<div class="flex-around">
			<boke-tabs size="small" v-model:active="formModel.orderType" :tabs="tabs" noUrlChange></boke-tabs>
			<boke-text-button
				class="m-r-10"
				@click="handleBind"
				v-if="formModel.orderType == '关联工单' && demandRow?.demand_process <= 5 && !isDemand"
				>绑定工单</boke-text-button
			>

			<el-space v-if="formModel.orderType == 'DS任务' && demandRow?.demand_process <= 5 && !isDemand">
				<el-popover placement="top" :width="200" trigger="click">
					<template #default>
						<template v-if="options.ds_instance?.length">
							<div class="ds-url" v-for="item in options.ds_instance" :key="item.value" @click="handleGoDs(item)">{{
								item.asset_item_name
							}}</div>
						</template>
						<template v-else> 暂无DS实例 </template>
					</template>
					<template #reference>
						<img class="ds-logo" title="跳转DS平台" src="../../../../assets/img/common/ds-logo.png" alt="" />
					</template>
				</el-popover>
				<BindDsTask
					ref="bindDSRef"
					v-if="formModel.orderType == 'DS任务' && demandRow?.demand_process <= 5 && !isDemand"
					:project_id="demandRow?.project_id"
					:taskRow="taskRow"
					:dsList="tableData"
					:ds_instance="options.ds_instance"
					@ok="handleBindTask"
				></BindDsTask>
			</el-space>
		</div>
		<el-table :data="tableData" style="width: 100%" class="m-t-10 p-b-22" size="small">
			<el-table-column type="expand" v-if="formModel.orderType == '关联工单'">
				<template #default="{ row }">
					<el-table :data="row.infos" style="width: 85%; margin: 0 auto">
						<el-table-column label="数据库" prop="db_name" showOverflowTooltip />
						<el-table-column label="表名" prop="table_name" showOverflowTooltip />
						<el-table-column label="表注释" prop="table_comment" showOverflowTooltip />
					</el-table>
				</template>
			</el-table-column>
			<el-table-column
				v-for="(item, index) in columns"
				:key="index"
				:prop="item.prop"
				:label="item.label"
				:width="item.width"
				:sortable="item.sortable"
				:showOverflowTooltip="item?.showOverflowTooltip"
				:fixed="item.fixed"
			>
				<template #default="{ row }">
					<template v-if="item.prop == 'id'">
						<boke-text-button @click="goUrl(row.url)">{{ row.id }}</boke-text-button>
					</template>
					<template v-if="item.prop == 'name'">
						<boke-text-button @click="goDsUrl(row)">{{ row.name }}</boke-text-button>
					</template>
					<template v-if="item.prop == 'ds_project_code'">
						{{ row.ds_project_code }}
					</template>
					<template v-if="item.prop == 'releaseState'">
						<div>
							<el-tag type="warning" v-if="row.releaseState == 'OFFLINE'">下线</el-tag>
							<el-tag type="success" v-else>上线</el-tag>
						</div>
					</template>
					<template v-if="item.prop == 'handle'">
						<boke-text-button type="danger" :disabled="demandRow.demand_process >= 9" @click="handleDelete(row)"
							>删除</boke-text-button
						>
					</template>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { orderColumns, dsTaskColumns } from '@/views/dw_demand/service/config.js'
import { useDemand } from '../../hook/useDemand.js'
import { message, confirm } from '@/utils/tools'
import {
	getBindDsListApi,
	delBindDsListApi,
	getOperationWorkflowListApi,
	addBindDsListApi,
	getDsInstanceApi
} from '@/views/dw_demand/service/task_api.js'
import settings from '@/utils/config/settings.js'
import BindDsTask from './BindDsTask.vue'
const props = defineProps({
	demandRow: {
		type: Object,
		default: () => {
			return undefined
		}
	},
	taskRow: {
		type: Object,
		default: () => {
			return undefined
		}
	},
	isDemand: {
		type: Boolean,
		default: false
	}
})
const emits = defineEmits(['reSearch'])
const { goUrl, goDsUrl } = useDemand()

const tabs = ref([
	{
		label: '关联工单',
		name: '关联工单'
	},
	{
		label: 'DS任务',
		name: 'DS任务'
	}
])
const formModel = ref({
	orderType: '关联工单'
})
const bindDSRef = ref()
const options = reactive({
	taskList: [],
	orderList: [],
	ds_instance: []
})
const columns = computed(() => {
	if (formModel.value.orderType == '关联工单') {
		return orderColumns
	}
	return dsTaskColumns
})
const tableData = computed(() => {
	if (formModel.value.orderType == 'DS任务') {
		return options.taskList
	}
	return options.orderList
})
const getOperationWorkflowList = async () => {
	console.log('getOperationWorkflowListApi')
	try {
		const params = {
			demand_id: props.demandRow?.id
		}
		const res = await getOperationWorkflowListApi(params)
		options.orderList = res.items
		return res.items
	} catch (error) {
		console.log(error)
	}
}
const getDSworkflowList = async () => {
	console.log('getDSworkflowList')

	try {
		const params = {
			task_id: props.taskRow?.id
		}
		const res = await getBindDsListApi(params)
		options.taskList = res.items
		return res.items
	} catch (error) {
		console.log(error)
	}
}
const handleBind = () => {
	if (formModel.value.orderType == '关联工单') {
		const systemUrl = `${settings.SYSTEM_URL}/dw/change/log`
		goUrl(systemUrl)
	}
}
const handleGoDs = (item) => {
	console.log(item)
	const systemUrl = `${item.ds_url}`
	goUrl(systemUrl)
}
const getDsInstance = async () => {
	try {
		const res = await getDsInstanceApi({
			project_id: props.demandRow?.project_id
		})
		options.ds_instance = res?.items?.map((item) => {
			return {
				...item,
				label: item.asset_item_name,
				value: item.asset_item_id
			}
		})

		console.log(res)
	} catch (error) {
		console.log(error)
	}
}
const handleBindTask = async (val) => {
	try {
		const { ds_project_code, ds_task_code, asset_item_id } = val
		const params = {
			ds_project_code: ds_project_code + '',
			ds_task_code: ds_task_code + '',
			task_id: props.taskRow?.id,
			project_id: props.demandRow?.project_id,
			asset_item_id
		}
		await addBindDsListApi(params)
		message.success('绑定成功')
		bindDSRef.value?.handleReset()
		emits('reSearch')
	} catch (error) {
		console.log(error)
	}
}
const handleDelete = async (row) => {
	try {
		await confirm('确定删除吗?')
		await delBindDsListApi({
			ds_bind_id: row?.ds_bind_id
		})
		message.success('删除成功')
		getDSworkflowList()
	} catch (error) {
		console.log(error)
	}
}
onMounted(() => {
	getDsInstance()
})
defineExpose({
	getDSworkflowList,
	getOperationWorkflowList
})
</script>

<style scoped lang="scss">
.ds-logo {
	height: 20px;
	width: auto;
	cursor: pointer;
}
.ds-url {
	cursor: pointer;
	padding: 4px 0;
	color: var(--boke-color-main);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	&:hover {
		background-color: var(--boke-table-current-row-bg-color);
	}
}
</style>
