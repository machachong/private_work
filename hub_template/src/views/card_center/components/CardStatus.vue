<template>
	<section>
		<div class="card-status">
			<p class="tip">状态栏</p>
			<ul class="status-list">
				<li
					v-for="item in messageList"
					:key="item.value"
					class="flex-around"
					:class="{ active: activeStatus?.value == item.value }"
					@click="handleSelect(item, 1)"
				>
					<el-space class="label">
						<i class="iconfont" :class="item.class"></i>
						{{ item.label }}
					</el-space>
					<span class="no-read" v-if="item.count">
						{{ item.count > 99 ? `99+` : item.count }}
					</span>
				</li>
			</ul>
		</div>
		<div class="card-status" v-if="msgType == 1">
			<p class="tip">机器人列表</p>
			<ul class="status-list">
				<li
					v-for="item in robotList"
					:key="item.open_id"
					class="flex-around"
					:class="{ active: activeStatus?.robot == item.open_id }"
					@click="handleSelect(item, 2)"
				>
					<el-space>
						<el-image style="width: 30px; height: 30px" :src="item.avatar_url"></el-image>
						<span>{{ item.app_name }}</span>
					</el-space>
					<span class="no-read" :class="{ igno: robotIgno?.includes(item?.open_id) }" v-if="item.count">
						{{ item.count > 99 ? `99+` : item.count }}
					</span>
				</li>
			</ul>
		</div>
		<div class="card-setting" v-if="msgType == 1">
			<p class="tip"
				><CardSetting :feishu_user_id="feishu_user_id" :roubotList="roubotList" @ok="handleSetOk"></CardSetting
			></p>
		</div>
	</section>
</template>

<script setup>
import { getMsgOverviewApi } from '@/views/card_center/service/card_api.js'
import { useUserStore, useMessageCenter } from '@/stores'
import { statusDict } from '@/views/card_center/config/config.js'
import CardSetting from './CardSetting.vue'

const props = defineProps({
	roubotList: {
		type: Array,
		default: () => []
	},
	feishu_user_id: {
		type: String,
		default: ''
	},
	robotIgno: {
		type: Array,
		default: () => []
	}
})
const emits = defineEmits(['updateStatus', 'setUnread', 'handleSetOk'])
const userStore = useUserStore()
const messageStore = useMessageCenter()
const { msgType } = storeToRefs(messageStore)
const messageList = ref([...statusDict])
const activeStatus = ref({
	value: 1,
	robot: null
})
const allStatus = ref({}) // 所有的状态数据
const robotList = computed(() => {
	return props.roubotList?.map((item) => {
		const count = Object.keys(allStatus.value).includes(item.open_id) ? allStatus.value[item.open_id] : null
		return {
			...item,
			count
		}
	})
})
const handleSelect = (value, type) => {
	if (type == 1) {
		activeStatus.value.value = value?.value
		activeStatus.value.robot = ''
	} else if (type == 2) {
		activeStatus.value.robot = value?.open_id
		activeStatus.value.value = ''
		// 2024-10-10 机器人和状态修改为互斥单选
		// if (activeStatus.value.robot == value?.open_id) {
		// 	activeStatus.value.robot = ""
		// } else {
		// 	activeStatus.value.robot = value?.open_id
		// }
	}
	emits('updateStatus', activeStatus.value)
}
const getUserOverview = async () => {
	let Api = getMsgOverviewApi
	// if(msgType.value == 2){
	// 	Api = getUserOverviewEmailApi
	// }
	const { items } = await Api({
		feishu_user_id: userStore.userInfo?.union_id
	})
	emits('setUnread', items.unread_count)
	if (msgType.value == 2) {
		allStatus.value = items.mail
		messageStore.setUnread(items.card?.unread_count)
	} else {
		allStatus.value = items.card
		messageStore.setUnread(items.mail?.unread_count)
	}
	messageList.value.forEach((item) => {
		if (item.value == 2) {
			item.count = allStatus.value?.unread_count
		}
		if (item.value == 4) {
			item.count = allStatus.value?.flag_count
		}
	})
}
const handleSetOk = () => {
	emits('handleSetOk')
}
defineExpose({
	getUserOverview
})
</script>

<style scoped lang="scss">
.card-status {
	border-bottom: 1px solid var(--boke-color-border-divider);
	.tip {
		padding: 14px 8px 8px;
		font-size: 14px;
		color: var(--boke-color-text-describe);
	}
	.status-list {
		padding: 8px;
		li {
			line-height: 40px;
			padding: 0 6px 0 10px;
			list-style: none;
			margin-bottom: 10px;
			cursor: pointer;
			.label {
				font-size: 14px;
			}
			i {
				font-size: 20px;
			}
			.no-read {
				background: var(--boke-color-fail);
				color: var(--boke-color-fff);
				display: inline-block;
				width: 22px;
				height: 22px;
				border-radius: 22px;
				line-height: 22px;
				font-size: 12px;
				text-align: center;
				&.igno {
					background: var(--boke-color-text-disable);
				}
			}
			&:hover {
				background-color: #f5f5f5;
				border-radius: 8px;
				color: var(--boke-color-main);
			}
			&.active {
				background-color: #ecf0fc;
				border-radius: 8px;
				color: var(--boke-color-main);
			}
		}
	}
}
.card-setting {
	line-height: 30px;
	padding: 14px 0 0 18px;
	i {
		font-size: 30px;
	}
}
</style>
