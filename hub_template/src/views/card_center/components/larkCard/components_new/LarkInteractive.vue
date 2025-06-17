<template>
	<div
		class="lark-interactive"
		:class="{ disabled: info?.disabled }"
		:style="{
			borderRadius: info?.corner_radius,
			width: info?.width || '100%',
			height: info?.height || 'auto',
			border: info?.has_border ? '1px solid #eee' : 'none',
			backgroundColor: '#fafafa',
			padding: '0px 8px'
		}"
	>
		<larkComponents :info="info?.elements" :row="detail"></larkComponents>
	</div>
</template>
<script setup>
import larkComponents from './LarkComponents.vue'
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
const { info } = toRefs(props)
</script>
<style scoped lang="scss">
.lark-interactive {
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
