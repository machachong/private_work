<template>
	<el-select :model-value="modelValue" @change="changeRobot" placeholder="请选择机器人" clearable style="width: 100%">
		<template #prefix v-if="modelValue">
			<img v-if="activeImage" :src="activeImage" alt="" style="width: 24px; height: 24px" />
		</template>
		<el-option v-for="item in robotList" :key="item.value" :label="item.label" :value="item.value">
			<span class="flex-middle">
				<el-image
					style="width: 24px; height: 24px; vertical-align: bottom; margin-right: 4px"
					:src="item.avatar_url"
				></el-image>
				<span>{{ item.app_name }}</span>
			</span>
		</el-option>
	</el-select>
</template>

<script setup>
import { onMounted, ref, computed } from "vue"
import settings from "@/utils/config/settings"
import request from "@/api/service/request"

const props = defineProps({
	modelValue: {
		type: [String, Number],
		default: ""
	}
})
const emits = defineEmits(["change", "update:modelValue"])
const robotList = ref([])
const activeImage = computed(() => {
	const item = robotList.value?.find((item) => item.value === props.modelValue)
	return item?.avatar_url || ""
})
const changeRobot = (val) => {
	emits("update:modelValue", val)
	emits("change", val)
}

const getRobotList = (params) => {
	return request({
		baseURL: settings.API_AUDIT,
		url: "/event/feishu_robot/list/",
		method: "GET",
		params: params
	})
}
const getRobot = async () => {
	try {
		const res = await getRobotList()
		robotList.value = res?.items?.map((item) => {
			return {
				label: item.app_name,
				value: item.app_id,
				...item
			}
		})
	} catch (error) {
		console.log(error)
	}
}
onMounted(() => {
	getRobot()
})
</script>

<style scoped lang="scss"></style>
