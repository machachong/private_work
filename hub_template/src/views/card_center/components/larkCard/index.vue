<template>
	<!-- <boke-dialog
		:model-value="visible"
		title="飞书卡片预览"
		:width="total > 0 ? '1200px' : '660px'"
		top="10px"
		destroy-on-close
		align-center
		@open="handleOpen"
		@close="handleClose"
	> -->
	<section class="card-con">
		<div class="card-left">
			<TemplateCard :row="row" v-if="showTemplateCard" @click.prevent="commentVisible = false"></TemplateCard>
			<Card :row="row" v-else @click.prevent="commentVisible = false"></Card>
			<div class="m-t-10" style="text-align: right; padding-right: 10px" v-if="showComment">
				<boke-button @click="handleOpenComment" type="primary">
					<el-space :size="2">
						<i class="iconfont icon-pinglun"></i>
						评论
						<span v-if="row?.comment_num > 0">{{ row?.comment_num }}</span>
					</el-space>
				</boke-button>
			</div>
		</div>
		<div class="comment-right" v-if="commentVisible">
			<!-- v-if="props.row?.message_id" -->
			<!-- v-if="total > 0 && props.row?.message_id" -->
			<div class="comment-info" v-if="props.row?.message_hash">
				<CommentInput
					class="detail-comment"
					ref="commentRef"
					v-model="content"
					html
					canAt
					:user-options="commentUserList"
					:submitLoading="loading"
					placeholder="按ctrl+回车换行，按回车快速发布，支持@相关用户"
					@submited="
						handleCommentSubmit({
							message_hash: props.row?.message_hash,
							feishu_user_id: props.feishu_user_id,
							comment_info: content
						})
					"
					@cancle="handleClear"
				></CommentInput>
			</div>
			<div class="comment-list" id="comment-area778" ref="listRef" v-loading="list_loading">
				<el-collapse :model-value="['1']" @change="handleChange" v-if="total > 0 && props.row?.message_hash">
					<el-collapse-item title="Consistency" name="1">
						<template #title>
							<div class="subtitle">全部评论({{ total }})</div>
						</template>
						<comment-item
							v-for="data in datas"
							:key="data.id"
							:comment="data"
							@reply="onReply"
							@delete="handleCommentDel"
						></comment-item>
					</el-collapse-item>
				</el-collapse>
			</div>
		</div>
	</section>
	<!-- </boke-dialog> -->
</template>

<script setup>
import { useComment } from './hook/comment'
import Card from './Card.vue'
import TemplateCard from './TemplateCard.vue'
import { getCommenUserApi } from './service/card_template_api'
import CommentInput from '@/views/card_center/components/comment/CommentInput.vue'
import CommentItem from '@/views/card_center/components/comment/CommentItem.vue'
const props = defineProps({
	visible: {
		type: Boolean,
		default: false
	},
	row: {
		type: Object,
		default: () => {
			return {}
		}
	},
	feishu_user_id: {
		type: String,
		default: ''
	},
	showComment: {
		type: Boolean,
		default: true
	},
	commentStatus: {
		type: Boolean,
		default: false
	}
})
const emits = defineEmits(['openComment'])

const message_hash = ref()
const handleClear = () => {
	content.value = ''
}
const {
	commentRef,
	// scrollRef,
	listRef,
	content,
	handleCommentSubmit,
	datas,
	loading,
	list_loading,
	total,
	getDatas,
	onReply,
	handleCommentDel
} = useComment(handleClear, message_hash)
// const messageCenterStore = useMessageCenter()
// const {commentVisible }  = storeToRefs(messageCenterStore)
const commentUserList = ref()
const showTemplateCard = computed(() => {
	if (!props.row || !props.row?.card_body) {
		return false
	}
	console.log(props.row)
	const row = JSON.parse(props.row?.card_body)
	if (row?.data) {
		return row?.type == 'template'
	} else {
		return false
	}
})
const handleOpen = () => {
	if (!props.row?.message_hash) {
		return
	}
	message_hash.value = props.row?.message_hash
	if (props.row?.comment_num > 0) {
		getDatas()
	} else {
		datas.value = []
		total.value = 0
	}
	getCommentUser()
}
// const handleClose = () => {
// 	handleClear()
// 	messageCenterStore.setCommentVisible(false)
// }
const getCommentUser = async () => {
	const { message_hash, robot_open_id } = props.row
	if (!message_hash) return
	const res = await getCommenUserApi({
		message_hash,
		robot_open_id
	})
	commentUserList.value = res?.items?.map((item) => {
		return {
			...item,
			value: item?.user_id,
			label: item?.user_name
		}
	})
}
const commentVisible = ref(false)
// 打开评论
const handleOpenComment = () => {
	commentVisible.value = !commentVisible.value
	emits('openComment')
	handleOpen()
}
watch(
	() => props.commentStatus,
	() => {
		console.log('props.commentStatus', props.commentStatus)
		if (props.commentStatus) {
			commentVisible.value = true
			handleOpen()
		} else {
			commentVisible.value = false
		}
	},
	{
		immediate: true
	}
)
// watch(
// 	() => props.row?.id,
// 	() => {
// 		// commentVisible.value = false
// 		// handleOpen()
// 	},
// 	{
// 		deep: true,
// 		immediate: true
// 	}
// )
defineExpose({
	handleOpenComment
})
</script>

<style scoped lang="scss">
// .max-height {
// 	max-height: calc(100vh - 120px);
// 	min-height: 500px;
// 	overflow-y: auto;
// }
.detail-comment {
	// border-top: 1px solid var(--boke-color-border-divider);
	min-height: 150px;
	box-sizing: border-box;
	padding: 12px;
	background-color: #fff;
	margin-top: 12px;
}
.comment-list {
	padding: 0 6px;
	min-height: 100px;
	.subtitle {
		font-size: 12px;
		color: var(--my-info);
	}
}
:deep(.el-collapse) {
	border: none;
}
.card-con {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	.card-left {
		width: 640px;
		padding-top: 10px;
	}
	.comment-right {
		flex: 1;
		max-width: 640px;
		min-width: 300px;
	}
}
</style>
