<template>
	<el-tooltip class="box-item" effect="dark" content="发送飞书提醒" placement="top-end">
		<boke-text-button
			type="primary"
      :loading="loading"
			@click="handleReSend"
		>需求提醒</boke-text-button>
	</el-tooltip>
</template>

<script setup>
import { sendNoticeApi } from "@/views/demand/service/demand_api"
import { confirm, message } from "@/utils/tools"
const props = defineProps({
	row: {
		type: Object,
		default: () => {
			return {}
		}
	},
	id: {
		type: [Number, String],
		default: ""
	}
})
const loading = ref(false)
const handleReSend = async () => {
	console.log(props.id)
	try {
		await confirm("确定重新发送飞书卡片提醒吗？")
		loading.value = true
		await sendNoticeApi({
			demand_id: props.id
		})
		loading.value = false
		message.success("发送成功")
	} catch (error) {
		loading.value = false
		console.log(error)
	}
}
</script>

<style scoped lang="scss"></style>
