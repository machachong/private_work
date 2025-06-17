<template>
	<boke-text-button
		v-track-permission="{
			name: 'feishuRobotEidt',
			description: '编辑飞书机器人',
			permission_id: 12010204,
			behavior: 'edit'
		}"
		v-if="isEdit"
		@click="dialogVisible = true"
		><slot></slot
	></boke-text-button>
	<boke-button
		v-track-permission="{
			name: 'feishuRobotAdd',
			description: '新增飞书机器人',
			permission_id: 12010202,
			behavior: 'add'
		}"
		v-else
		type="primary"
		@click="dialogVisible = true"
		><slot></slot
	></boke-button>
	<BokeDialog
		:title="isEdit ? '编辑飞书机器人' : '新增飞书机器人'"
		v-model:value="dialogVisible"
		width="1000px"
		@close="handleReset"
		@open="handleOpen"
	>
		<BokeForm
			ref="formRef"
			formAlign="left"
			label-width="150px"
			class="boke-form-add"
			labelPosition="right"
			label-suffix=":"
			vertical
			:form-data="formData"
			:rules="rules"
			mode="add"
			:dispable="isEdit"
			:columns="formColumns"
		>
		</BokeForm>
		<section v-if="showSave">
			<!-- <boke-list label-width="134px" label="机器人类型">{{ robotInfo?.robot_type }}</boke-list> -->
			<boke-list label-width="134px" disabled label="机器人名称">{{
				robotInfo?.app_name
			}}</boke-list>
			<boke-list label-width="134px" disabled label="OPEN_ID">{{ robotInfo?.open_id }}</boke-list>
			<boke-list label-width="134px" disabled label="图标">
				<el-image
					:src="robotInfo?.avatar_url"
					:preview-src-list="[robotInfo?.avatar_url]"
					alt=""
					style="width: 64px; height: 64px"
				></el-image>
			</boke-list>
			<boke-list label-width="134px" disabled label="提示符">{{ robotInfo?.robot_flag }}</boke-list>
		</section>
		<template #footer>
			<el-row justify="end">
				<el-space>
					<boke-button @click="handleReset">取消</boke-button>
					<BokeButton
						v-if="!showSave"
						:loading="SaveLoading"
						type="primary"
						@click="getRoubotSync(formRef)"
						>同步获取机器人其他信息</BokeButton
					>
					<BokeButton v-else :loading="SaveLoading" type="primary" @click="handleSubmit(formRef)"
						>保存</BokeButton
					>
				</el-space>
			</el-row>
		</template>
	</BokeDialog>
</template>

<script setup>
import { addRobotApi, updateRobotApi, getRoubotSyncApi } from "../service/feishu_api"
import { message } from "@/utils/tools"
const props = defineProps({
	row: {
		type: Object,
		default: () => {}
	}
})
const emits = defineEmits(["ok"])
const showSave = ref(false)
const SaveLoading = ref(false)
const robotInfo = ref()
const dialogVisible = ref(false)
const formData = reactive({
	app_id: "",
	app_secret: "",
	comment_info: ""
})
const rules = ref({
	app_id: [{ required: true, message: "请输入", trigger: "blur" }],
	app_secret: [{ required: true, message: "请输入", trigger: "blur" }],
	comment_info: [{ required: true, message: "请输入", trigger: "blur" }]
})
const formRef = ref(null)
const formColumns = computed(() => [
	{
		label: "APP_ID",
		prop: "app_id",
		formProp: {
			el: ElInput,
			width: "100%",
			clearable: true,
			placeholder: "请输入",
			disabled: isEdit.value
		}
	},

	{
		label: "APP_SECRET",
		prop: "app_secret",
		formProp: {
			el: ElInput,
			width: "100%",
			clearable: true,
			placeholder: "请输入",
			disabled: isEdit.value
		}
	},
	{
		label: "用途说明",
		prop: "comment_info",
		formProp: {
			el: ElInput,
			type: "textarea",
			autosize: { minRows: 4 },
			width: "100%",
			clearable: true,
			placeholder: "请输入用途说明"
		}
	}
])
const isEdit = computed(() => {
	return props.row?.app_id || props.row?.app_id === 0 ? true : false
})
// 同步机器人其他信息
const getRoubotSync = async () => {
	try {
		const val = await formRef.value?.form.validate()
		if (!val) return false
		SaveLoading.value = true
		const { items = {} } = await getRoubotSyncApi(formData)
		showSave.value = true
		robotInfo.value = items
		SaveLoading.value = false
	} catch (error) {
		console.log(error)
		SaveLoading.value = false
	}
}
// 保存信息
const handleSubmit = async () => {
	console.log(formRef.value)
	const Api = isEdit.value ? updateRobotApi : addRobotApi
	try {
		const val = await formRef.value?.form.validate()
		if (!val) return false
		SaveLoading.value = true

		console.log(formData)
		const { app_id, app_secret, comment_info } = formData
		await Api({
			...robotInfo.value,
			app_id,
			app_secret,
			comment_info
		})
		SaveLoading.value = false
		message.success(isEdit.value ? "更新成功" : "新增成功")
		handleReset()
		emits("ok")
	} catch (error) {
		console.log(error)
		SaveLoading.value = false
	}
}
const handleReset = async () => {
	showSave.value = false
	formData.app_id = null
	formData.app_secret = null
	formData.comment_info = null
	robotInfo.value = {}
	formRef.value?.form.resetFields()
	dialogVisible.value = false
}
const handleOpen = () => {
	if (isEdit.value) {
		showSave.value = true
		const { app_id, app_secret, comment_info } = props.row
		formData.app_id = app_id
		formData.app_secret = app_secret
		formData.comment_info = comment_info
		robotInfo.value = props.row
	}
}
</script>

<style scoped lang="scss">
.detail-info {
	border-right: 1px solid var(--boke-color-border-divider);
	padding-right: 16px;
	max-height: calc(100vh - 220px);
	overflow-y: auto;
	:deep(.el-form-item__label) {
		float: none; // 取消label左浮动
		word-break: break-word; // 支持单词截断换行
	}
}
.detail-plan {
	padding-left: 16px;
	max-height: calc(100vh - 220px);
	overflow-y: auto;
	.plan-list {
		.el-timeline-item {
			min-height: 70px;
		}
		.warn {
			color: var(--boke-color-warning);
		}
		.fail {
			color: var(--boke-color-fail);
		}
		.success {
			color: var(--boke-color-success);
		}
	}
}
</style>
