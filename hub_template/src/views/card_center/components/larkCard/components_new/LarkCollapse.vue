<template>
	<el-collapse :model-value="activeCollapse">
		<el-collapse-item name="1">
			<template #title>
				<BokeMd :text="detail?.header?.title?.content"></BokeMd>
			</template>
			<div v-for="(item, index) in detail?.elements" :key="index">
				<BokeMd :text="item?.content"></BokeMd>
			</div>
		</el-collapse-item>
	</el-collapse>
</template>
<script setup>
import { toRefs } from 'vue'
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
const { detail } = toRefs(props)
const activeCollapse = computed(() => {
	if (props.detail.expanded) {
		return ['1']
	}
	return []
})
</script>
<style scoped lang="scss">
:deep(.el-collapse-item__content) {
	padding-bottom: 0;
}
:deep(.el-collapse-item__wrap) {
	border: none;
}
</style>
