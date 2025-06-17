<template>
	<!-- v-loading="loading" -->
	<div class="card-content">
		<div class="content-title flex-around">
			<span>全部通知</span>
			<el-space>
				<boke-button :icon="Refresh" type="primary" @click="handleRefresh">刷新</boke-button>
				<!-- <boke-button type="primary" :icon="Filter"> 筛选</boke-button> -->
				<boke-button @click="setAllRead">
					<el-space>
						<i class="iconfont icon-quanbubiaoweiyidu"></i>
						<span>全部已读</span>
					</el-space>
				</boke-button>
			</el-space>
		</div>
		<div class="list-height">
			<section
				class="card-list"
				ref="cardListRef"
				v-infinite-scroll="loadSize"
				:infinite-scroll-distance="1"
				:infinite-scroll-immediate="false"
				@scroll="handleScroll"
			>
				<div class="card-item flex-around" v-for="item in cardList" :key="item.id" @click="handleClickCard(item)">
					<div class="item-robot">
						<img class="robot-img" :src="getLabel(roubotList, item.robot_open_id, 'avatar_url', 'open_id')" alt="" />
						<p class="color-describe">{{ getLabel(roubotList, item.robot_open_id, 'app_name', 'open_id') }}</p>
					</div>
					<div class="item-content">
						<div class="title">{{ item.card_title }}</div>
						<el-space class="info" :size="33">
							<span>发送时间：{{ resolveTime(item) }}</span>
							<!-- <span v-if="item.receive_type == 1">来源：单个用户</span> -->
							<span v-if="item.receive_type == 2">
								<div class="flex-middle">
									<span>来自群组：</span>
									<el-image
										style="margin-top: 5px; width: 24px; margin-left: 4px"
										:src="item.chat_group_avatar"
										preview-teleported
									>
										<template #error>
											<div class="image-slot">
												<el-icon><icon-picture /></el-icon>
											</div>
										</template>
									</el-image>
									<span style="line-height: 24px; margin-left: 4px">{{ item.chat_group_name }}</span>
								</div>
							</span>
						</el-space>
					</div>
					<el-space :size="20" class="item-handle">
						<el-tooltip :content="item?.read_type == 0 ? '设置已读' : '取消已读'" placement="top">
							<i class="iconfont f-s-30" v-if="item?.read_type == 1" @click.stop="handleEdit(item, 1)">&#xea96;</i>
							<i class="iconfont icon-un-read f-s-30 color-content" @click.stop="handleEdit(item, 1)" v-else></i>
							<!-- <i
							class="iconfont icon-info-read f-s-24 pointer"
							:class="{ active: item?.read_type == 1 }"
							@click.stop="handleEdit(item, 1)"
						></i> -->
						</el-tooltip>
						<el-tooltip :content="item?.flag_type == 0 ? '设置标记' : '取消标记'" placement="top">
							<i class="iconfont f-s-30" v-if="item?.flag_type == 1" @click.stop="handleEdit(item, 2)">&#xe636;</i>
							<i class="iconfont icon-biaoji2 f-s-30 color-content" @click.stop="handleEdit(item, 2)" v-else></i>
							<!-- <i
							class="iconfont icon-biaoji f-s-24 pointer"
							:class="{ active: item?.flag_type == 1 }"
							@click.stop="handleEdit(item, 2)"
						></i> -->
						</el-tooltip>
					</el-space>
					<span class="unread" v-if="item.read_type == 0"></span>
				</div>
				<el-backtop target=".card-list" :right="80" :bottom="80">
					<el-tooltip placement="top" content="返回顶部">
						<el-icon><Upload /></el-icon>
					</el-tooltip>
				</el-backtop>
				<div v-if="loading" class="loading-text">加载中...</div>
			</section>
		</div>
		<LarkCard :visible="cardInfo.visible" :row="cardInfo.row" @close="cardInfo.visible = false"></LarkCard>
	</div>
</template>

