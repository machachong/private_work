<template>
	<boke-text-button @click="handleOpen()" type="primary" v-if="!!row?.id">
		<slot></slot>
	</boke-text-button>
	<boke-button @click="handleOpen()" type="primary" v-else>
		<slot></slot>
	</boke-button>
	<boke-dialog v-model="dialogVisible" :title="!!row?.id ? '编辑接口配置' : '新增接口配置'">
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
import { addSystemApiListApi, editSystemApiListApi } from "@/views/config/service/api_list_api"
import { useOptionsStore } from "@/stores"
// import tracker from "@/utils/tracking"
import { message } from "@/utils/tools"
import { pathTypeDict } from "@/views/config/service/config"
const optionsStore = useOptionsStore()
const { systemOptions } = storeToRefs(optionsStore)
const props = defineProps({
	row: {
		type: Object,
		default: () => {
			return {}
		}
	}
})
const emits = defineEmits(["ok"])
const formRef = ref()
const dialogVisible = ref(false)
const formData = ref({
	path_id:null,
	system: null,
	url_path: null,
	comment_info: null,
	path_name: null,
	path_type: 1,
})
const backRules = ref({
	system: [{ required: true, message: "请选择", trigger: "change" }],
	url_path: [{ required: true, message: "请输入", trigger: "blur" }],
	path_id: [{ required: true, message: "请输入", trigger: "blur" }],
	path_name: [{ required: true, message: "请输入", trigger: "blur" }],
	path_type: [{ required: true, message: "请选择", trigger: "change" }],
})
const frontFormColumns = computed(() => {
	return [
		{
			label: "接口ID",
			prop: "path_id",
			formProp: {
				el: ElInput,
				width: "100%",
				clearable: true,
				placeholder: "请输入接口ID"
			}
		},
		{
			label: "系统平台",
			prop: "system",
			formProp: {
				el: "BokeSelect",
				width: "100%",
				source: systemOptions,
				clearable: true
			}
		},
		{
			label: "接口地址",
			prop: "url_path",
			formProp: {
				el: ElInput,
				width: "100%",
				clearable: true,
				placeholder: "请输入接口地址"
			}
		},
		{
			label: "接口名称",
			prop: "path_name",
			formProp: {
				el: ElInput,
				width: "100%",
				clearable: true,
				placeholder: "请输入接口名称"
			}
		},
		{
			label: "接口类型",
			prop: "path_type",
			formProp: {
				el: "BokeSelect",
				width: "100%",
				source: pathTypeDict,
				clearable: true
			}
		},
		{
			label: "备注",
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
	dialogVisible.value = false
	formRef.value?.form.resetFields()
}
const handleSummit = async () => {
	try {
		await formRef.value?.form.validate()
		const Api = props.row?.id ? editSystemApiListApi : addSystemApiListApi
		console.log(formData.value)
		await Api({ ...formData.value })
		message.success(props.row?.id ? "更新成功" : "添加成功")
		emits("ok")
		handleClose()
	} catch (error) {
		console.log(error)
	}
}
</script>

<style scoped lang="scss"></style>
