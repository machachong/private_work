import { ref, nextTick } from 'vue'
import { message, confirm } from '@/utils/tools'
import {
	getCommenListApi,
	addCommenApi,
	delCommenApi
} from '@/views/card_center/components/larkCard/service/card_template_api'

export const useComment = (handleClear, message_hash) => {
	const commentRef = ref(null)

	// 滚动容器
	const scrollRef = ref(null)
	// 回复列表容器
	const listRef = ref(null)

	const datas = ref([])

	const total = ref(0)

	const loading = ref(false)
	const list_loading = ref(false)
	const getDatas = () => {
		return new Promise((resolve, reject) => {
			list_loading.value = true

			getCommenListApi({
				message_hash: message_hash.value
			})
				.then(({ items }) => {
					list_loading.value = false
					datas.value = items
					total.value = items?.length || 0
					resolve()
				})
				.catch((err) => {
					console.log(err)
					list_loading.value = false
					reject()
				})
		})
	}

	const content = ref('')

	const adding = ref(false)

	// 滚动到列表的位置
	const scrollToList = () => {
		const y = listRef.value?.offsetTop
		if (y) {
			scrollRef.value?.scrollTo({
				top: y,
				left: 0,
				behavior: 'smooth'
			})
		}
	}

	const handleCommentSubmit = (params) => {
		addCommenApi(params)
			.then(() => {
				message.success('发送成功')
				getDatas().then(() => {
					scrollToList()
				})
				handleClear()
			})
			.catch(() => {})
	}

	const onReply = (val) => {
		content.value += val
		nextTick(() => {
			setTimeout(() => {
				commentRef.value?.focus?.(true)
			}, 50)
		})
	}

	const handleCommentDel = async (id) => {
		try {
			await confirm('确定删除吗？')
			await delCommenApi({ id })
			message.success('删除成功')
			getDatas()
		} catch (error) {
			console.log(error)
		}
	}

	const userOptions = ref([])

	return {
		commentRef,
		scrollRef,
		listRef,
		content,
		adding,
		handleCommentSubmit,
		datas,
		loading,
		list_loading,
		total,
		getDatas,
		onReply,
		handleCommentDel,
		userOptions
	}
}
