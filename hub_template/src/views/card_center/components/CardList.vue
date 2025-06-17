<template>
	<div class="card-content" ref="contentRightRef">
		<div class="content-title flex-around">
			<el-space>
				<span>{{ activeTitle }}</span>
				<span class="refresh-btn"
					><boke-text-button :icon="Refresh" type="primary" @click="handleFresh()"></boke-text-button
				></span>
			</el-space>
			<el-space>
				<el-radio-group v-model="form.shotActive" @change="changeShot">
					<el-radio-button v-for="item in timeShortcutsWeek" :key="item.text" :label="item.text" :value="item.text" />
				</el-radio-group>
				<el-date-picker
					style="width: 280px"
					v-model="form.date"
					type="daterange"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					value-format="YYYY-MM-DD"
					format="YYYY-MM-DD"
					:disabled-date="disabledDate"
					:shortcuts="timeShortcutsWeek"
					@change="handleChange"
				/>
				<CardFilter
					v-if="msgType == 1"
					ref="filterRef"
					:roubotList="roubotList"
					:activeStatus="activeStatus"
					@ok="handleFilter"
				></CardFilter>
				<SetAllRead
					:roubotList="roubotList"
					:userInfo="userStore.userInfo"
					:msgType="msgType"
					:updateOverview="updateOverview"
					@ok="handleRefresh"
				></SetAllRead>
			</el-space>
		</div>
		<div class="card-flex">
			<BokeResizeBox :resize-conf="resizeConf" cache>
				<div class="list-height card-list-flex" v-loading="readLoading" element-loading-text="加载中...">
					<section
						v-if="cardList?.length"
						class="card-list"
						ref="cardListRef"
						v-infinite-scroll="loadSize"
						:infinite-scroll-distance="20"
						:infinite-scroll-delay="500"
						:infinite-scroll-disabled="scrollDisabled"
						:infinite-scroll-immediate="false"
					>
						<div
							class="card-item flex-around"
							v-for="item in cardList"
							:key="item.id"
							:class="{
								read: item?.read_type == 1,
								warn: item?.extra_info?.send_type == 4 && item?.extra_info?.warn_lv == 2,
								error: item?.extra_info?.send_type == 4 && item?.extra_info?.warn_lv == 1,
								active: cardInfo.row?.id == item.id,
								dark: isDark
							}"
							@click.stop="handleClickCard(item)"
						>
							<template v-if="msgType == 1">
								<div class="item-robot">
									<img
										class="robot-img"
										:src="getLabel(roubotList, item.robot_open_id, 'avatar_url', 'open_id')"
										alt=""
									/>
									<p class="color-describe f-s-12">{{
										getLabel(roubotList, item.robot_open_id, 'app_name', 'open_id')
									}}</p>
									<span
										class="unread"
										v-if="item.read_type == 0"
										:class="{ igno: robotIgno.includes(item.robot_open_id) }"
									></span>
								</div>
								<div class="item-content">
									<div class="title">
										<el-space :size="0">
											<el-tooltip content="复制标题到搜索栏" placement="top">
												<span class="copy-title" @click.stop="handleCopyToSearch(item)"
													><el-icon><CopyDocument /></el-icon
												></span>
											</el-tooltip>
											<span>{{ item.card_title || item?.mail_title }}</span>
											<el-tag type="primary" v-if="item?.extra_info?.project_name" class="m-l-16">{{
												item?.extra_info?.project_name
											}}</el-tag>
											<el-tag type="warning" v-if="item?.extra_info?.send_type" class="m-l-16">{{
												getLabel(sendTypeDict, item?.extra_info?.send_type)
											}}</el-tag>
										</el-space>
									</div>
									<div class="group-info" v-if="item.receive_type == 2">
										<div class="flex-middle">
											<span>来自群组：</span>
											<el-image
												style="margin-top: 0px; width: 18px; margin-left: 4px"
												:src="item.chat_group_avatar"
												preview-teleported
											>
												<template #error>
													<div class="image-slot">
														<el-icon><Picture /></el-icon>
													</div>
												</template>
											</el-image>
											<span style="line-height: 24px; margin-left: 4px">{{ item.chat_group_name }}</span>
										</div>
									</div>
									<el-space class="send-time" :size="12">
										<el-space v-if="item?.comment_num > 0" :size="2" class="color-main"
											><i class="iconfont icon-pinglun"></i>{{ item?.comment_num }}</el-space
										>
										<span class="time"> 发送时间：{{ resolveTime(item) }} </span></el-space
									>
									<!-- item?.description  -->
									<div class="color-describe f-s-12 item-des" v-html="item?.card_overview"></div>
									<div
										class="triangle-normal"
										v-if="item?.extra_info?.send_type == 4 && item?.extra_info?.warn_lv == 3"
									>
										<span class="text">普通</span>
									</div>
									<div
										class="triangle-normal triangle-warn"
										v-if="item?.extra_info?.send_type == 4 && item?.extra_info?.warn_lv == 2"
									>
										<span class="text">警告</span>
									</div>
									<div
										class="triangle-normal triangle-fail"
										v-if="item?.extra_info?.send_type == 4 && item?.extra_info?.warn_lv == 1"
									>
										<span class="text">严重</span>
									</div>
								</div>
								<el-space :size="20" class="item-handle">
									<!-- <el-tooltip :content="item?.read_type == 0 ? '设置已读' : '取消已读'" placement="top">
							<i
								class="iconfont f-s-30"
								v-if="item?.read_type == 1"
								@click.stop="handleEdit(item, 1)"
								>&#xea96;</i
							>
							<i
								class="iconfont icon-un-read f-s-30 color-content"
								@click.stop="handleEdit(item, 1)"
								v-else
							></i>
						</el-tooltip> -->
									<el-tooltip :content="item?.flag_type == 0 ? '设置标记' : '取消标记'" placement="top">
										<i class="iconfont f-s-24" v-if="item?.flag_type == 1" @click.stop="handleEdit(item, 2)"
											>&#xe636;</i
										>
										<i class="iconfont icon-biaoji2 f-s-24 color-content" @click.stop="handleEdit(item, 2)" v-else></i>
										<!-- <i
							class="iconfont icon-biaoji f-s-24 pointer"
							:class="{ active: item?.flag_type == 1 }"
							@click.stop="handleEdit(item, 2)"
						></i> -->
									</el-tooltip>
								</el-space>
							</template>
							<template v-else>
								<span class="unread unread-email" v-if="item.read_type == 0"></span>
								<div class="item-content" :class="{ 'item-content-mail': msgType == 2 }">
									<div class="title">
										<el-space>
											<el-space :size="0">
												<el-tooltip content="复制标题到搜索栏" placement="top">
													<span class="copy-title" @click.stop="handleCopyToSearch(item)"
														><el-icon><CopyDocument /></el-icon
													></span>
												</el-tooltip>
												<span>{{ item.card_title || item?.mail_title }}</span>
												<el-tag type="primary" v-if="item?.project_name" class="m-l-16">{{
													item?.project_name
												}}</el-tag>
											</el-space>
										</el-space>
									</div>
									<el-space class="send-time">
										<span class="time"> 发送时间：{{ item.send_time ? resolveTime(item) : null }} </span></el-space
									>
									<div class="color-describe f-s-12 item-des" v-html="item.mail_overview"></div>
								</div>
								<el-space :size="20" class="item-handle">
									<el-tooltip :content="item?.flag_type == 0 ? '设置标记' : '取消标记'" placement="top">
										<i class="iconfont f-s-24" v-if="item?.flag_type == 1" @click.stop="handleEdit(item, 2)"
											>&#xe636;</i
										>
										<i class="iconfont icon-biaoji2 f-s-24 color-content" @click.stop="handleEdit(item, 2)" v-else></i>
									</el-tooltip>
								</el-space>
							</template>
						</div>
						<el-backtop target=".card-list" :right="scrollTopRight" :bottom="80">
							<el-tooltip placement="top" content="返回顶部">
								<el-icon><Upload /></el-icon>
							</el-tooltip>
						</el-backtop>
					</section>
					<el-empty v-if="showEmpty && !readLoading" description="暂无数据" />
					<div v-if="loading" class="loading-text">加载中...</div>
				</div>
			</BokeResizeBox>
			<div class="card-preview" v-if="msgType == 1">
				<el-scrollbar height="100%">
					<LarkCard
						ref="LarkCardRef"
						v-if="showCard"
						:row="cardInfo.row"
						:commentStatus="cardInfo.commentStatus"
						:feishu_user_id="userStore.userInfo?.union_id"
						@openComment="cardInfo.commentStatus = true"
					></LarkCard>
				</el-scrollbar>
			</div>
			<div class="email-preview" v-else>
				<el-scrollbar height="100%">
					<EmailTemplate :row="cardInfo.row"></EmailTemplate>
				</el-scrollbar>
			</div>
		</div>
		<!-- <LarkCard
			:visible="cardInfo.visible"
			:row="cardInfo.row"
			:feishu_user_id="userStore.userInfo?.union_id"
			@close="cardInfo.visible = false"
		></LarkCard> -->
		<!-- <EmailTemplate
			:visible="cardInfo.email_visible"
			:row="cardInfo.row"
			@close="cardInfo.email_visible = false"
		></EmailTemplate> -->
	</div>
