<template>
	<boke-dialog v-model="visible" top="80px" title="新建里程碑计划" width="1100px" destroy-on-close @open="handleOpen">
		<el-form
			ref="formRef"
			class="boke-form"
			label-width="120px"
			label-position="right"
			:model="form"
			v-bind:rules="formRules"
		>
			<div class="boke-form-add">
				<el-form-item label="里程碑名称" prop="milestone_name">
					<el-input v-model="form.milestone_name" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="里程碑描述" prop="milestone_description">
					<el-input type="textarea" v-model="form.milestone_description" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="预计完成时间" prop="deadline_time">
					<el-date-picker
						v-model="form.deadline_time"
						value-format="YYYY-MM-DD"
						type="date"
						placeholder="请选择"
						:disabled-date="disabledAbortToday"
					/>
				</el-form-item>
			</div>
		</el-form>
		<div class="stone-content">
			<div class="f-s-14 color-title p-l-16"><span class="color-fail">*</span>里程碑节点</div>
			<NodeList style="margin-top: -22px" mode="add" v-model="form.nodeList" @ok="handleNodeOk"></NodeList>
		</div>
		<template #footer>
			<div class="boke-form-footer">
				<boke-button @click="handleClose">取消</boke-button>
				<boke-button type="primary" @click="handleAddMilestone">确认</boke-button>
			</div>
		</template>
	</boke-dialog>
</template>

<script setup>
import { message, disabledAbortToday } from '@/utils/tools'
import { useMilestone } from '../service/useMilestone'
import NodeList from './NodeList.vue'
import { creatMiliestone } from '../service/track'
const emits = defineEmits(['ok'])
const visible = defineModel()

const { addMilestone, addNode } = useMilestone()

const formRef = ref()
const form = reactive({
	milestone_name: '',
	milestone_description: '',
	deadline_time: '',
	nodeList: []
})
const formRules = ref({
	milestone_name: [{ required: true, message: '请输入里程碑名称', trigger: 'blur' }]
})

const handleAddMilestone = async () => {
	console.log(form)
	try {
		await formRef.value.validate()
		if (form.nodeList?.length == 0) return message.error('请添加节点信息')
		for (let i in form.nodeList) {
			const { node_name, type } = form.nodeList[i]
			if (!node_name || type == 'add') {
				return message.error('请先保存节点')
			}
		}
		const { milestone_name, milestone_description, deadline_time } = form
		const params = {
			milestone_name,
			milestone_description
		}
		if (deadline_time) {
			params.deadline_time = deadline_time
		}
		const res = await addMilestone(params)
		console.log(res)
		const milestone = res?.milestone_id
		for (let i in form.nodeList) {
			const { node_name, node_description, deadline_time, notice_executors } = form.nodeList[i]
			const nodeParams = {
				milestone,
				node_name,
				node_description,
				notice_executors: notice_executors?.join(',')
			}
			if (deadline_time) {
				nodeParams.deadline_time = deadline_time
			}
			await addNode(nodeParams)
		}
		message.success('创建成功')
		creatMiliestone()
		handleClose()
		emits('ok')
	} catch (error) {
		console.log(error)
	}
}
const handleClose = () => {
	visible.value = false
	form.nodeList = []
	if (formRef.value != '') {
		formRef.value.resetFields()
	}
}
const handleNodeOk = (nodeList) => {
	form.nodeList = nodeList
}
const handleOpen = () => {}
</script>

<style scoped lang="scss">
.stone-content {
	padding: 10px 16px;
}
</style>
