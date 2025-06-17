<template>
	<div class="rank-list-component">
		<slot name="header"></slot>
		<div class="rank-list">
			<el-row justify="space-between" class="rank-list-head" :class="{ 'head-scroll': scroll }">
				<el-col :span="3" v-if="showSort" class="center">排序</el-col>
				<el-col :span="showSort ? 21 : 24">
					<el-row>
						<el-col v-for="item in columns" :key="item.prop" :span="item.width" :style="setStyle(item.prop)">{{ item.label }}</el-col>
					</el-row>
				</el-col>
			</el-row>
			<template v-if="lists.length">
				<div :class="{ 'list-scroll': scroll }">
					<el-row
						justify="space-between"
						class="rank-list-row"
						:class="{ active: selectId === i }"
						v-for="(item, i) in lists"
						:key="i"
						@click="selectRow(item, i)"
					>
						<el-col :span="3" v-if="showSort">
							<span class="sort-icon">{{ i + 1 }}</span>
						</el-col>
						<el-col :span="showSort ? 21 : 24">
							<el-row :gutter="4">
								<el-col v-for="el in columnsMap" :span="setWith(el)" :style="setStyle(el)" :key="el">
									<p v-if="slots[el]" class="line-height-22">
										<slot :name="el" :text="item[el]" :row="item"></slot>
									</p>
									<el-tooltip v-else :show-after="600" class="box-item" effect="dark" :content="item[el] + ''" placement="top">
										<span class="rank-list-col line-height-22">
											{{ item[el] }}
										</span>
									</el-tooltip>
								</el-col>
							</el-row>
						</el-col>
						<div class="select-icon" v-if="selectId === i && showSelect">
							<el-icon><DArrowRight /></el-icon>
							<el-icon style="margin-left: -8px"><DArrowRight /></el-icon>
						</div>
					</el-row>
				</div>
			</template>
			<el-empty v-else description="暂无数据" />
		</div>
	</div>
</template>
<script setup>
import { DArrowRight } from '@element-plus/icons-vue'
import { computed, ref, useSlots, watch } from 'vue'
const props = defineProps({
	showSort: {
		type: Boolean,
		default: true
	},
	columns: {
		type: Array,
		default: () => []
	},
	lists: {
		type: Array,
		default: () => []
	},
	active: {
		type: Number,
		default: 0
	},
	showSelect: {
		type: Boolean,
		default: false
	},
	scroll: {
		type: Boolean,
		default: false
	}
})
const emits = defineEmits(['select', 'update:active'])
// 当前组件所有的slot
const slots = useSlots()
const selectId = ref(props.active)
const columnsMap = computed(() => {
	return props?.columns.map((item) => item.prop)
})
const selectRow = (row, i, type) => {
	selectId.value = i
	emits('update:active', i)
	if (type) return
	emits('select', row, i)
}
const setWith = (prop) => {
	return props?.columns?.filter((el) => el.prop === prop)[0]?.width
}
const setStyle = (prop) => {
	const item = props?.columns?.filter((el) => el.prop === prop)[0]
	return {
		'text-align': item.align || 'center'
	}
}
watch(
	() => props.active,
	() => {
		selectRow(props.lists[props.active], props.active, 'watch')
	}
)
</script>
<style scoped lang="scss">
.rank-list-component {
	padding: 0px 12px 0px 12px;
	height: 100%;
	.rank-list {
		margin-top: 14px;
		width: 100%;
		height: 100%;
		.rank-list-head {
			line-height: 22px;
			font-size: 14px;
			font-weight: 600;
			color: var(--boke-color-text-title);
			margin-bottom: 6px;
			.center {
				text-align: center;
			}
		}
		.rank-list-row {
			position: relative;
			margin-bottom: 0;
			height: 30px;
			padding: 0 4px;
			&:nth-child(even) {
				background: var(--boke-table-small-bg);
			}
			&:hover {
				background: var(--boke-table-current-row-bg-color);
				cursor: pointer;
			}
			&.active {
				background: var(--boke-table-current-row-bg-color);
			}
			.sort-icon {
				display: block;
				width: 20px;
				height: 20px;
				border-radius: 10px;
				color: var(--boke-color-main);
				font-size: 12px;
				line-height: 20px;
				text-align: center;
				text-align: center;
				margin: 0 auto;
				margin-top: 4px;
			}
			.select-icon {
				position: absolute;
				top: 50%;
				right: -32px;
				transform: translateY(-50%);
				font-size: 16px;
				line-height: 14px;
				color: var(--boke-color-main);
			}
			.rank-list-col {
				font-size: 13px;
				padding: 4px 0;
				color: var(--el-text-color-primary);
				display: block;
				line-height: 22px;
				// max-width: 150px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.line-height-22 {
				line-height: 22px;
				padding: 4px 0;
			}
		}
	}
	.list-scroll {
		height: calc(100% - 24px);
		overflow-y: auto;
		overflow-x: hidden;
	}
	.head-scroll {
		padding-right: 8px;
	}
}
</style>