</template>

<script setup>
import { dayjs } from 'element-plus'
import { debounce } from 'lodash'
import { Refresh, Upload, CopyDocument, Picture } from '@element-plus/icons-vue'
import { getCardListApi, editCardApi, getEmailListApi, editEmailApi } from '@/views/card_center/service/card_api.js'
import { useUserStore, useMessageCenter } from '@/stores'
import { getLabel, message, timeShortcutsWeek } from '@/utils/tools'
import { statusDict, sendTypeDict, warnLevelDict } from '@/views/card_center/config/config.js'
import { isDark } from '@/composables'
// import { searchTrack } from "@/views/card_center/config/track"
import tracker from '@/utils/tracking'
import LarkCard from '@/views/card_center/components/larkCard/index.vue'
import CardFilter from '@/views/card_center/components/CardFilter.vue'
import EmailTemplate from '@/views/card_center/components/EmailTempalte/Index.vue'
import SetAllRead from '@/views/card_center/components/SetAllRead.vue'

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
		type: Object,
		default: () => {
			return {}
		}
	},
	updateOverview: {
		type: Function,
		default: () => {}
	},
	robotIgno: {
		type: Array,
		default: () => []
	}
})
const emits = defineEmits(['searchTitle'])
const userStore = useUserStore()
const messageStore = useMessageCenter()
const { msgType } = storeToRefs(messageStore)
const cardList = ref([])
const loading = ref(false)
const readLoading = ref(false)
const filterRef = ref()
const resizeConf = reactive({
	size: 900, // 初始宽度
	sizeRange: [400, 1140]
})
const scrollTopRight = ref(20)
const cardParams = ref({
	page: 1,
	size: 20,
	card_title: '',
	project_name: '',
	robot_open_id: '',
	send_type: '',
	warn_lv: '',
	read_type: '', // (0, '未读'),(1, '已读'),
	flag_type: '', //   (0, '未标记'), (1, '已标记')
	start_operation_date: '',
	end_operation_date: ''
})
const cardInfo = ref({
	visible: false,
	email_visible: false,
	row: {},
	commentStatus: false
})
const form = ref({
	searchValue: '',
	date: [],
	shotActive: ''
})
const LarkCardRef = ref()
const showCard = ref(false) // 强行刷新組件
const contentRightRef = ref()
const cardListRef = ref()
const activeTitle = ref('全部通知')
const eventStatus = ref() // 埋点字段信息
const showEmpty = ref() // 是否展示空状态
const currentStatus = ref() // 保存传过来的状态，如果一样则不再重复执行
const disabledDate = (time) => {
	const tempTime = 3600 * 1000 * 24 * 30
	const timer = new Date(new Date() - 8.64e7).getTime() //转换时间戳(当前选中的日期)；
	const maxTime = timer - tempTime //前三十天可选
	return time.getTime() > new Date().getTime() || time.getTime() <= maxTime
}
// 默认选中时间
// form.value.date = [dayjs().format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")]
// const getEmailUserName = async (items) => {
// 	for (let i in items) {
// 		items[i].description = await getCardContent(items[i].card_body)
// 	}
// }
const getCardList = async (load = true, id, type) => {
	try {
		if (load) {
			loading.value = true
		}
		showEmpty.value = false
		if (!userStore.userInfo?.union_id) {
			return message.error('用户id不存在')
		}
		let Api = getCardListApi
		const params = {
			feishu_user_id: userStore.userInfo?.union_id,
			...cardParams.value,
			card_content: cardParams.value.card_title
		}
		// card_title 也通过card_content传递
		delete params.card_title
		if (id) {
			params[type] = id
		}
		if (msgType.value == 2) {
			readLoading.value = true
			Api = getEmailListApi
			params.mail_title = cardParams.value.card_title
			delete params.card_title
		}
		const { items = [] } = await Api(params)
		readLoading.value = false
		if (load) {
			loading.value = false
			// 2024-12-5只保留点击的埋点，其他的无所谓不需要记录
			// searchTrack({
			// 	标题: cardParams.value.card_title,
			// 	项目: cardParams.value.project_name,
			// 	发送日期: [cardParams.value.start_operation_date, cardParams.value.end_operation_date],
			// 	状态: getLabel(statusDict, eventStatus.value?.value),
			// 	机器人: getLabel(props.roubotList, eventStatus.value?.robot, "app_name", "open_id")
			// })
		}
		if (id) {
			return items
		}
		currentStatus.value = props.activeStatus
		// await getEmailUserName(items)
		cardList.value.push(...items)
		if (cardList.value?.length == 0) {
			showEmpty.value = true
		}
		initCardPreview(cardList.value)
	} catch (error) {
		if (load) {
			loading.value = false
		}
		readLoading.value = false
		console.log(error)
	}
}
const scrollDisabled = computed(() => {
	return readLoading.value || loading.value
})
const loadSize = () => {
	cardParams.value.page += 1
	// 筛选中没有选择机器人时，赋值侧边栏机器人值
	if (!filterRef.value?.form?.robot_open_id || filterRef.value?.form?.robot_open_id?.length == 0) {
		cardParams.value.robot_open_id = props?.activeStatus?.robot
	}
	getCardList()
}
const handleFresh = async () => {
	cardParams.value.page = 1
	cardList.value = []
	if (msgType.value == 2) {
		await getCardList(true)
		// initCardPreview() 刷新暂时不打开默认的
	} else {
		// filterRef.value?.handleReset()
		filterRef.value?.handleSubmit()
	}
}
const handleRefresh = async () => {
	cardParams.value.card_title = props.search?.title
	cardParams.value.project_name = props.search?.project_name
	cardParams.value.robot_open_id = props?.activeStatus?.robot
	cardParams.value.start_operation_date = ''
	cardParams.value.end_operation_date = ''
	form.value.date = []
	form.value.shotActive = ''
	handleFresh()
}
const resolveParams = (val) => {
	if (val.value == 1) {
		activeTitle.value = '全部通知'
		cardParams.value.read_type = ''
		cardParams.value.flag_type = ''
	} else if (val.value == 2) {
		activeTitle.value = '未读通知'
		cardParams.value.read_type = 0
		cardParams.value.flag_type = ''
	} else if (val.value == 3) {
		activeTitle.value = '已读通知'
		cardParams.value.read_type = 1
		cardParams.value.flag_type = ''
	} else if (val.value == 4) {
		activeTitle.value = '标记'
		cardParams.value.read_type = ''
		cardParams.value.flag_type = 1
	} else {
		cardParams.value.read_type = ''
		cardParams.value.flag_type = ''
	}
}
const handleClickCard = (row, track = false) => {
	cardInfo.value.row = undefined
	showCard.value = false
	cardInfo.value.row = row
	showCard.value = true
	// 设置当前机器人的ID给MD组件使用,避免获取失败的情况
	messageStore.setRobotOpenId(row?.robot_open_id)
	if (!track) {
		cardInfo.value.commentStatus = false
	}
	let description = '查看卡片预览'
	let title = row.card_title
	if (msgType.value == 1) {
		cardInfo.value.visible = true
	} else {
		cardInfo.value.email_visible = true
		description = '查看邮件预览'
		title = row.email_title
	}
	if (track) {
		tracker.push(
			{
				name: 'feishuCardPreview',
				description,
				behavior: 'click',
				permission_id: 150103,
				obj: JSON.stringify({
					params: {
						标题: title
					},
					card_title: {
						name: title
					}
				})
			},
			false,
			true
		)
	}

	if (row?.read_type == 0) {
		handleEdit(row, 1, false)
	}
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
		let Api = editCardApi
		if (msgType.value == 2) {
			Api = editEmailApi
		}
		await Api(params)
		if (type == 1) {
			row.read_type = read_type == 0 ? 1 : 0
		} else if (type == 2) {
			row.flag_type = flag_type == 0 ? 1 : 0
		}
		if (showMsg) {
			tracker.push(
				{
					name: 'feishuCardStatusEdit',
					description: '设置卡片状态',
					behavior: 'click',
					permission_id: 150102,
					obj: JSON.stringify({
						params: {
							卡片标题: row.card_title,
							操作: msg
						},
						card_title: {
							name: row.card_title
						}
					})
				},
				false,
				true
			)
		}
		props.updateOverview()
		if (showMsg) {
			message.success(msg)
		}
	} catch (error) {
		console.log(error)
	}
}
const timeFresh = async () => {
	console.log(541)
	try {
		cardList.value = []
		let start_operation_date,
			end_operation_date = ''
		if (props.searchValue?.date && props.searchValue?.date?.length > 0) {
			;[start_operation_date, end_operation_date] = props.searchValue.date
			cardParams.value.start_operation_date = start_operation_date
			cardParams.value.end_operation_date = end_operation_date
		}
		const params = {
			feishu_user_id: userStore.userInfo?.union_id,
			robot_open_id: props?.activeStatus?.robot,
			...cardParams.value,
			card_content: props.searchValue?.title, // card_title 也通过card_content传递
			start_operation_date,
			end_operation_date
		}

		delete params.card_title
		let Api = getCardListApi
		if (msgType.value == 2) {
			Api = getEmailListApi
			params.email_title = props.searchValue?.title
			delete params.card_title
		}
		const { items = [] } = await Api(params)
		const ids = cardList.value?.map((item) => item.id)
		const newItems = items?.filter((item) => !ids.includes(item.id))
		if (newItems?.length > 0) {
			// await getEmailUserName(newItems)
			cardList.value.push(...newItems)
		}
		initCardPreview(cardList.value)
	} catch (error) {
		console.log(error)
	}
}
// 格式化日期时间显示为邮件的显示格式
const resolveTime = (row) => {
	let showDate = ''
	const inputDate = dayjs(row?.send_time).format('YYYY-MM-DD')
	const today = dayjs().format('YYYY-MM-DD')
	const yestoday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
	const oneWeekAgo = dayjs().subtract(7, 'day')
	if (inputDate == today) {
		showDate = dayjs(row?.send_time).format('HH:mm:ss')
	} else if (inputDate == yestoday) {
		showDate = `昨天 ${dayjs(row?.send_time).format('HH:mm:ss')}`
	} else if (dayjs(row?.send_time).isAfter(oneWeekAgo)) {
		const weekDict = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
		showDate = `${weekDict[dayjs(row?.send_time).day()]} ${dayjs(row?.send_time).format('HH:mm:ss')}`
	} else {
		showDate = dayjs(row?.send_time).format('YYYY-MM-DD HH:mm:ss')
	}
	return showDate
}
const handleCopyToSearch = (item) => {
	// 过滤时间
	let title = item?.extra_info?.base_title || item.card_title
	if (msgType.value == 2) {
		title = item?.mail_title
	}
	emits('searchTitle', title)
}

