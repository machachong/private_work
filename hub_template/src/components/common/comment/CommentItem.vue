<template>
	<div class="comment-item-container">
		<div class="left">
			<el-avatar
				:size="32"
				:src="comment.header_img_url || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
			/>
		</div>
		<div class="right">
			<div class="div-inline-between">
				<el-space>
					<div class="comment-user">
						{{ comment.user_name || '未知用户' }}
					</div>
					<div class="my-info timestamp">
						{{ formatTimestamp(comment.create_time) }}
					</div>
				</el-space>
			</div>

			<div class="div-inline" style="margin-top: 8px">
				<div class="comment-content" v-html="comment.comment_info"></div>
				<div>
					<span v-if="canReply" style="margin-left: 8px; cursor: pointer" class="reply my-info" @click="onReply">
						回复
					</span>
					<span
						v-if="canDelete"
						style="margin-left: 8px; cursor: pointer"
						class="reply my-info"
						@click="handleCommentDel"
					>
						删除
					</span>
				</div>
			</div>
		</div>
		<my-confirm v-model:dialogFormVisible="showDelete" title="删除" @submited="onDelete">
			<template v-slot:content>
				<p class="my-confirm-content">
					<el-icon class="my-danger" :size="16"><WarningFilled /></el-icon>
					确定删除吗?
				</p>
			</template>
		</my-confirm>
	</div>
</template>

<script>
import { computed, ref, defineComponent, onMounted } from 'vue'
import { useUserStore } from '@/stores'
import { formatTimestamp } from '@/utils/tools'

export default defineComponent({
	name: 'CommentItem',
	props: {
		comment: {
			type: Object,
			default() {
				return {}
			}
		}
	},
	emits: ['reply', 'delete'],
	setup(props, ctx) {
		const { userInfo, getUserInfo } = useUserStore()
		const canReply = computed(() => {
			return props.comment.user_id && props.comment.user_id !== userInfo?.id
		})

		const canDelete = computed(() => {
			console.log(props.comment.user_id, userInfo?.id)

			return props.comment.user_id === userInfo?.id
		})

		const replyContent = computed(() => {
			return `<span contenteditable="false" class="color-main" data-id="${props.comment.feishu_user_id}">@${props.comment.user_name} </span>`
		})

		const onReply = () => {
			ctx.emit('reply', replyContent.value)
		}

		const showDelete = ref(false)

		const handleCommentDel = () => {
			console.log(props.comment)

			ctx.emit('delete', props.comment?.id)
		}

		onMounted(() => {
			getUserInfo()
		})

		return {
			canReply,
			canDelete,
			onReply,
			showDelete,
			handleCommentDel,
			formatTimestamp
		}
	}
})
</script>

<style scoped lang="scss">
.comment-item-container {
	width: 100%;
	box-sizing: border-box;
	padding: 0 12px 0 8px;
	display: flex;
	flex-flow: row nowrap;
	gap: 8px;
	min-height: 64px;

	.right {
		flex: 1;
		overflow: hidden;
	}

	&:not(:last-child) {
		margin-bottom: 16px;
	}

	.comment-user {
		max-width: 300px;
	}

	.reply {
		font-size: 12px;
		color: var(--boke-color-text-describe);
		&:hover {
			color: var(--boke-color-fail);
		}
	}

	.timestamp {
		font-size: 12px;
	}

	.comment-content {
		flex: 1;
		overflow: hidden;
		white-space: pre-line;
	}
	:deep(a) {
		color: var(--boke-color-main);
	}
}
.div-inline {
	display: flex;
	flex-flow: row nowrap;
}
</style>
