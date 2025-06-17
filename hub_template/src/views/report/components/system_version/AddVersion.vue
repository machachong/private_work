<template>
	<boke-button type="primary" @click="visible = true">
		<el-space>
			<el-icon><Plus /></el-icon><slot></slot>
		</el-space>
	</boke-button>
	<boke-dialog title="新增版本" v-model:value="visible">
		<section class="w-100p">
			<BokeForm
				ref="formRef"
				vertical
				:columns="formColumns"
				:form-data="formModel"
				labelWidth="100px"
				rows="5"
			></BokeForm>
		</section>
		<template #footer>
			<el-space>
				<boke-button @click="visible = false">取消</boke-button>
				<boke-button type="primary">保存</boke-button>
			</el-space>
		</template>
	</boke-dialog>
</template>

<script setup>
import { Plus } from "@element-plus/icons-vue"
const visible = ref(false)
const formRef = ref()
const formModel = reactive({})
const formColumns = computed(() => {
	return [
		{
			label: "版本名称",
			prop: "host_name",
			formProp: {
				width: "100%",
				el: ElInput,
				clearable: true,
				required: true
			}
		},
		{
			label: "备注",
			prop: "date",
			type: "datetimerange",
			formProp: {
				width: "100%",
				el: ElInput,
				type: "textarea"
			}
		}
	]
})
</script>

<style scoped lang="scss"></style>
