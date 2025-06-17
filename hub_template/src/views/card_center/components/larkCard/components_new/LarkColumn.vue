<template>
	<el-row class="lark-row" :class="{ grey: detail?.background_style == 'grey' }">
		<template v-for="(item, index) in info" :key="index">
			<el-col
				v-if="item?.elements?.length > 0"
				class="lark-col"
				:span="!item?.weight || item?.weight == 'auto' ? '' : parseInt((24 / colLength) * item?.weight || 6)"
				:class="{ grey: item?.background_style == 'grey' }"
				:style="{ width: item?.width + 'px', marginRight: !item?.weight ? '10px' : '0' }"
			>
				<larkComponents :info="item?.elements" :detail="item"></larkComponents>
			</el-col>
		</template>
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
		count += item?.weight || 6
	})
	return count
})
</script>
<style scoped lang="scss">
.lark-row {
	width: 100%;
	border-radius: 6px;
	// padding: 4px;
	margin: 6px 0;
	box-sizing: border-box;
	.lark-col {
		margin: 0px 0;
	}
}
.grey {
	background-color: rgb(245, 246, 247);
}
:deep(.lark-div) {
	margin: 0;
}
</style>