<script setup>
import { debounce } from 'lodash'
import { Refresh, Upload } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { getCardListApi, editCardApi, setAllReadApi } from '@/views/card_center/service/card_api.js'
import { useUserStore } from '@/stores'
import { getLabel, message, confirm } from '@/utils/tools'
import LarkCard from '@/views/card_center/components/larkCard/index_copy.vue'
const props = defineProps({
	activeStatus: {
		type: Object,
		default: () => {
			return {}
		}
	},
	roubotList: {
		type: Array,
		default: () => []
	},
	searchValue: {
		type: String,
		default: ''
	},
	updateOverview: {
		type: Function,
		default: () => {}
	}
})
const userStore = useUserStore()
const cardList = ref([])
const loading = ref(false)
const cardListRef = ref()
const cardParams = ref({
	page: 1,
	size: 20,
	card_title: '',
	read_type: '', // (0, '未读'),(1, '已读'),
	flag_type: '', //   (0, '未标记'), (1, '已标记')
	start_operation_date: '',
	end_operation_date: ''
})
const cardInfo = ref({
	visible: false,
	row: {}
})
const noMore = ref(false)
const currentStatus = ref() // 保存传过来的状态，如果一样则不再重复执行
const getCardList = async (load = true, direction = 'bottom') => {
	noMore.value = false
	if (!userStore.userInfo?.union_id) {
		return message.error('用户id不存在')
	}
	try {
		if (load) loading.value = true
		const { items = [], total } = await getCardListApi({
			feishu_user_id: userStore.userInfo?.union_id,
			robot_open_id: props?.activeStatus?.robot,
			...cardParams.value
		})
		if (load) loading.value = false
		console.log('是否还有', total, cardParams.value.size, cardParams.value.page)
		if (total <= cardParams.value.size * cardParams.value.page) {
			noMore.value = true
		}
		currentStatus.value = props.activeStatus
		// cardList.value.push(...items)
		// 每次只显示40个，加载更多时删除之前的
		if (cardList.value?.length > 20) {
			console.log(1)
			if (direction == 'bottom') {
				cardList.value.splice(0, 20)
				cardList.value.push(...items)
				cardListRef.value.scrollTop = 950
			} else {
				cardList.value.splice(20, cardList.value.length)
				console.log(cardList.value, items)
				for (let i in items.length) {
					cardList.value.unshift(items[items.length - i])
				}
				cardListRef.value.scrollTop = 950
			}
		} else if (cardList.value?.length == 20) {
			console.log(2)
			cardList.value.push(...items)
		} else {
			console.log(3)
			cardList.value = items
		}
	} catch (error) {
		if (load) loading.value = false
		console.log(error)
	}
}
const isFirstTop = ref(false)
const loadSize = (direction = 'bottom') => {
	if (noMore.value && direction == 'bottom') {
		return false
	}
	if (direction == 'bottom') {
		cardParams.value.page += 1
	} else {
		if (isFirstTop.value) {
			cardParams.value.page = cardParams.value.page - 2
			isFirstTop.value = false
		} else {
			cardParams.value.page = cardParams.value.page - 1
		}
	}
	getCardList()
}
const handleScroll = debounce((e) => {
	console.log(e?.srcElement?.scrollTop <= 100, cardParams.value.page >= 2)
	if (e?.srcElement?.scrollTop <= 100 && cardParams.value.page >= 2) {
		isFirstTop.value = true
		loadSize('top')
	}
}, 200)
const handleRefresh = (search) => {
	cardParams.value.page = 1
	cardParams.value.card_title = search?.title
	if (search?.date && search?.date?.length > 0) {
		cardParams.value.start_operation_date = search.date[0]
		cardParams.value.end_operation_date = search.date[1]
	} else {
		cardParams.value.start_operation_date = ''
		cardParams.value.end_operation_date = ''
	}
	cardList.value = []
	getCardList()
}
const resolveParams = (val) => {
	if (val.value == 1) {
		cardParams.value.read_type = ''
		cardParams.value.flag_type = ''
	} else if (val.value == 2) {
		cardParams.value.read_type = 0
		cardParams.value.flag_type = ''
	} else if (val.value == 3) {
		cardParams.value.read_type = 1
		cardParams.value.flag_type = ''
	} else if (val.value == 4) {
		cardParams.value.read_type = ''
		cardParams.value.flag_type = 1
	}
}
const handleClickCard = (row) => {
	cardInfo.value.row = row
	cardInfo.value.visible = true
	handleEdit(row, 1, false)
}
const handleEdit = async (row, type, showMsg = true) => {
	try {
		const { id, flag_type, read_type } = row
		const params = {
			id
		}
		let msg = ''
		if (type == 1) {
			params.read_type = read_type == 0 ? 1 : 0
			msg = read_type == 1 ? '设置未读成功' : '设置已读成功'
		} else if (type == 2) {
			params.flag_type = flag_type == 0 ? 1 : 0
			msg = flag_type == 1 ? '取消标记成功' : '设置标记成功'
		}
		await editCardApi(params)
		if (type == 1) {
			row.read_type = read_type == 0 ? 1 : 0
		} else if (type == 2) {
			row.flag_type = flag_type == 0 ? 1 : 0
		}
		props.updateOverview()
		if (showMsg) {
			message.success(msg)
		}
	} catch (error) {
		console.log(error)
	}
}
const resolveTime = (row) => {
	return row?.send_time
}
const setAllRead = async () => {
	try {
		await confirm('确定全部设为已读吗？')
		await setAllReadApi({
			feishu_user_id: userStore.userInfo?.union_id
		})
		props.updateOverview()
		handleRefresh()
		message.success('全部设为已读')
	} catch (error) {
		console.log(error)
	}
}

