// import { useMessageCenter } from "@/stores"
export const useLark = () => {
	// const { setCommentVisible } = useMessageCenter()
	const commentVisible = ref(false)
	const clickEvent = (item) => {
		// 评论逻辑特殊处理
		// if (item?.text?.content == "评论") {
		// 	setCommentVisible(true)
		// 	return
		// }
		if (item?.multi_url) {
			if (item?.multi_url?.pc_url) {
				window.open(item?.multi_url?.pc_url, '_blank')
			} else {
				window.open(item?.multi_url?.url, '_blank')
			}
		}
		if (item?.url) {
			window.open(item?.url, '_blank')
		}
	}
	const getDisabled = (item) => {
		// 任务历史卡片不允许点击
		if (
			(item?.multi_url || item?.url || item?.multi_url?.url) &&
			item?.text?.content != '任务历史卡片' &&
			item?.text?.content != '评论'
		) {
			return false
		}
		return true
	}
	return {
		commentVisible,
		clickEvent,
		getDisabled
	}
}
