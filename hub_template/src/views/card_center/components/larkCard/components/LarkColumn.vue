<template>
	<el-row class="lark-row" :class="{ grey: detail?.background_style == 'grey' }">
		<el-col
			v-for="(item, index) in info"
			:span="(24 / colLength) * item?.weight"
			:key="index"
			class="lark-col"
			:class="{ grey: item?.background_style == 'grey' }"
		>
			<larkComponents :info="item?.elements"></larkComponents>
		</el-col>
	</el-row>
</template>
<script setup>
import larkComponents from './LarkComponents.vue'
import { toRefs, computed } from 'vue'
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
const { info, detail } = toRefs(props)
const colLength = computed(() => {
	let count = 0
	info.value?.forEach((item) => {
		count += item?.weight
	})
	return count
})
</script>
<style scoped lang="scss">
.lark-row {
	width: 100%;
	// background-color: rgb(245, 246, 247);
	border-radius: 6px;
	// padding: 4px;
	margin: 6px 0;
	box-sizing: border-box;
	align-items: baseline;
	height: auto;
	flex-grow: 0;
	&.grey,
	.grey {
		background-color: rgb(245, 246, 247);
	}
	.lark-col {
		margin: 0;
		flex-grow: 0;
		display: flex;
		align-items: center;
		height: auto;
	}
}
</style>
