<template>
	<div>
		<div class="flex-around" v-permission="120605">
			<div></div>
			<boke-button type="primary" :icon="Plus" @click="handleAddStone">新增里程碑节点</boke-button>
		</div>
		<el-table class="m-t-10" :data="nodeArray" style="width: 100%">
			<el-table-column prop="node_name" label="节点名称" width="160px" show-overflow-tooltip>
				<template #default="scope">
					<el-input
						v-if="canEdit(scope.row.type)"
						v-model="scope.row.node_name"
						clearable
						placeholder="请输入节点名称"
					/>
					<span v-else>{{ scope.row.node_name }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="description" label="执行人" width="200px" show-overflow-tooltip>
				<template #default="scope">
					<boke-select
						style="min-width: 174px"
						v-if="canEdit(scope.row.type)"
						v-model="scope.row.notice_executors"
						:options="optionsStore.departmentUserOptions"
						collapse-tags
						clearable
						multiple
						placeholder="请选择"
					/>
					<span v-else>
						<span class="m-r-4" v-for="item in resolveUser(scope.row.notice_executors)" :key="item">
							<boke-user-profile
								:userName="getLabel(optionsStore.departmentUserOptions, item)"
								:feishuUserId="item + ''"
							></boke-user-profile>
						</span>
					</span>
				</template>
			</el-table-column>
			<el-table-column prop="description" label="节点状态" width="160px" v-if="isEdit">
				<template #default="scope">
					<boke-select
						style="min-width: 130px"
						v-if="canEdit(scope.row.type)"
						v-model="scope.row.status"
						:options="statusDict"
						clearable
						placeholder="请选择状态"
					/>
					<span v-else>
						<el-tag effect="light" :type="getLabel(statusDict, scope.row.status, 'type')">
							{{ getLabel(statusDict, scope.row.status) }}
						</el-tag>
					</span>
				</template>
			</el-table-column>
			<el-table-column prop="demand_num" label="需求数" width="90px" v-if="isEdit">
				<template #default="scope">
					<span :class="{ 'color-success': scope.row.end_count > 0 }">{{ scope.row.end_count }}</span
					>/{{ scope.row.total_count }}
				</template>
			</el-table-column>
			<el-table-column prop="deadline_time" label="期望完成时间" width="180px" sortable>
				<template #default="scope">
					<el-date-picker
						v-if="canEdit(scope.row.type)"
						v-model="scope.row.deadline_time"
						type="date"
						style="width: 150px"
						value-format="YYYY-MM-DD"
						placeholder="请选择"
						:disabled-date="disabledAbortToday"
					/>
					<span v-else>{{ scope.row.deadline_time }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="node_description" label="描述" min-width="160px" show-overflow-tooltip>
				<template #default="scope">
					<el-input
						v-if="canEdit(scope.row.type)"
						:rows="1"
						type="textarea"
						v-model="scope.row.node_description"
						placeholder="请输入节点描述"
					/>
					<span v-else>{{ scope.row.node_description }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="handle" label="操作" width="180px" fixed="right">
				<template #default="scope">
					<div v-if="canEdit(scope.row.type)">
						<boke-text-button type="primary" @click="handleRowSave(scope.row)">保存</boke-text-button>
						<boke-text-button type="info" @click="handleRowCancle(scope)">取消</boke-text-button>
					</div>
					<div v-else>
						<boke-text-button type="primary" @click="handleEditStone(scope.row)" v-permission="120607"
							>编辑</boke-text-button
						>
						<boke-text-button
							v-if="isAdd || scope.row.status == 0"
							type="danger"
							@click="handleRowDelete(scope)"
							v-permission="120606"
							>删除</boke-text-button
						>
						<boke-text-button
							v-if="isEdit && scope.row.total_count > 0"
							type="primary"
							@click="handleLookDemand(scope.row)"
							>查看需求</boke-text-button
						>
					</div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import { statusDict, defaultNode } from '../config/config'
import { getLabel, message, confirm, disabledAbortToday } from '@/utils/tools'
import { useOptionsStore } from '@/stores'
import { addNodeApi, updateNodeApi, delNodeApi } from '../service'
import { cloneDeep } from 'lodash'
import { editMiliestoneNode, creatMiliestoneNode, deleteMiliestoneNode } from '../service/track'

const { mode, milestoneId } = defineProps({
	mode: {
		type: String,
		default: 'edit' // add, edit
	},
	milestoneId: {
		type: [String, Number],
		default: ''
	}
})
const emits = defineEmits(['ok', 'handleLookDemand'])
const nodeList = defineModel()
const optionsStore = useOptionsStore()
const nodeArray = ref([])
const isEdit = computed(() => {
	return mode == 'edit'
})
const isAdd = computed(() => {
	return mode == 'add'
})
const canEdit = (value) => {
	return ['add', 'edit'].includes(value)
}
const handleLookDemand = (row) => {
	emits('handleLookDemand', row.id)
}
watchEffect(() => {
	nodeArray.value = cloneDeep(nodeList.value)
})
/**
 * 处理编辑里程碑节点
 * @param {Object} row 当前行数据
 */
const handleEditStone = (row) => {
	console.log(row)

	row.type = 'edit'
}

/**
 * 处理保存编辑
 * @param {Object} row 当前行数据
 */
const handleRowSave = async (row) => {
	console.log(row)

	if (!row.node_name) {
		return message.error('节点名称不可以为空')
	}
	// 新增里程碑
	if (isAdd.value) {
		row.type = ''
		emits('ok', nodeArray.value)
		return
	}
	// 编辑里程碑中的新增节点
	const { id, node_name, notice_executors, deadline_time, node_description, status } = row
	const param = {
		milestone: milestoneId,
		node_name,
		notice_executors: notice_executors?.join(','),
		node_description,
		status
	}
	if (deadline_time) {
		param.deadline_time = deadline_time
	}
	let Api = addNodeApi
	if (row.type == 'edit') {
		Api = updateNodeApi
		param.id = id
	}
	await Api(param)
	if (row.type == 'edit') {
		editMiliestoneNode()
	} else {
		creatMiliestoneNode()
	}
	message.success(row.type == 'edit' ? '编辑成功' : '添加成功')
	emits('ok')
}
const handleRowCancle = (scope) => {
	if (scope.row.type === 'add') {
		nodeArray.value.splice(scope.$index, 1)
		return
	}
	const oldValue = nodeList.value?.find((item) => item.id == scope.row.id)
	if (oldValue) {
		scope.row.node_name = oldValue.node_name
		scope.row.notice_executors = oldValue.notice_executors
		scope.row.deadline_time = oldValue.deadline_time
		scope.row.node_description = oldValue.node_description
		scope.row.status = oldValue.status
	}
	scope.row.type = ''
}
/**
 * 处理删除行
 */
const handleRowDelete = async (scope) => {
	if (isAdd.value) {
		nodeArray.value.splice(scope.$index, 1)
		emits('ok', nodeArray.value)
		return
	}
	await confirm('确定删除该节点吗？')
	await delNodeApi({ id: scope.row.id })
	deleteMiliestoneNode({
		params: {
			节点ID: scope.row.id,
			节点名称: scope.row.node_name
		}
	})
	message.success('删除成功')
	emits('ok', nodeArray.value)
}
const resolveUser = (notice_executors) => {
	if (Array.isArray(notice_executors)) {
		return notice_executors
	}
	return notice_executors?.split(',')
}
const handleAddStone = () => {
	nodeArray.value.push(defaultNode())
	if (isAdd.value) {
		emits('ok', nodeArray.value)
	}
}

onMounted(() => {
	optionsStore.getDepartmentUser(5)
})
</script>

<style lang="scss" scoped></style>
