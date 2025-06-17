<template>
	<div class="boke-list-item" :class="{ disabled: disabled, 'label-top': labelPosition === 'top' }" ref="listItemRef">
		<p :style="{ width: labelWidth }" class="item-title">
			<slot name="label" v-if="$slots[label]"></slot>
			<template v-else> {{ label }}: </template>
		</p>
		<p class="item-content" :style="{ maxHeight: maxHeight }">
			<slot></slot>
		</p>
	</div>
</template>

<script setup>
defineProps({
	labelWidth: {
		type: String,
		default: "100px"
	},
	label: {
		type: String,
		default: ""
	},
	disabled: {
		type: Boolean,
		default: false
	},
	labelPosition: {
		type: String,
		default: "left"
	},
	maxHeight: {
		type: String,
		default: "auto"
	}
})
const listItemRef = ref()
</script>

<style scoped lang="scss">
.boke-list-item {
	display: flex;
	gap: 10px;
	width: 100%;
	padding-right: 24px;
	box-sizing: border-box;
	margin-bottom: 16px;
	.item-title {
		font-size: 14px;
		line-height: 24px;
		padding: 4px;
		text-align: right;
		color: var(--boke-color-text-title);
	}
	.item-content {
		font-size: 14px;
		flex: 1;
		line-height: 24px;
		min-height: 24px;
		padding: 4px 8px;
		color: var(--boke-color-text-content);
		background: var(--boke-bg-input);
		word-break: break-all;
		white-space: pre-line;
		:deep(.el-textarea__inner) {
			background: none;
			box-shadow: none;
			padding: 0;
		}
	}
	&.label-top {
		flex-direction: column;
		.item-title {
			text-align: left;
			padding-bottom: 0;
		}
	}
	&.disabled {
		.item-content {
			color: var(--boke-color-text-disable);
		}
	}
}
</style>
