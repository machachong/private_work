<template>
	<div>
		<template v-if="taskRow?.task_process == 5 && demandRow?.demand_process == 5 && taskRow?.task_status != 2">
			<boke-button type="primary" v-if="isMobile" @click="handleOpen">完成开发</boke-button>
			<boke-text-button v-else @click="handleOpen">完成开发</boke-text-button>
		</template>
		<DemandCheck
			ref="checkRef"
			isMobile
			:demandRow="demandRow"
			@reSearch="entryOk"
			v-else-if="
				isMobile &&
				demandRow.assignee_feishu_user_id == userStore.userInfo?.union_id &&
				[8, 9]?.includes(demandRow?.demand_process) &&
				demandRow.demand_status == 1
			"
		></DemandCheck>
		<!-- <template v-else-if="demandRow?.demand_process == 9">等待需求人验收</template> -->
		<span v-else-if="demandRow?.demand_process == 10" class="color-describe">需求结束</span>
		<span v-else-if="demandRow?.demand_process == 20" class="color-describe">需求关闭</span>
		<el-row justify="center" align="middle" v-else>
			<span>{{ currentTodo || '等待他人更新' }}</span>
		</el-row>
		<boke-dialog
			v-model="visible"
			title="任务完成"
			width="800px"
			top="10px"
			destroy-on-close
			align-center
			@open="handleOpen"
			@close="handleClose"
		>
			<EntryForm
				ref="entryFormRef"
				readonly
				mode="finish"
				:taskRow="taskRow"
				:demandRow="demandRow"
				@ok="entryOk"
			></EntryForm>
		</boke-dialog>
	</div>
</template>

<script setup>
import { useUserStore } from '@/stores'
import EntryForm from '../entry_demand/EntryForm.vue'
import DemandCheck from '@/views/da_demand/components/demand_list/DemandCheck.vue'

const props = defineProps({
	demandRow: {
		type: Object,
		default: () => {
			return {}
		}
	},
	taskRow: {
		type: Object,
		default: () => {
			return {}
		}
	},
	isMobile: {
		type: Boolean,
		default: false
	},
	currentTodo: {
		type: String,
		default: ''
	}
})
const emits = defineEmits(['ok'])

const userStore = useUserStore()
const taskOrderRef = ref()
const checkRef = ref()
const entryFormRef = ref()
const visible = ref(false)
const handleOpen = () => {
	if (props.taskRow?.task_process == 5 && props.demandRow?.demand_process == 5 && props.taskRow?.task_status != 2) {
		visible.value = true
		entryFormRef.value?.init()
	}
}
const handleClose = () => {
	visible.value = false
}
const entryOk = () => {
	emits('ok')
	handleClose()
}
const handleOpenReject = () => {
	if (props.demandRow?.demand_process == 9 || props.demandRow?.demand_process == 8) {
		checkRef.value?.handleOpen()
	}
}
onMounted(() => {
	// 通过浏览器钩子监听页面加载
	document.addEventListener('visibilitychange', function () {
		if (document.visibilityState === 'visible') {
			if (props.taskRow?.id) {
				taskOrderRef.value?.getOperationWorkflowList()
			}
		}
	})
})
onUnmounted(() => {
	if (document.visibilitychange) {
		document.removeEventListener('visibilitychange')
	}
})
defineExpose({
	handleOpen,
	handleOpenReject
})
</script>

<style scoped lang="scss"></style>
