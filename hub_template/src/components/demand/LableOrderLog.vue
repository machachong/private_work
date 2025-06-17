<template>
	<RightContainer :hashId="hashId"></RightContainer>
</template>
<script setup>
import RightContainer from './RightContainer.vue'
const props = defineProps({
	wordkflow_id: {
		type: String,
		default: ''
	}
})
const hashId = computed(() => {
	if (!props.wordkflow_id) return ''
	let newId = props.wordkflow_id?.split('/')
	return newId[newId.length - 1]
})
</script>

<style scoped lang="scss"></style>
