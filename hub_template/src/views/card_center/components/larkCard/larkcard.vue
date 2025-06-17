<template>
	<LarkCard
		v-if="showCard"
		:row="cardInfo"
		:feishu_user_id="userStore.userInfo?.union_id"
		:showComment="false"
	></LarkCard>
</template>

<script setup>
import { useUserStore } from '@/stores'
import LarkCard from '@/views/card_center/components/larkCard/index.vue'
const userStore = useUserStore()
const cardInfo = ref()
const showCard = ref(false)
provide('listRow', cardInfo.value)
function isJSON(str) {
	try {
		JSON.parse(str)
		return true
	} catch (e) {
		return false
	}
}
onMounted(() => {
	window.parent.postMessage(JSON.stringify({ done: true }), '*')
	// window.parent.postMessage("ok", "*")
	window.addEventListener('message', function (e) {
		try {
			if (!e.data) {
				showCard.value = true
				return (cardInfo.value = {})
			}
			if (isJSON(e.data)) {
				let data = JSON.parse(e.data)
				if (Object.keys(data)?.length > 0) {
					cardInfo.value = {
						...data,
						robot_open_id: data?.open_id || data?.robot_open_id
					}
					showCard.value = true
				}
			}
		} catch (error) {
			console.log(222, error)
		}
	})
})
</script>

<style scoped lang="scss"></style>
