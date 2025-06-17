<template>
	<boke-button type="default" :class="{ 'px-40': !isSmall }" @click="handleOpen">进度填写</boke-button>
	<boke-dialog title="进度信息" v-model:value="visible" width="800px" @close="handleClose">
		<!-- <el-input type="textarea" v-model="memo" :autosize="{ minRows: 3, maxRows: 6 }"></el-input> -->
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
</template>

<script setup>
import { ref } from 'vue'
import { addTaskProcessApi } from '@/views/dw_demand/service/demand_api'
import { message } from '@/utils/tools'
import { useDemand } from '@/views/dw_demand/hook/useDemand'
import { contentExcludeKeys } from '@/components/demand/config'
const { getDemandType } = useDemand()
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
	}
})
const emits = defineEmits(['ok'])
const visible = ref()
const memo = ref()
const handleOpen = () => {
	visible.value = true
}
const handleClose = () => {
	visible.value = false
	memo.value = ''
}
const handleSave = async () => {
	const recent_workflow = props.processDataList?.length && props.processDataList[props.processDataList?.length - 1] // 找最近的一个进度
	const workflow_id = recent_workflow?.length && recent_workflow[recent_workflow?.length - 1] // 找最近的一个进度的人（可能存在前端，后端，产品多个）
	const params = {
		process_content: memo.value,
		task: props.task_id,
		workflow_detail: workflow_id?.id
	}
	const res = await addTaskProcessApi(params, getDemandType.value)
	console.log(res)
	message.success('更新进度成功')
	emits('ok')
	handleClose()
}
</script>

<style scoped lang="scss"></style>
