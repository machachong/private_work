<template>
	<el-popover
		:placement="placement"
		:width="width"
		:trigger="trigger"
		:hide-after="100"
		v-bind="$attrs"
		@show="visible = true"
		@hide="visible = false"
	>
		<UserProfile v-if="visible" :user-id="userId" :base_id="base_id" :feishu-user-id="feishuUserId" />
		<template #reference>
			<span class="detail-text">
				<slot>
					{{ userName }}
				</slot>
			</span>
		</template>
	</el-popover>
</template>

<script setup>
import { ref } from 'vue'
import UserProfile from './UserProfile.vue'

defineProps({
	userId: [Number, String], // 系统用户id
	feishuUserId: String, // 飞书用户user_id，和系统用户id二选一即可，默认为系统用户id
	userName: String,
	width: {
		type: [Number, String],
		default: 320
	},
	placement: {
		type: String,
		default: 'right-start'
	},
	trigger: {
		type: String,
		default: 'hover'
	},
	base_id: {
		type: String,
		default: ''
	}
})

const visible = ref(false)
</script>

<style lang="scss" scoped>
.detail-text {
	color: var(--boke-color-main);
	cursor: pointer;
}
</style>
