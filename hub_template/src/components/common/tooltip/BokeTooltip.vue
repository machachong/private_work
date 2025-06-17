<template>
	<el-tooltip
		class="boke-tooltip"
		:show-after="200"
		:effect="effect"
		:content="content + ''"
		placement="top-start"
		v-bind="$attrs"
	>
		<div class="boke-tip-content" v-if="isHtml" v-html="content"></div>
		<div class="boke-tip-content" v-else>{{ content }}</div>
	</el-tooltip>
</template>

<script setup lang="ts">
defineProps({
	content: {
		type: [String, Number],
		required: true
	},
	placement: {
		type: String,
		default: 'top'
	},
	effect: {
		type: String,
		default: 'dark'
	},
	isHtml: {
		type: Boolean,
		deafult: false
	}
})
</script>
<style scoped lang="scss">
.boke-tooltip {
	width: 100%;
	height: 100%;
}
.boke-tip-content {
	width: 100%;
	padding: 0 12px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