// 切换日期
const handleChange = () => {
	if (!form.value.date) {
		form.value.shotActive = null
	}
	if (form.value.date && form.value.date?.length > 0 && form.value.shotActive) {
		const activeDate = timeShortcutsWeek.find((item) => item.text == form.value.shotActive)?.value()
		if (
			dayjs(activeDate[0]).format('YYYY-MM-DD') != form.value.date[0] ||
			dayjs(activeDate[1]).format('YYYY-MM-DD') != form.value.date[1]
		) {
			form.value.shotActive = null
		}
	}
	handleSearch()
}
// 切换日期按钮
const changeShot = (value) => {
	if (value) {
		const activeDate = timeShortcutsWeek.find((item) => item.text == value)?.value()
		form.value.date = [dayjs(activeDate[0]).format('YYYY-MM-DD'), dayjs(activeDate[1]).format('YYYY-MM-DD')]
	}
	handleChange()
}
const getArraysLabel = (arr, list, label, key) => {
	const newArr = arr?.map((item) => {
		return getLabel(list, item, label, key)
	})
	return newArr?.join(',')
}
// 筛选按钮
const handleFilter = async (value) => {
	cardParams.value.page = 1
	// 修改哪个更新哪个
	// type true为状态，false为机器人
	cardParams.value.send_type = value?.send_type?.join(',')
	cardParams.value.warn_lv = value?.warn_lv?.join(',')
	let trackRobot = ''
	if (value.type) {
		resolveParams(value)
		trackRobot = getLabel(props.roubotList, eventStatus.value?.robot, 'app_name', 'open_id')
	} else {
		cardParams.value.robot_open_id = value?.robot_open_id?.join(',')
		trackRobot = getArraysLabel(value?.robot_open_id, props.roubotList, 'app_name', 'open_id')
	}
	tracker.push(
		{
			name: 'feishuCardListsearch',
			description: '飞书卡片列表搜索',
			behavior: 'search',
			permission_id: 150101,
			obj: JSON.stringify({
				params: {
					标题: cardParams.value.card_title,
					项目: cardParams.value.project_name,
					发送日期: [cardParams.value.start_operation_date, cardParams.value.end_operation_date],
					状态: getLabel(statusDict, value.value),
					发送类型: getArraysLabel(value?.send_type, sendTypeDict),
					机器人: trackRobot,
					告警等级: getArraysLabel(value?.warn_lv, warnLevelDict)
				}
			})
		},
		false,
		true
	)
	cardList.value = []
	try {
		readLoading.value = true
		await getCardList(false)
		readLoading.value = false
		// initCardPreview() 刷新暂时不打开默认的
	} catch (error) {
		console.log(error)
		readLoading.value = false
	}
}
const handleSearch = async (search) => {
	cardParams.value.page = 1
	if (search) {
		cardParams.value.card_title = search?.title
		cardParams.value.project_name = search?.project_name
	}
	cardParams.value.robot_open_id = props?.activeStatus?.robot
	cardList.value = []
	if (form.value?.date && form.value?.date?.length > 0) {
		cardParams.value.start_operation_date = form.value.date[0]
		cardParams.value.end_operation_date = form.value.date[1]
	} else {
		cardParams.value.start_operation_date = ''
		cardParams.value.end_operation_date = ''
	}
	try {
		readLoading.value = true
		await getCardList()
		readLoading.value = false
	} catch (error) {
		console.log(error)
		readLoading.value = false
	}
}
// 清空二级条件
const resetFilter = () => {
	cardParams.value.start_operation_date = ''
	cardParams.value.end_operation_date = ''
	cardParams.value.warn_lv = ''
	cardParams.value.send_type = ''
	form.value.shotActive = ''
	form.value.date = []
	filterRef.value?.handleResetValue()
}
watch(
	() => props.activeStatus,
	(val) => {
		cardParams.value.page = 1
		cardList.value = []
		eventStatus.value = val
		resolveParams(val)
		if (msgType.value == 1) {
			cardParams.value.robot_open_id = val?.robot
			if (val?.robot) {
				activeTitle.value = '全部通知'
			}
			resetFilter()
			// filterRef.value?.handleSubmit()
		}
		getCardList()
	},
	{
		deep: true
	}
)
// 打开对应卡片评论方法
const handleCommen = async (id, type) => {
	console.log(111, id, type)
	try {
		const res = await getCardList(true, id, type)
		console.log(735, res)

		if (res?.length > 0) {
			cardList.value = res
			cardInfo.value.row = res[0]
			// cardInfo.value.visible = true
			nextTick(() => {
				cardInfo.value.commentStatus = true
			})
		}
	} catch (error) {
		console.log(error)
	}
}
// 刷新默认打开第一个
const initCardPreview = () => {
	if (cardList.value?.length > 0) {
		handleClickCard(cardList.value[0], true)
	}
}
// 监听窗口缩放调整布局
const setResize = debounce(() => {
	const docWidth = document.body.clientWidth
	if (docWidth <= 1310) {
		resizeConf.size = 405
	} else {
		resizeConf.size = docWidth - 900
	}
}, 300)
onMounted(() => {
	setResize()
	window.addEventListener('resize', setResize)
})
onUnmounted(() => {
	window.removeEventListener('resize')
})
defineExpose({
	timeFresh,
	handleRefresh,
	handleSearch,
	handleCommen,
	readLoading
})
</script>

