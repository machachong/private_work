<template>
	<div style="text-align: center">
		<boke-button type="default" :class="{ 'px-40': !isSmall }" @click="handleOpen">进度填写</boke-button>
		<boke-dialog
			title="进度信息"
			v-model="visible"
			width="800px"
			@close="handleClose"
			@open="handleOpen"
			destroy-on-close
		>
			<BokeWangEditor
				v-model="memo"
				height="300px"
				pasteIgnoreImg
				mode="simple"
				class="editor-chart"
				placeholder="请输入内容"
				:excludeKeys="contentExcludeKeys"
			></BokeWangEditor>
			<template #footer>
				<boke-button @click="handleClose">取消</boke-button>
				<boke-button type="primary" @click="handleSave">保存</boke-button>
			</template>
		</boke-dialog>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { addTaskProcessApi, updateTaskProcessApi } from '@/components/demand/service/demand_api'
import { message } from '@/utils/tools'
import { contentExcludeKeys } from '@/components/demand/config'
const props = defineProps({
	task_id: {
		type: [String, Number],
		default: ''
	},
	processDataList: {
		type: Array,
		default: () => []
	},
	isSmall: {
		type: Boolean,
		default: false
	},
	row: {
		type: Object,
		default: () => {
			return {}
		}
	},
	type: {
		type: String,
		default: ''
	}
})
const emits = defineEmits(['ok', 'close'])
const visible = ref()
const memo = ref()
const handleOpen = () => {
	visible.value = true
	if (props.row?.id) {
		memo.value = props.row?.process_content
	}
}
const handleClose = () => {
	visible.value = false
	memo.value = ''
	emits('close')
}
const handleSave = async () => {
	const recent_workflow = props.processDataList?.length && props.processDataList[props.processDataList?.length - 1] // 找最近的一个进度
	// const workflow_id = recent_workflow?.length && recent_workflow[recent_workflow?.length - 1] // 找最近的一个进度的人（可能存在前端，后端，产品多个）

	console.log(recent_workflow)
	const params = {
		process_content: memo.value,
		task: props.task_id,
		workflow_detail: recent_workflow?.id
	}
	let Api = addTaskProcessApi
	if (props.row.id) {
		params.id = props.row.id
		delete params.task
		delete params.workflow_detail
		Api = updateTaskProcessApi
	}
	const res = await Api(params, props.type)
	console.log(res)
	message.success('更新进度成功')
	emits('ok')
	handleClose()
}
defineExpose({
	handleOpen
})
</script>

<style scoped lang="scss"></style>
