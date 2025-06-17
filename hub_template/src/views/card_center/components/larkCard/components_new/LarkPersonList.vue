<template>
	<LarkPerson :feishu_user_id="personList"></LarkPerson>
</template>

<script setup>
import LarkPerson from '@/views/card_center/components/larkCard/components_new/LarkPerson.vue'
const props = defineProps({
	info: {
		type: Object,
		default: () => ({})
	},
	detail: {
		type: Object,
		default: () => ({})
	}
})
const personList = computed(() => {
	console.log(props.info?.persons)
	return props.info?.persons?.map((item) => {
		return item?.id
	})
})
</script>
