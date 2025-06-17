import { ref, onMounted } from 'vue'

export const useCtrl = () => {
	const ctrlOn = ref(false)

	onMounted(() => {
		document.addEventListener('keydown', (e) => {
			if (e.key == 'Control') {
				ctrlOn.value = true
			}
		})
		document.addEventListener('keyup', (e) => {
			if (e.key == 'Control') {
				ctrlOn.value = false
			}
		})
	})
	return ctrlOn
}

export const useDelete = () => {
	const deleteOn = ref(false)

	let timer = null

	onMounted(() => {
		document.addEventListener('input', (e) => {
			if (e.inputType === 'deleteContentBackward') {
				deleteOn.value = true
				if (timer) {
					clearTimeout(timer)
				}
				timer = setTimeout(() => {
					deleteOn.value = false
				}, 100)
			}
		})
		document.addEventListener('keydown', (e) => {
			if (e.key == 'Backspace') {
				deleteOn.value = true
			}
		})
		document.addEventListener('keyup', (e) => {
			if (e.key == 'Backspace') {
				if (timer) {
					clearTimeout(timer)
				}
				deleteOn.value = false
			}
		})
	})
	return deleteOn
}
