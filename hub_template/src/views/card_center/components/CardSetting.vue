<template>
	<el-space class="pointer" @click="handleOpen"
		><el-icon><Setting /></el-icon>通知设置</el-space
	>
	<boke-dialog v-model="visible" destroy-on-close title="通知设置">
		<boke-title mode="list" h2>
			<el-space :size="16">
				<el-space>
					免打扰
					<el-tooltip class="box-item" effect="dark" content="设置免打扰的机器人不会被统计到未读通知中" placement="top">
						<el-icon><Warning /></el-icon>
					</el-tooltip>
				</el-space>
				<!-- <el-switch
					v-model="form.obj_type"
					class="ml-2"
					style="width: 100px" 
					inline-prompt
					active-text="开"
					inactive-text="关"
				/> -->
			</el-space>
			<div class="not-disturb">
				<el-checkbox-group v-model="form.robot_open_ids">
					<el-checkbox v-for="item in roubotList" :key="item.open_id" :value="item.open_id">
						<el-space>
							<el-image style="width: 30px; height: 30px" :src="item.avatar_url"></el-image>
							<span>{{ item.app_name }}</span>
						</el-space>
					</el-checkbox>
				</el-checkbox-group>
			</div>
		</boke-title>
		<template #footer>
			<div>
				<el-space>
					<boke-button @click="visible = false">取消</boke-button>
					<boke-button class="" type="primary" @click="handleSubmit">确定</boke-button>
				</el-space>
			</div>
		</template>
	</boke-dialog>
</template>

<script setup>
import { Setting, Warning } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { getNotDisturbApi, setNotDisturbApi } from '@/views/card_center/service/card_api'
import { message } from '@/utils/tools'

const props = defineProps({
	roubotList: {
		type: Array,
		default: () => []
	},
	activeStatus: {
		type: Object,
		default: () => {
			return {}
		}
	},
	feishu_user_id: {
		type: String,
		default: ''
	}
})
const emits = defineEmits(['ok'])
const form = ref({
	obj_type: false,
	robot_open_ids: [],
	seted: []
})
const visible = ref(false)
const handleReset = () => {
	form.value.robot_open_ids = []
}
const handleSubmit = async () => {
	try {
		const res = await setNotDisturbApi({
			feishu_user_id: props.feishu_user_id,
			robot_open_ids: form.value?.robot_open_ids?.join(',')
		})
		console.log(res)
		message.success('操作成功')
		visible.value = false
		emits('ok')
		handleReset()
	} catch (error) {
		console.log(error)
	}
}
const getRobotStatus = async () => {
	try {
		const { items } = await getNotDisturbApi({
			feishu_user_id: props.feishu_user_id
		})
		form.value.robot_open_ids = items
	} catch (error) {
		console.log(error)
	}
}
const handleOpen = () => {
	visible.value = true
	getRobotStatus()
}
watch(
	() => props.activeStatus,
	() => {
		form.value = {
			robot_open_id: [],
			value: 1
		}
	},
	{
		deep: true
	}
)
defineExpose({
	handleReset,
	handleSubmit
})
</script>

<style scoped lang="scss">
.card-setting {
	line-height: 30px;
	padding: 14px 0 0 22px;
	i {
		font-size: 28px;
	}
}
.not-disturb {
	padding: 20px 40px;
}
</style>
