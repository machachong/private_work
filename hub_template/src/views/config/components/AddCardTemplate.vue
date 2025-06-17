<template>
	<boke-text-button @click="handleOpen()" type="primary" v-if="!!row?.template_id">
		<slot></slot>
	</boke-text-button>
	<boke-button @click="handleOpen()" type="primary" v-else>
		<slot></slot>
	</boke-button>
	<boke-dialog v-model="dialogVisible" :title="!!row?.template_id ? '编辑卡片模板' : '新增卡片模板'" destroy-on-close="">
		<BokeForm
			ref="formRef"
			formAlign="left"
			label-width="140px"
			labelPosition="right"
			label-suffix=":"
			vertical
			:form-data="formData"
			:rules="backRules"
			mode="add"
			:columns="frontFormColumns"
		>
    <template #form_Code_info>
      <BokeEditor id="json-content1" v-model="formData.code_info" mode="json" height="400px" resizable />
    </template>
    <template #robot_form>
      <BokeRobotSelect v-model="formData.robot"></BokeRobotSelect>
    </template>
		</BokeForm>
		<template #footer>
			<el-row justify="end">
				<el-space>
					<boke-button @click="handleClose()">取消</boke-button>
					<boke-button type="primary" @click="handleSummit()">确定</boke-button>
				</el-space>
			</el-row>
		</template>
	</boke-dialog>
</template>

<script setup>
import { ref } from "vue"
import { addCardTemplateApi, updateCardTemplateApi } from "@/views/config/service/card_template_api"
// import tracker from "@/utils/tracking"
import { message } from "@/utils/tools"
const props = defineProps({
	row: {
		type: Object,
		default: () => {
			return {}
		}
	},
	robot: {
		type: Array,
		default:() => []
	}
})
const emits = defineEmits(["ok"])
const formRef = ref()
const dialogVisible = ref(false)
const formData = ref({
	card_name:null,
	code_info: null,
	robot: null,
	comment_info: null,
})
const backRules = ref({
	template_id: [{ required: true, message: "请输入", trigger: "blur" }],
	card_name: [{ required: true, message: "请输入", trigger: "blur" }],
	code_info: [{ required: true, message: "请输入", trigger: "blur" }],
	robot: [{ required: true, message: "请选择", trigger: "change" }],
})
const frontFormColumns = computed(() => {
	return [
		{
			label: "卡片模板ID",
			prop: "template_id",
			formProp: {
				el: ElInput,
				width: "100%",
				clearable: true,
				placeholder: "请输入卡片ID"
			}
		},
		{
			label: "卡片名称",
			prop: "card_name",
			formProp: {
				el: ElInput,
				width: "100%",
				clearable: true,
				placeholder: "请输入卡片名称"
			}
		},
		{
			label: "发送机器人",
			prop: "robot",
			formProp: {
				el: "BokeSelect",
				slot:"robot_form",
				width: "100%",
				// "item-value": "app_id",
				// "item-label": "app_name",
				// source: props.robot,
				clearable: true
			}
		},
		{
			label: "模板代码",
			prop: "code_info",
			formProp: {
				el: ElInput,
				width: "100%",
				slot: "form_Code_info",
				clearable: true,
			}
		},
		{
			label: "卡片说明",
			prop: "comment_info",
			formProp: {
				el: ElInput,
				width: "100%",
				clearable: true
			}
		}
	]
})
const handleOpen = () => {
	dialogVisible.value = true
	formData.value = JSON.parse(JSON.stringify(props.row))
}
const handleClose = () => {
	// formRef.value?.form.resetFields()
	dialogVisible.value = false
}
const handleSummit = async () => {
	try {
		await formRef.value?.form.validate()
		const Api = props.row?.template_id ? updateCardTemplateApi : addCardTemplateApi
		await Api({ ...formData.value })
		message.success(props.row?.template_id ? "更新成功" : "添加成功")
		emits("ok")
		handleClose()
	} catch (error) {
		console.log(error)
	}
}
</script>

<style scoped lang="scss"></style>
