<template>
	<div v-loading="loading" class="user-profile__container">
		<div class="div-inline" style="gap: 8px; align-items: center">
			<el-avatar
				:size="32"
				:src="userInfo.header_img_url || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
			/>
			<div class="username">
				{{ userInfo.real_name }}
			</div>
			<div v-if="!userInfo.is_active && !base_id">
				<el-tag type="info" size="small">已离职</el-tag>
			</div>
		</div>
		<div style="margin-top: 8px"></div>
		<section v-if="base_id && Object.keys(userInfo)?.length == 0">
			<h5>该用户不是我们系统的内部用户</h5>
		</section>
		<el-form label-position="left" label-width="88px" v-else>
			<el-row style="width: 100%">
				<el-form-item label="部门">
					{{ userInfo.department_full_path }}
				</el-form-item>
			</el-row>
			<el-row style="width: 100%">
				<el-form-item label="职务">
					{{ userInfo.job_title || '' }}
				</el-form-item>
			</el-row>
			<el-row style="width: 100%" v-if="!userInfo.is_active && !base_id">
				<el-form-item label="离职日期">
					{{ userInfo?.resignation_date || '' }}
				</el-form-item>
			</el-row>
			<!-- <el-row style="width: 100%">
        <el-form-item label="入职时间">
          {{ userInfo.join_time || '' }}
        </el-form-item>
      </el-row> -->
		</el-form>
		<div v-if="userInfo.is_active">
			<a
				class="my-a chat-button"
				:href="`https://applink.feishu.cn/client/chat/open?openId=${userInfo.feishu_open_id}`"
				target="_blank"
				><el-icon :size="16" style="vertical-align: middle"><ChatLineRound /></el-icon>消息</a
			>
		</div>
	</div>
</template>

<script setup>
import { ChatLineRound } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import request from '@/api/service/request'
import settings from '@/utils/config/settings'

const props = defineProps({
	userId: Number,
	feishuUserId: String,
	base_id: {
		type: String,
		default: ''
	}
})

const loading = ref(false)
const userInfo = ref({})
onMounted(() => {
	loading.value = true
	if (props.base_id) {
		request({
			method: 'GET',
			url: '/system/boke_live_user/',
			params: {
				is_active: '',
				base_id: props.base_id
			}
		})
			.then((response) => {
				console.log(response)
				userInfo.value = response.items?.[0] || {}
			})
			.finally(() => {
				loading.value = false
			})
	} else {
		request({
			baseURL: settings.API_BOKE_URL,
			method: 'GET',
			url: '/system/users/',
			// eslint-disable-next-line no-dupe-keys
			method: 'GET',
			params: Object.assign(
				{
					is_active: ''
				},
				props.userId ? { user_id: props.userId } : { union_id: props.feishuUserId }
			)
		})
			.then((response) => {
				console.log(response)
				userInfo.value = response.items?.[0] || {}
			})
			.finally(() => {
				loading.value = false
			})
	}
})
</script>

<style lang="scss" scoped>
:deep(.el-form-item) {
	margin-bottom: 8px;
}
:deep(.el-form) {
	gap: 0px 22px;
}

.div-inline {
	display: flex;
	flex-flow: row nowrap;
}

.user-profile__container {
	padding: calc(16px - var(--el-popover-padding));

	.username {
		font-size: 18px;
		font-weight: 600;
	}
}
.chat-button {
	border: none;
	box-sizing: border-box;
	border-radius: 10px;
	background: var(--boke-color-border-divider);
	text-align: center;
	line-height: 32px;
	width: 100%;
	display: block;
	font-weight: 700;
}
.my-a {
	text-decoration: none;
	color: inherit;
}
</style>
