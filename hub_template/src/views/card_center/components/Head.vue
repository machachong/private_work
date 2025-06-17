<template>
	<div class="flex-around card-head">
		<div class="left">
			<el-space>
				<i class="iconfont logo">&#xe693;</i>
				<span>{{ msgType == 1 ? '飞书' : '邮件' }}通知中心</span>
				<el-badge :value="unread" class="item" :show-zero="false">
					<span class="switch-button" v-if="msgType == 1" @click="handleSwitchType(1)">
						<i class="iconfont">&#xe698;</i>
						<span>切换邮件通知</span>
					</span>
					<span class="switch-button" v-else @click="handleSwitchType(2)">
						<i class="iconfont">&#xe68e;</i>
						<span>切换飞书通知</span>
					</span>
				</el-badge>
			</el-space>
		</div>
		<div>
			<el-space :size="20">
				<!-- v-if="msgType == 1" -->
				<boke-select
					v-model="form.project_name"
					:options="projectList"
					placeholder="请选择项目"
					clearable
					@change="handleChange"
				></boke-select>
				<el-input
					ref="titleInputRef"
					v-model="form.searchValue"
					placeholder="请输入标题/内容，按回车快速搜索"
					clearable
					style="width: 280px"
					@clear="handleChange"
					@keyup.enter="handleChange"
				>
					<template #suffix>
						<el-tooltip
							class="box-item"
							effect="dark"
							content="可以对卡片的标题，文本内容，图片内容进行搜索"
							placement="top"
							:show-after="200"
						>
							<el-icon style="cursor: pointer"><Warning /></el-icon>
						</el-tooltip>
					</template>
				</el-input>

				<boke-button type="primary" @click="handleChange">
					<el-icon style="vertical-align: middle">
						<Search />
					</el-icon>
				</boke-button>
				<el-space>
					<el-dropdown>
						<div class="user-img">
							<el-avatar style="vertical-align: middle" :size="40" :src="userInfo?.header_img_url" />
						</div>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item>
									<div @click="logout">
										<el-space :size="0">
											<el-icon><SwitchButton /></el-icon>
											<span>退出</span>
										</el-space>
									</div>
								</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</el-space>
			</el-space>
		</div>
	</div>
</template>

<script setup>
// import dayjs from "dayjs"
import { SwitchButton, Search, Warning } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { logout } from '@/utils/auth/logout'
import { useUserStore, useMessageCenter } from '@/stores'
defineProps({
	projectList: {
		type: Array,
		default: () => []
	}
})
const userStore = useUserStore()
const messageStore = useMessageCenter()
const { msgType, unread } = storeToRefs(messageStore)
const { userInfo } = storeToRefs(userStore)
const emits = defineEmits(['search'])
const form = ref({
	searchValue: ''
	// date: [],
	// shotActive: "今天"
})
const titleInputRef = ref()
const handleChange = () => {
	// 2024-10-10 页面布局调整,迁移至CardList组件
	// if (!form.value.date) {
	// 	form.value.shotActive = null
	// }
	// if (form.value.date && form.value.date?.length > 0 && form.value.shotActive) {
	// 	const activeDate = timeShortcutsWeek.find((item) => item.text == form.value.shotActive)?.value()
	// 	if (dayjs(activeDate[0]).format("YYYY-MM-DD") != form.value.date[0] || dayjs(activeDate[1]).format("YYYY-MM-DD") !=  form.value.date[1]) {
	// 		form.value.shotActive = null
	// 	}
	// }
	emits('search', form.value)
}
// 2024-10-10 页面布局调整,迁移至CardList组件
// const disabledDate = (time) => {
// 	let tempTime = 3600 * 1000 * 24 * 30
// 	let timer = new Date(new Date() - 8.64e7).getTime() //转换时间戳(当前选中的日期)；
// 	let maxTime = timer - tempTime //前三十天可选
// 	return time.getTime() > new Date().getTime() || time.getTime() <= maxTime
// }
// form.value.date = [dayjs().format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")]
// handleChange()
const setTitle = (title) => {
	form.value.searchValue = title
	titleInputRef.value?.focus()
}
const searchHistoryName = (title) => {
	form.value.searchValue = title
	form.value.date = []
	form.value.shotActive = null
	emits('search', form.value)
}
// 2024-10-10 页面布局调整,迁移至CardList组件
// const changeShot = (value) => {
// 	if (value) {
// 		const activeDate = timeShortcutsWeek.find((item) => item.text == value)?.value()
// 		form.value.date = [dayjs(activeDate[0]).format("YYYY-MM-DD"), dayjs(activeDate[1]).format("YYYY-MM-DD")]
// 	}
// 	handleChange()
// }
const handleSwitchType = (value) => {
	messageStore.setType(value)
}
const handleReset = () => {
	form.value.searchValue = ''
	form.value.date = []
	form.value.shotActive = null
}
defineExpose({
	setTitle,
	searchHistoryName,
	handleReset
})
</script>
<style scoped lang="scss">
.card-head {
	height: 60px;
	border-bottom: 1px solid var(--boke-search-divider-color);
	padding-right: 20px;
	.logo {
		font-size: 30px;
	}
	.left {
		padding-left: 12px;
		font-size: 16px;
		font-weight: bold;
	}
}
.el-input-group__append button.el-button--primary {
	background-color: var(--boke-color-main);
	color: var(--boke-color-fff);
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
	&:hover {
		opacity: 0.8;
	}
}
.switch-button {
	border: 1px solid var(--boke-color-border-divider);
	padding: 4px 8px;
	border-radius: 4px;
	display: flex;
	align-items: center;
	gap: 6px;
	font-weight: normal;
	font-size: 14px;
	margin-left: 18px;
	cursor: pointer;
	.iconfont {
		font-size: 18px;
	}
	&:hover {
		background: var(--boke-bg-nav-second);
	}
}
::view-transition-old(root),
::view-transition-new(root) {
	animation: none;
	mix-blend-mode: normal;
}

/* 进入dark模式和退出dark模式时，两个图像的位置顺序正好相反 */
.dark::view-transition-old(root) {
	z-index: 1;
}

.dark::view-transition-new(root) {
	z-index: 999;
}

::view-transition-old(root) {
	z-index: 999;
}

::view-transition-new(root) {
	z-index: 1;
}
</style>
