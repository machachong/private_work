import { ref, watch } from 'vue'

export const useImg = () => {
	const onImgPaste = (domRef = ref(), callback = () => {}) => {
		const add = () => {
			domRef.value?.addEventListener('paste', (event) => {
				if (!event.clipboardData) {
					return
				}
				if (event.clipboardData.files.length > 0) {
					const { files } = event.clipboardData
					callback(
						Array.from(files).filter((file) => {
							return /image\/.*/.test(file.type)
						})
					)
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

	return { onImgPaste }
}
