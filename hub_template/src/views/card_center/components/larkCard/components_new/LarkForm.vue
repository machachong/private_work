<template>
	<div v-for="(item, index) in formColumns" :key="index">
		<LarkColumn v-if="isPreline(item)" :info="item?.columns" :detail="item"></LarkColumn>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import LarkColumn from './LarkColumn.vue'
const props = defineProps({
	info: {
		type: Object,
		default: () => {
			return {}
		}
	}
})
const formColumns = computed(() => {
	return props.info?.elements
})
// 特殊处理斌哥在模板form组件中使用“/n”换行的情况
const isPreline = (item) => {
	if (
		item?.columns?.length == 1 &&
		item?.columns[0]?.elements?.length == 1 &&
		item?.columns[0]?.elements[0]?.columns?.length == 1 &&
		item?.columns[0]?.elements[0]?.columns[0]?.elements?.length == 1 &&
		item?.columns[0]?.elements[0]?.columns[0]?.elements[0]?.text?.content == '\n'
	) {
		return false
	}
	return true
}
</script>

<style scoped lang="scss"></style>
