<template>
	<boke-button type="primary" @click="handleOpen">保存条件</boke-button>
	<boke-dialog align-center v-model="visible" width="500px" :appendToBody="false">
		<template #title>
			<div class="f-s-14">
				<el-space>
					保存条件
					<el-tooltip
						class="box-item"
						effect="dark"
						content="保存条件后，若切换其他电脑或浏览器登录，需要重新设置保存条件"
						placement="top"
					>
						<el-icon><Warning /></el-icon>
					</el-tooltip>
				</el-space>
			</div>
		</template>
		<el-form class="boke-form boke-form-add">
			<el-form-item label="条件名称" style="width: 100%">
				<el-input
					v-model="form.name"
					placeholder="条件名称最多10个字"
					:max="10"
					:maxlength="10"
					clearable
				></el-input>
			</el-form-item>
			<el-form-item label="设置为默认条件" class="no-bg">
				<template #label>
					<el-space :size="2">
						设置为默认条件
						<el-tooltip
							class="box-item"
							effect="dark"
							content="设置为默认条件后，下次进入该页面默认按照设置的条件查询"
							placement="top"
						>
							<el-icon><Warning /></el-icon>
						</el-tooltip>
					</el-space>
				</template>
				<el-switch v-model="form.isDefault" />
			</el-form-item>
		</el-form>
		<template #footer>
			<el-row justify="end" class="filter-footer m-t-12">
				<el-space>
					<boke-button @click="handleCancle">取消</boke-button>
					<boke-button type="primary" @click="handleSaveCache">确定</boke-button>
				</el-space>
			</el-row>
		</template>
	</boke-dialog>
</template>

<script setup>
import { Warning } from "@element-plus/icons-vue"
import { message, getUuid } from "@/utils/tools"
const props = defineProps({
	name: {
		type: String,
		default: ""
	},
	check: {
		type: Function,
		default: () => {
			return false
		}
	},
	asycTabs: {
		type: Array,
		default: () => []
	}
})
const emits = defineEmits(["update:name", "ok"])
const visible = ref(false)
const conditionName = ref("")
const form = ref({
	name: "",
	disDefault: false
})
const handleOpen = () => {
	if (props.check(true)) {
		visible.value = true
		form.value.name = `自定义条件${props.asycTabs?.length}`
	}
}
const handleCancle = () => {
	visible.value = false
}
const reset = () => {
	form.value.name = ""
}
const handleSaveCache = () => {
	const names = props.asycTabs.map((item) => item.label)
	if (names.includes(form.value.name)) {
		return message.warning(`“${form.value.name}”已存在，请修改名称`)
	}
	emits("ok", {
		...form.value,
		index: getUuid()
	})
	visible.value = false
	reset()
}
watch(
	() => props.name,
	(value) => {
		conditionName.value = value
	}
)
defineExpose({
	visible: visible.value
})
</script>

<style scoped lang="scss"></style>
