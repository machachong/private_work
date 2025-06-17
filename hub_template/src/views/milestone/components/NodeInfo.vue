<template>
	<div>
		<span class="pointer" @click="handleOpen()">
			{{ defaultInfo?.node_name || item?.node_name }}
		</span>
		<boke-drawer
			v-model="visible"
			:title="defaultInfo?.node_name || item?.node_name"
			size="1000px"
			destroy-on-close
			@close="handleClose"
		>
			<boke-title h2 mode="list">节点信息</boke-title>
			<el-form
				ref="formRef"
				class="boke-form m-t-18"
				label-width="120px"
				label-position="right"
				:model="form"
				v-bind:rules="formRules"
			>
				<div class="boke-form-add">
					<el-form-item label="节点名称" prop="node_name">
						<el-input v-model="form.node_name" placeholder="请输入"></el-input>
					</el-form-item>
					<el-row>
						<el-col :span="11">
							<el-form-item label="预计完成时间" prop="deadline_time">
								<el-date-picker style="width: 400px" v-model="form.deadline_time" type="date" placeholder="请选择" />
							</el-form-item>
						</el-col>
						<el-col :span="2"></el-col>
						<el-col :span="11">
							<el-form-item label="状态" prop="status">
								<boke-select
									v-model="form.status"
									:options="statusDict"
									clearable
									placeholder="请选择状态"
								></boke-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="节点描述" prop="node_description">
						<el-input type="textarea" v-model="form.node_description" :rows="3" placeholder="请输入"></el-input>
					</el-form-item>
				</div>
			</el-form>
			<div class="stone-content">
				<boke-title h2 mode="list">需求列表</boke-title>
				<DemandList :demandList="defaultInfo?.demand_list" :showNode="false" @close="handleClose" />
			</div>
			<template #footer>
				<div style="text-align: right">
					<boke-button @click="handleClose">取消</boke-button>
					<boke-button type="primary" @click="handleSubmit">确定</boke-button>
				</div>
			</template>
		</boke-drawer>
	</div>
</template>

<script setup>
import { statusDict } from '../config/config'
import { useMilestone } from '../service/useMilestone'
import { message } from '@/utils/tools'
import { getNodeListApi } from '@/views/milestone/service'
import DemandList from './DemandList.vue'
const { item, milestoneId, milestone_id, node_id } = defineProps({
	milestoneId: {
		type: [String, Number],
		default: ''
	},
	item: {
		type: Object,
		default: () => {
			return {}
		}
	},
	milestone_id: {
		type: [String, Number],
		default: ''
	},
	node_id: {
		type: [String, Number],
		default: ''
	}
})
const emits = defineEmits(['ok'])
const { updateNode } = useMilestone()

const visible = ref(false)
const formRef = ref()
const form = ref()
const defaultInfo = ref()
const propParams = ref({
	milestone_node_id: '',
	milestone: ''
})
const formRules = ref({
	node_name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }]
})

const handleClose = () => {
	visible.value = false
}
const handleOpen = () => {
	propParams.value.milestone_node_id = item?.id
	propParams.value.milestone = milestoneId
	init()
}
const activlyOpen = () => {
	propParams.value.milestone_node_id = node_id
	propParams.value.milestone = milestone_id
	init()
}
const init = async () => {
	try {
		const res = await getNodeListApi({
			milestone_node_id: propParams.value.milestone_node_id
		})
		if (res?.items?.length > 0) {
			defaultInfo.value = res?.items[0]
			form.value = res?.items[0]
		}
		visible.value = true
	} catch (error) {
		console.log(error)
	}
}
const handleSubmit = async () => {
	await formRef.value.validate()
	await updateNode({
		milestone: propParams.value.milestone,
		id: form.value.id,
		node_name: form.value.node_name,
		deadline_time: form.value.deadline_time,
		status: form.value.status,
		node_description: form.value.node_description
	})
	message.success('修改成功')
	visible.value = false
	emits('ok')
	console.log(form)
}
defineExpose({
	activlyOpen
})
</script>

<style scoped lang="scss">
.stone-content {
	margin-top: 20px;
}
</style>
