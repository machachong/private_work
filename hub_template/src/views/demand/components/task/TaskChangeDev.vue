<template>
	<boke-text-button :disabled="disabled" @click="handleExit"><slot></slot></boke-text-button>
	<BokeDialog
		title="转交"
		v-model:value="branchVisible"
		width="500px"
		@open="handleOpen"
		@close="handleClose"
	>
		<el-space>
			请选择转交人:
			<boke-select
				width="300px"
				v-model="form.refer_user_id"
				:options="noMeDevOptions"
				placeholder="请选择转交人"
			></boke-select>
		</el-space>
		<template #footer>
			<el-row justify="end">
				<el-space>
					<BokeButton @click="handleClose">取消</BokeButton>
					<BokeButton type="primary" @click="handleSubmit">确定</BokeButton>
				</el-space>
			</el-row>
		</template>
	</BokeDialog>
</template>

<script setup>
import { message, confirm } from "@/utils/tools"
import { updateDemandSpecialApi } from "../../service/demand_api"
import { useOptionsStore } from "@/stores"
const optionsStore = useOptionsStore()
const props = defineProps({
	mode: {
		type: String,
		default: null // 1 退出 2 转交
	},
	row: {
		type: Object,
		default: () => {
			return {}
		}
	},
	disabled: {
		type: Boolean,
		default: false
	}
})
const emits = defineEmits(["ok"])
const branchVisible = ref(false)
const form = reactive({
	refer_user_id: ""
})
const noMeDevOptions = computed(() => {
	console.log(optionsStore.devOptions)
	return optionsStore.devOptions?.filter((item) => item.value != props.row?.task_user_id)
})
const updateDemandSpecial = async (params) => {
	const res = await updateDemandSpecialApi(params, true, true)
	console.log(res.data)
	if (res.data.status_code == 400) {
		message.error(res.data.message)
	} else {
		message.success(props.mode == "1" ? "退出成功" : "转交成功")
		branchVisible.value = false
		emits("ok")
	}
}
const handleExit = async () => {
	console.log(props.row)
	if (props.mode == "2") {
		branchVisible.value = true
		return
	}
	try {
		await confirm("确定退出任务吗？")
		updateDemandSpecial({
			id: props.row?.demand_detail?.id,
			task_id: props.row?.id,
			special_type: 2 // 特殊流程 1:快速选择开发人员 2:退出需求 3:转交其他开发者
		})
	} catch (error) {
		console.log(error)
	}
}
const handleOpen = async () => {
	let params = {}
	if (props.row?.task_type == 1) {
		params = {
			front_type: 1
		}
	} else if (props.row?.task_type == 2) {
		params = {
			back_type: 1
		}
	} else if (props.row?.task_type == 4) {
		params = {
			prd_type: 1
		}
	}
	await optionsStore.getDevOptions(params, true)
}
const handleClose = () => {
	form.refer_user_id = null
	branchVisible.value = false
}
const handleSubmit = () => {
	if (!form.refer_user_id) {
		return message.error("请选择转交人")
	}
	updateDemandSpecial({
		id: props.row?.demand_detail?.id,
		task_id: props.row?.id,
		special_type: 3, // 特殊流程 1:快速选择开发人员 2:退出需求 3:转交其他开发者
		refer_user_id: form.refer_user_id
	})
}
</script>

<style scoped lang='scss'>
</style>
