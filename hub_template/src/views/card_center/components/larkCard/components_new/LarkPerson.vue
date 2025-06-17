<template>
	<div>
		<template v-for="item in newValue" :key="item.user_name">
			<el-space :size="2">
				<img :src="item.header_img_url" style="width: 18px; height: auto; border-radius: 50%" alt="" />
				{{ item.user_name }}
			</el-space>
		</template>
		<!-- <BokeUserProfile :userName="userInfo.user_name" :userId="userInfo.feishu_user_id"></BokeUserProfile> -->
	</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getFeishuUserApi } from '@/api/publicApi'
import { message } from '@/utils/tools'
const props = defineProps({
	feishu_user_id: {
		type: [String, Array],
		default: ''
	}
})
const listRow = inject('listRow')
const newValue = ref([])
const init = async () => {
	const ids = Array.isArray(props.feishu_user_id) ? props.feishu_user_id : [props.feishu_user_id]
	newValue.value = []
	if (ids?.length > 0 && listRow?.robot_open_id) {
		for (let i in ids) {
			// 如果没有user_open_id直接退出
			if (!ids[i]) {
				return
			}
			try {
				const res = await getFeishuUserApi({
					user_open_id: ids[i],
					robot_open_id: listRow?.robot_open_id
				})
				console.log(res)

				if (res.items) {
					const { items = {} } = res
					newValue.value.push(items)
				}
			} catch (error) {
				console.log(error)
				message.error('获取用户信息失败')
			}
		}
	}
}
onMounted(() => {
	init()
})
</script>

<style scoped lang="scss"></style>