<style scoped lang="scss">
.card-flex {
	border-top: 1px solid var(--boke-color-border-divider);
	display: flex;
	.card-list-flex {
		width: 100%;
	}
	.handler {
		cursor: ew-resize;
		width: 9px;
		height: calc(100vh - 174px);

		box-sizing: border-box;
		position: relative;
		.move-icon {
			position: absolute;
			top: 40%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		&::after {
			content: '';
			width: 1px;
			height: 100%;
			background-color: var(--boke-color-border-divider);
			position: absolute;
			left: 4px;
		}
	}
	.card-preview {
		flex: 1;
		height: calc(100vh - 174px);
	}
	.email-preview {
		flex: 1;
		height: calc(100vh - 174px);
		padding: 10px;
		overflow: auto;
	}
}
.card-content {
	padding-right: 10px;
	.content-title {
		padding: 8px 16px;
	}
	.list-height {
		height: calc(100vh - 174px);
	}
	.card-list {
		overflow-x: hidden;
		height: 100%;
		padding-right: 10px;
		:deep(.el-backtop) {
			position: absolute;
		}
		.card-item {
			padding: 9px;
			border-bottom: 1px solid var(--boke-color-border-divider);
			position: relative;
			min-height: 40px;
			cursor: pointer;
			.robot-img {
				width: 32px;
				height: auto;
				margin-bottom: 6px;
			}
			.item-robot {
				text-align: center;
				padding-right: 4px;
				width: 80px;
				text-align: center;
				flex: 0 0 80px;
				overflow: hidden;
				white-space: nowrap;
			}
			.send-time {
				position: absolute;
				right: 5px;
				bottom: 3px;
				font-size: 12px;
				color: var(--boke-color-text-describe);
				line-height: 14px;
				.time {
					line-height: 14px;
				}
			}
			.group-info {
				position: absolute;
				left: 92px;
				bottom: 0px;
				font-size: 12px;
				color: var(--boke-color-text-describe);
			}
			.item-content {
				width: calc(100% - 120px);
				// flex: 1 1 auto;
				height: 55px;
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
				.item-des {
					// margin-top: 4px;
					line-height: 16px;
					width: calc(100% - 0px);
					display: inline-block;
					overflow: hidden;
					white-space: normal;
					text-overflow: ellipsis;
					display: -webkit-box;
					line-clamp: 1;
					-webkit-line-clamp: 1;
					overflow: hidden;
					word-break: break-all;
					/*! autoprefixer: off */
					-webkit-box-orient: vertical;
				}
			}
			.item-content-mail {
				width: calc(100% - 80px);
			}
			.item-handle {
				// flex: 0 0 150px;
				margin-left: auto;
				text-align: right;
			}

			.unread {
				background: var(--boke-color-fail);
				position: absolute;
				left: 8px;
				top: 4px;
				display: inline-block;
				width: 10px;
				height: 10px;
				border-radius: 50%;
				&.igno {
					background: var(--boke-color-text-disable);
				}
			}
			&.read {
				background-color: rgba(0, 0, 0, 0.02);
			}
			&.warn {
				background: #fef7e9;
			}
			&.error {
				background: rgba(254, 227, 226, 0.7);
			}
			&:hover {
				background: var(--boke-bg-nav-first);
			}
			&.active {
				background: var(--boke-table-current-row-bg-color);
			}
		}
		.dark {
			&.warn {
				background: #362501;
			}
			&.error {
				background: rgba(79, 5, 2, 0.7);
			}
			&:hover {
				background: var(--boke-bg-nav-first);
			}
			&.active {
				background: var(--boke-table-current-row-bg-color);
			}
		}
	}
}
.copy-title {
	padding-left: 5px;
}
.item-content-mail {
	.copy-title {
		padding-left: 10px;
	}
}
.loading-text {
	font-size: 16px;
	line-height: 36px;
	text-align: center;
	color: var(--boke-color-text-content);
}
.pointer {
	&:hover {
		color: var(--boke-color-main);
	}
}
.active {
	color: var(--boke-color-main);
}
.triangle-normal {
	width: 0;
	height: 0;
	border-left: 52px solid transparent;
	border-right: 0px solid transparent;
	border-top: 26px solid #ddd; /* 控制三角形的颜色 */
	position: absolute;
	right: 0;
	top: 0;
	text-align: center;
	& .text {
		position: absolute;
		top: -26px;
		right: 4px;
		font-size: 12px;
		color: #666;
	}
}
.triangle-warn {
	border-top: 26px solid var(--boke-color-warning); /* 控制三角形的颜色 */
	& .text {
		color: #fff;
	}
}
.triangle-fail {
	border-top: 26px solid red; /* 控制三角形的颜色 */
	& .text {
		color: #fff;
	}
}
.refresh-btn {
	border: 1px solid var(--boke-color-border-divider);
	width: 18px;
	border-radius: 4px;
	i {
		color: var(--boke-color-main);
	}
}
</style>
