<template>
	<el-card
		shadow="always"
		class="boke-card"
		:class="{
			'box-card-dark': isDark,
			'is-full': isFull,
			border: border,
			'no-padding': noPadding
		}"
	>
		<template #header v-if="$slots['header']">
			<slot name="header"></slot>
		</template>
		<template #default>
			<slot></slot>
		</template>
	</el-card>
</template>

<script setup>
import { isDark } from "@/composables"
defineProps({
	isFull: {
		type: Boolean,
		default: false
	},
	border: {
		type: Boolean,
		default: false
	},
	noPadding: {
		type: Boolean,
		default: false
	}
})
</script>
<style lang="scss" scoped>
.boke-card {
	border: none;
	border-radius: 8px;
	background-color: var(--boke-card-bg);
	// height: 100%;
	box-sizing: border-box;
	&.box-card-dark {
		border: 1px solid var(--boke-color-main);
		box-shadow: 0px 4px 4px 0px rgba(41, 112, 255, 0.09) inset;
	}
	&.border {
		border: 1px solid var(--boke-color-border-divider);
		padding: 20px 30px;
		box-sizing: border-box;
		border-radius: 10px;
		box-shadow: 0px 0px 5px rgb(0 0 0 / 5%);
		overflow: hidden;
	}
	&.is-full {
		overflow-y: auto;
		width: 100%;
		height: 100%;
		:deep(.el-card__body) {
			width: 100%;
			height: 100%;
			box-sizing: border-box;
		}
	}
	.el-card__body {
		margin-top: 16px;
	}
	.el-card__header {
		padding-bottom: 0;
	}
}
.no-padding {
	:deep(.el-card__body) {
		padding: 0 10px;
	}
}
</style>
