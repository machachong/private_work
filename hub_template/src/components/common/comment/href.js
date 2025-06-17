import { ref, watch } from 'vue'
import { checkUrl, message } from '@/utils/tools'

export const useHref = (callback = () => {}) => {
	const hrefPopover = ref(false)

	const hrefForm = ref({
		name: '',
		link: ''
	})

	const onHrefClose = () => {
		hrefForm.value = {
			name: '',
			link: ''
		}
		hrefPopover.value?.hide?.()
	}

	const onHrefAdd = () => {
		if (!hrefForm.value.link) {
			return onHrefClose()
		}
		if (!checkUrl(hrefForm.value.link)) {
			message.error('链接非法')
			return
		}
		const html = `<a contenteditable="false" href="${hrefForm.value.link}" target="_blank" >${hrefForm.value.name || hrefForm.value.link}</a>`
		callback(html)
		onHrefClose()
		return
	}

	// 处理超链接的粘贴事件
	const onHrefPaste = (domRef, callback) => {
		const add = () => {
			domRef.value?.addEventListener('paste', (event) => {
				const clipdata = event.clipboardData || window.clipboardData
				const content = clipdata.getData('text/plain')
				if (content && checkUrl(content)) {
					event.preventDefault()
					const html = `<a contenteditable="false" href="${content}" target="_blank" >${content}</a>`
					callback(html, content)
				}
			})
		}
		add()

		watch(
			() => domRef.value,
			() => {
				add()
			},
			{
				deep: true
			}
		)
	}

	return { hrefPopover, hrefForm, onHrefClose, onHrefAdd, onHrefPaste }
}
