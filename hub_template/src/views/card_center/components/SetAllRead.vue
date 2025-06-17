<template>
	<div>
		<boke-button @click="handleOpen">
			<el-space>
				<i class="iconfont icon-quanbubiaoweiyidu"></i>
				<span>全部已读</span>
			</el-space>
		</boke-button>
		<boke-dialog v-model="visible" title="全部已读" width="400px" top="150px" destroy-on-close @close="handleClose">
			<el-checkbox-group v-model="form.robot_open_id">
				<ul>
					<li v-for="item in roubotList" :key="item.app_name">
						<el-checkbox :label="item.app_name" :value="item.open_id">
							<template #default>
								<el-space>
									<el-image style="width: 30px; height: 30px" :src="item.avatar_url"></el-image>
									<span>{{ item.app_name }}</span>
								</el-space>
							</template>
						</el-checkbox>
					</li>
				</ul>
			</el-checkbox-group>
			<template #footer>
				<div>
					<el-space>
						<boke-button @click="handleClose">取消</boke-button>
						<boke-button type="primary" @click="setAllRead">确认</boke-button>
					</el-space>
				</div>
			</template>
		</boke-dialog>
	</div>
</template>

<script setup>
import { message, confirm, showLoading, hideLoading } from '@/utils/tools'
import tracker from '@/utils/tracking'
import { setAllReadApi, setAllReadEmailApi } from '@/views/card_center/service/card_api.js'
const props = defineProps({
	roubotList: {
		type: Array,
		default: () => []
	},
	userInfo: {
		type: Object,
		default: () => {
			return {}
		}
	},
	msgType: {
		type: [String, Number],
		default: ''
	},
	updateOverview: {
		type: Function,
		default: () => {}
	}
})
const emits = defineEmits('ok')
const visible = ref(false)
const form = reactive({
	robot_open_id: []
})
const handleOpen = () => {
	if (props.msgType == 2) {
		setAllRead()
	} else {
		visible.value = true
		form.robot_open_id = props.roubotList?.map((item) => item.open_id)
	}
}
const handleClose = () => {
	visible.value = false
}
const setAllRead = async () => {
	try {
		if (props.msgType == 2) {
			await confirm('确定全部设为已读吗？')
		} else {
			if (form.robot_open_id?.length == 0) {
				return message.error('请选择要设为已读的机器人')
			}
		}
		showLoading()
		let Api = setAllReadApi
		let params = {
			feishu_user_id: props.userInfo?.union_id,
			robot_open_ids: form.robot_open_id?.join(',')
		}
		if (props.msgType == 2) {
			Api = setAllReadEmailApi
			params = {
				feishu_user_id: props.userInfo?.union_id
			}
		}
		await Api(params)
		tracker.push(
			{
				name: 'feishuCardSetAllRead',
				description: '设置全部已读',
				behavior: 'click',
				permission_id: 150104
			},
			false,
			true
		)
		props.updateOverview()
		handleClose()
		emits('ok')
		hideLoading()
		message.success('设置成功')
	} catch (error) {
		hideLoading()
		console.log(error)
	}
}
</script>

<style scoped lang="scss"></style>