watch(
	() => props.activeStatus,
	(val) => {
		cardParams.value.page = 1
		cardList.value = []
		resolveParams(val)
		getCardList()
	},
	{
		deep: true,
		immediate: true
	}
)
defineExpose({
	handleRefresh
})
</script>

<style scoped lang="scss">
.card-content {
	padding-right: 10px;
	.content-title {
		padding: 8px 16px;
	}
	.list-height {
		height: calc(100vh - 180px);
	}
	.card-list {
		border-top: 1px solid var(--boke-color-border-divider);
		overflow-y: scroll;
		overflow-x: hidden;
		height: 100%;
		padding-right: 20px;
		.card-item {
			padding: 16px;
			border-bottom: 1px solid var(--boke-color-border-divider);
			position: relative;
			cursor: pointer;
			.robot-img {
				width: 40px;
				height: auto;
				margin-bottom: 6px;
			}
			.item-robot {
				text-align: center;
				padding-right: 16px;
				width: 150px;
				text-align: center;
				flex: 0 0 150px;
			}
			.item-content {
				max-width: calc(100% - 300px);
				flex: 1 1 auto;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				// display: flex;
				// flex-direction: column;
				// gap: 16px;
				.title {
					font-size: 14px;
					line-height: 14px;
				}
				.info {
					margin-top: 20px;
					color: var(--boke-color-text-describe);
				}
			}
			.item-handle {
				// flex: 0 0 150px;
				margin-left: auto;
				text-align: right;
			}

			.unread {
				background: var(--boke-color-fail);
				position: absolute;
				right: 10px;
				top: 10px;
				display: inline-block;
				width: 10px;
				height: 10px;
				border-radius: 50%;
			}
			&:hover {
				background: var(--boke-table-current-row-bg-color);
			}
		}
	}
	.loading-text {
		font-size: 16px;
		line-height: 50px;
		text-align: center;
		color: var(--boke-color-text-content);
	}
}
.pointer {
	&:hover {
		color: var(--boke-color-main);
	}
}
.active {
	color: var(--boke-color-main);
}
</style>
