<template>
	<div class="table-handle">
		<div>
			已选中<span class="select-num">{{ num }}</span
			>项
		</div>
		<slot name="handle"></slot>
	</div>
</template>

<script>
export default {
	props: {
		num: {
			type: Number,
			default: 0
		}
	},
	setup(props) {
		return {
			props
		}
	}
}
</script>

<style scoped lang="scss">
.table-handle {
	margin-top: 10px;
	margin-bottom: 16px;
	background-color: var(--boke-table-current-row-bg-color);
	padding: 10px 10px 10px 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.select-num {
		color: var(--boke-color-open);
		padding: 0 2px;
	}
}
</style>
