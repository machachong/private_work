<template>
	<div>
		<div class="flex-around" v-if="isMilestone">
			<div></div>
			<boke-select
				style="width: 300px"
				v-model="searchId"
				clearable
				:options="nodeDict"
				placeholder="请选择节点"
			></boke-select>
			<!-- <boke-button type="primary" :icon="Plus" v-if="canAddDemand">新增需求</boke-button> -->
		</div>
		<el-table class="m-t-10" :data="searchDemandList" style="width: 100%">
			<el-table-column prop="demand_name" label="需求名称" show-overflow-tooltip>
				<template #default="scope">
					<span class="demand-name color-main pointer" @click="handleGoDemand(scope.row)">{{
						scope.row.demand_name
					}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="demand_stauts" label="状态" width="120px">
				<template #default="scope">
					<el-tag effect="light" :type="getLabel(statusDict, scope.row.demand_stauts, 'type')">
						{{ getLabel(statusDict, scope.row.demand_stauts) }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="executors" label="执行人" show-overflow-tooltip>
				<template #default="scope">
					<span class="m-r-4" v-for="item in scope.row.executors?.split(',')" :key="item">
						<BokeUserProfile :userName="getLabel(departmentUserOptions, item)" :feishuUserId="item"></BokeUserProfile>
					</span>
				</template>
			</el-table-column>
			<el-table-column prop="node_name" label="节点名称" show-overflow-tooltip v-if="showNode"> </el-table-column>
			<el-table-column prop="update_time" label="最近更新时间" width="164px" sortable>
				<template #default="scope">
					<span>{{ scope.row.update_time ? dayjs(scope.row.update_time).format('YYYY-MM-DD HH:mm:ss') : '' }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="deadline_time" label="完成时间/预计时间" width="166px" sortable>
				<template #default="scope">
					<span>{{ scope.row.deadline_time ? formatDate(scope.row.deadline_time) : '' }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="handle" label="操作" width="100px">
				<!-- <template #default="scope">
					<boke-text-button type="primary" @click="handleGoDemand(scope.row)">查看需求</boke-text-button>
				</template> -->
				<template #default="scope">
					<DaDemandDetail
						v-if="scope.row.demand_table == 'data_demand'"
						:demand_id="scope.row.demand_id"
						title="需求详情"
						readonly
						isDemand
						:demandRow="scope.row"
					>
						查看需求
					</DaDemandDetail>
					<DwDemandDetail
						v-if="scope.row.demand_table == 'dw_demand'"
						:demand_id="scope.row.demand_id"
						title="需求详情"
						readonly
						isDemand
						:demandRow="scope.row"
					>
						查看需求
					</DwDemandDetail>
					<DemandDetail
						v-if="scope.row.demand_table == 'dev_demand'"
						isDemand
						:demand_id="scope.row.demand_id"
						title="需求详情"
						:readonly="true"
					>
						查看需求
					</DemandDetail>
					<DwDemandDetail
						v-if="scope.row.demand_table == 'db_demand'"
						:demand_id="scope.row.demand_id"
						title="需求详情"
						readonly
						isDemand
						isDb
						:demandRow="scope.row"
					>
						查看需求
					</DwDemandDetail>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script setup>
// import { Plus } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { statusDict } from '../config/config'
import { getLabel, formatDate } from '@/utils/tools'
import { useOptionsStore } from '@/stores'
import DaDemandDetail from '@/views/da_demand/components/demand_list/DemandDetail.vue'
import DwDemandDetail from '@/views/dw_demand/components/demand_list/DemandDetail.vue'
import DemandDetail from '@/views/demand/components/demand_list/DemandDetail.vue'
const { demandList, nodeDict, nodeId, isMilestone, showNode } = defineProps({
	demandList: {
		type: Array,
		default: () => []
	},
	nodeDict: {
		type: Array,
		default: () => []
	},
	nodeId: {
		type: [String, Number],
		default: ''
	},
	isMilestone: {
		type: Boolean,
		default: false
	},
	showNode: {
		type: Boolean,
		default: true
	}
})
const emits = defineEmits(['close'])
const { getDepartmentUser } = useOptionsStore()
const { departmentUserOptions } = storeToRefs(useOptionsStore())
const router = useRouter()

const searchId = ref('')

// watch(
// 	() => nodeId,
// 	(oldValue, newValue) => {
// 		console.log('nodeId', oldValue, newValue)
// 		searchId.value = nodeId
// 	}
// )
const searchDemandList = computed(() => {
	if (!searchId.value) {
		return demandList
	}
	return demandList.filter((item) => item.node_id == searchId.value)
})
watchEffect(() => {
	searchId.value = nodeId
})
/**
 * 跳转需求详情
 */
const handleGoDemand = (row) => {
	emits('close')
	switch (row.demand_table) {
		case 'data_demand':
			router.push(`/da_demand/da_demandlist?demand_id=${row.demand_id}`)
			break
		case 'dw_demand':
			router.push(`/dw_demand/dw_demandlist?demand_id=${row.demand_id}`)
			break
		case 'dev_demand':
			router.push(`/demand/demandlist?demand_id=${row.demand_id}`)
			break
		case 'db_demand':
			router.push(`/db_demand/db_demandlist?demand_id=${row.demand_id}`)
			break
		default:
			break
	}
}
onMounted(() => {
	getDepartmentUser(5)
})
</script>

<style lang="scss" scoped></style>
