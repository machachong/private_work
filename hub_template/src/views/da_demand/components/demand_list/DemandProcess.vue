<template>
	<span @click="dialogVisible = true">
		<el-tag effect="light" class="cursor" :size="size" :type="getLabel(demandProcessDict, process, 'type') || 'info'">
			{{ getLabel(demandProcessDict, process) }}
		</el-tag>
	</span>
	<BokeDialog
		title="需求进度"
		v-model:value="dialogVisible"
		width="500px"
		top="100px"
		@open="handleOpen"
		@close="handleClose"
	>
		<el-timeline class="timeline">
			<el-timeline-item
				v-for="activity in newDemandProcessDict"
				:key="activity.value"
				size="large"
				:icon="getIcon(activity.value)"
				:type="getType(activity.value)"
				:hollow="activity.value > process"
			>
				{{ getLabel(newDemandProcessDict, activity.value) }}
			</el-timeline-item>
			<!-- <el-timeline-item
				:key="10"
				size="large"
				:icon="CircleCheck"
				:type="process == 10 ? 'success' : 'info'"
				:hollow="10 > process"
			>
				{{ getLabel(demandProcessDict, process) }}
			</el-timeline-item> -->
		</el-timeline>
	</BokeDialog>
</template>
<script setup>
import { CircleCheck, Compass } from '@element-plus/icons-vue'
import { demandProcessDict } from '../../service/config'
import { getLabel } from '@/utils/tools'
const emits = defineEmits(['ok'])
const props = defineProps({
	process: {
		type: [String, Number],
		default: null
	},
	prd_status: {
		type: Boolean,
		default: true
	},
	task_status: {
		type: [String, Number],
		default: null
	},
	showStatus: {
		type: Boolean,
		default: true
	},
	size: {
		type: String,
		default: 'default'
	},
	row: {
		type: Object,
		default: undefined
	}
})
const dialogVisible = ref(false)
const newDemandProcessDict = computed(() => {
	const newDict = demandProcessDict.filter((item) => item.value <= 10)
	console.log(props.row?.task_data)
	if (props.row?.task_data?.length > 0 && props.row.task_data[0]?.task_type == 6) {
		return newDict
	}

	return newDict?.filter((item) => item.value != 8)
})
const getIcon = (activity) => {
	if (activity == props.process) {
		return Compass
	}
	return activity > props.process ? null : CircleCheck
}
const getType = (activity) => {
	if (activity == props.process) {
		return 'primary'
	}
	return activity > props.process ? 'info' : 'success'
}

const handleOpen = async () => {}
const handleClose = async () => {
	emits('ok')
}
</script>

<style scoped lang="scss">
.timeline {
	width: 170px;
	margin: 0 auto;
}
</style>
