<template>
	<div>
		<boke-text-button class="f-s-18" @click="handleOpen">{{ title }}</boke-text-button>
		<boke-drawer v-model="visible" :title="title" size="1200px" destroy-on-close @close="handleClose">
			<boke-title h2 mode="list">里程碑信息</boke-title>
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
						<el-input v-model="form.milestone_name" placeholder="请输入" clearable></el-input>
					</el-form-item>
					<el-row>
						<el-col :span="11">
							<el-form-item label="预计完成时间" prop="dateline">
								<el-date-picker
									style="width: 400px"
									v-model="form.deadline_time"
									value-format="YYYY-MM-DD"
									type="date"
									clearable
									placeholder="请选择"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="2"></el-col>
						<el-col :span="11">
							<el-form-item label="状态" prop="status">
								<boke-select v-model="form.status" :options="statusDict" clearable placeholder="请选择"></boke-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="里程碑描述" prop="description">
						<el-input type="textarea" v-model="form.milestone_description" :rows="3" placeholder="请输入"></el-input>
					</el-form-item>
				</div>
			</el-form>
			<div class="stone-content">
				<div class="py-14">
					<boke-tabs
						v-model:active="tabs.active"
						:tabs="tabs.dict"
						size="small"
						@tabClick="handleChangeTabs"
						noUrlChange
					></boke-tabs>
				</div>
				<NodeList
					v-if="tabs.active === '1'"
					mode="edit"
					:milestoneId="row.id"
					v-model="form.node_info"
					@ok="handleRefresh"
					@handleLookDemand="handleLookDemand"
				/>

				<DemandList
					isMilestone
					v-if="tabs.active === '2'"
					:nodeId="tabs.nodeId"
					:nodeDict="nodeDict"
					:demandList="demandList"
					@close="handleClose"
				/>
			</div>
			<template #footer>
				<div style="text-align: right">
					<boke-button @click="handleClose">取消</boke-button>
					<boke-button type="primary" @click="handleSubmit" v-permission="120603">确定</boke-button>
				</div>
			</template>
		</boke-drawer>
	</div>
</template>

<script setup>
import { cloneDeep } from 'lodash'
import { ref } from 'vue'
import { statusDict } from '../config/config'
import { useMilestone } from '../service/useMilestone'
import { getMilestoneListApi } from '../service'
import { message } from '@/utils/tools'
import { editMiliestone } from '../service/track'
import NodeList from './NodeList.vue'
import DemandList from './DemandList.vue'

const { title, row } = defineProps({
	title: {
		type: String,
		default: '2025AI应用计划'
	},
	row: {
		type: Object,
		default: () => {
			return {}
		}
	}
})
const emits = defineEmits(['ok'])
const { updateMilestone } = useMilestone()

const formRef = ref()
const visible = ref()
const form = ref({})
const tabs = reactive({
	active: '1',
	nodeId: '',
	dict: [
		{
			label: '节点列表',
			name: '1'
		},
		{
			label: '需求列表',
			name: '2'
		}
	]
})

const formRules = ref({
	milestone_name: [{ required: true, message: '请输入里程碑名称', trigger: 'blur' }]
})
const nodeDict = computed(() => {
	return form.value?.node_info?.map((item) => {
		return {
			label: item.node_name,
			value: item.id
		}
	})
})
const demandList = computed(() => {
	return form.value?.node_info
		?.map((node) => {
			return node.demand_list?.map((item) => {
				return {
					...item,
					node_name: node.node_name,
					node_id: node.id
				}
			})
		})
		.flat(2)
})
const handleChangeTabs = () => {
	tabs.nodeId = ''
}
const handleLookDemand = (nodeId) => {
	tabs.nodeId = nodeId
	tabs.active = '2'
}
const getMilestoneInfo = async () => {
	try {
		const res = await getMilestoneListApi({
			id: row?.id
		})
		if (res?.items?.length == 0) {
			return message.error('获取里程碑信息失败')
		}
		form.value = cloneDeep(res?.items[0])
		form.value.node_info?.forEach((item) => {
			if (!Array.isArray(item.notice_executors)) {
				item.notice_executors = item.notice_executors ? item.notice_executors.split(',') : []
			}
		})
		formRef.value.clearValidate()
	} catch (error) {
		console.log(error)
	}
}
const handleSubmit = async () => {
	try {
		await formRef.value.validate()
		const { milestone_name, milestone_description, deadline_time, status } = form.value
		await updateMilestone({ id: row.id, milestone_name, milestone_description, deadline_time, status })
		emits('ok')
		message.success('修改成功')
		editMiliestone()
		visible.value = false
	} catch (error) {
		console.log(error)
	}
}
const handleRefresh = () => {
	getMilestoneInfo()
	emits('ok')
}
const handleClose = () => {
	visible.value = false
}
const handleOpen = () => {
	visible.value = true
	console.log(row)
	tabs.active = '1'
	getMilestoneInfo()
	// form.value = cloneDeep(row)
}
</script>

<style scoped lang="scss"></style>
