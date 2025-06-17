<template>
	<el-timeline mode="horizontal" class="boke-timeline" :class="{ direction: direction == 'row' }">
		<el-timeline-item
			class="timeline-item"
			v-for="(item, index) in list"
			:key="index"
			:style="{ width: getWidth(list?.length) }"
			:class="{
				'color-start': item.status == 0,
				'color-pendding': item.status == 1,
				'color-end': ![0, 1].includes(item.status)
			}"
		>
			<slot name="content" :item="item"></slot>
		</el-timeline-item>
	</el-timeline>
</template>
<script setup>
const props = defineProps({
	list: {
		type: Array,
		required: true
	},
	direction: {
		type: String,
		default: 'column' // row,column
	}
})
const getWidth = (length) => {
	if (props.direction == 'column') {
		return '100%'
	}
	const width = 100 / (length - 1)
	if (width <= 18) {
		return '18%'
	}
	return `${width}%`
}
</script>
<style lang="scss" scoped>
.boke-timeline {
	&.direction {
		padding: 45px 50px 50px 100px;
		display: flex;
		.timeline-item {
			transform: translateX(0%);
			width: 25%;
			min-width: 280px;
			&:last-child {
				width: 160px !important;
				min-width: 160px !important;
			}
		}
		.color-start {
			:deep(.el-timeline-item__node) {
				background-color: var(--boke-color-text-disable);
				border-color: var(--boke-color-text-disable);
			}
		}
		.color-pendding {
			:deep(.el-timeline-item__node) {
				background-color: var(--boke-color-main);
				border-color: var(--boke-color-main);
			}
			:deep(.el-timeline-item__tail) {
				border-color: var(--boke-color-main);
				opacity: 0.3;
			}
		}
		.color-end {
			:deep(.el-timeline-item__node) {
				background-color: var(--boke-color-success);
				border-color: var(--boke-color-success);
			}
			:deep(.el-timeline-item__tail) {
				border-color: var(--boke-color-success);
				opacity: 0.3;
			}
		}
		:deep(.el-timeline-item__tail) {
			border-left: none;
			border-top: 2px solid #e4e7ed;
			width: 100%;
			position: absolute;
			top: 6px;
		}
		:deep(.el-timeline-item__wrapper) {
			padding-left: 0;
			position: absolute;
			top: 20px;
			transform: translateX(-50%);
			text-align: center;
		}
		:deep(.el-timeline-item__timestamp) {
			font-size: 14px;
		}
		.active {
			:deep(.el-timeline-item__node) {
				background-color: var(--boke-color-main);
			}
			:deep(.el-timeline-item__tail) {
				border-color: var(--boke-color-main);
			}
		}
		// 有active样式的下一个li
		.active + li {
			:deep(.el-timeline-item__node) {
				background-color: var(--boke-color-text-describe);
			}
		}
	}
	.color-start {
		:deep(.el-timeline-item__node) {
			background-color: var(--boke-color-text-disable);
		}
	}
	.color-pendding {
		:deep(.el-timeline-item__node) {
			background-color: var(--boke-color-main);
		}
		:deep(.el-timeline-item__tail) {
			border-color: var(--boke-color-main);
			opacity: 0.3;
		}
	}
	.color-end {
		:deep(.el-timeline-item__node) {
			background-color: var(--boke-color-success);
		}
		:deep(.el-timeline-item__tail) {
			opacity: 0.3;
		}
	}
}
</style>
