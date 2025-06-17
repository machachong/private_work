<template>
	<el-popover
		ref="popRef"
		v-model:visible="showPopover"
		:placement="placement"
		:width="width"
		:hide-after="0"
		trigger="click"
		size="small"
		popper-class="table-header-filter"
		v-bind="$attrs"
	>
		<el-checkbox
			v-if="multiple"
			:indeterminate="isIndeterminate"
			v-model="checkAll"
			size="small"
			@change="handleCheckAllChange"
		>
			全选
		</el-checkbox>
		<div class="table-header-filter-check">
			<el-checkbox-group
				v-if="multiple"
				:model-value="modelValue"
				@change="handleCheckedChange"
				size="small"
			>
				<el-checkbox v-for="item in options" :key="item[itemKey]" :label="item[itemValue]">
					{{ item[itemLabel] }}
				</el-checkbox>
			</el-checkbox-group>
			<el-radio-group v-else :model-value="modelValue" @change="handleCheckedChange" size="small">
				<el-radio v-for="item in options" :key="item[itemKey]" :label="item[itemValue]">{{
					item[itemLabel]
				}}</el-radio>
			</el-radio-group>
		</div>
		<template #reference>
			<span
				style="line-height: 1"
				:title="hasFiltered ? `当前筛选条件: ${currentFilter}` : '点击筛选'"
			>
				<!-- <el-icon
          class="detail-text"
          style="margin-left: 5px; vertical-align: sub"
          :size="14"
          ><Filter
        /></el-icon> -->
				<i class="iconfont icon-shaixuan2 f-s-14 pointer" v-if="!hasFiltered"></i>
				<i class="iconfont icon-shaixuan1 f-s-14 pointer color-main" v-else></i>
			</span>
		</template>
	</el-popover>
</template>

<script setup>
const props = defineProps({
	modelValue: {
		type: [Array, String, Number],
		default() {
			return null
		}
	},
	placement: {
		type: String,
		default: "right-start"
	},
	width: {
		type: [String, Number],
		default: "120px"
	},
	options: {
		type: Array,
		default() {
			return []
		}
	},
	itemKey: {
		type: String,
		default() {
			return "value"
		}
	},
	itemLabel: {
		type: String,
		default() {
			return "label"
		}
	},
	itemValue: {
		type: String,
		default() {
			return "value"
		}
	},
	multiple: Boolean
})

const emits = defineEmits(["update:modelValue", "change"])

const showPopover = ref(false)

const isIndeterminate = ref(false)
const checkAll = ref(false)
const handleCheckAllChange = (val) => {
	let selected
	if (val) {
		selected = props.options.map((item) => {
			return item[props.itemValue]
		})
	} else {
		selected = []
	}
	isIndeterminate.value = false
	emits("update:modelValue", selected)
	emits("change", val)
}
const handleCheckedChange = (val, noEmit = false) => {
	if (!noEmit) {
		emits("update:modelValue", val)
		emits("change", val)
	}
	if (props.multiple) {
		let checkedCount = val.length
		checkAll.value = checkedCount === props.options.length
		isIndeterminate.value = checkedCount > 0 && checkedCount < props.options.length
	} else {
		showPopover.value = false
	}
}
onMounted(() => {
	handleCheckedChange(props.modelValue, true)
})

const hasFiltered = computed(() => {
	if (props.multiple) {
		return props.modelValue?.length > 0
	}
	// 解决当modelValue为false时包含筛选条件的状态不显示的问题
	return props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== ""
		? true
		: false
})
const currentFilter = computed(() => {
	if (props.multiple) {
		return props.options
			.filter((item) => {
				return props.modelValue?.includes(item[props.itemValue])
			})
			.map((item) => item[props.itemLabel])
			.join(",")
	} else {
		return props.options.find((item) => item[props.itemValue] === props.modelValue)?.[
			props.itemLabel
		]
	}
})
</script>

<style lang="scss" scoped>
.detail-text {
	color: var(--my-primary);
	cursor: pointer;
}

:deep(.el-checkbox-group) {
	display: flex;
	flex-flow: column;
}
</style>
<style lang="scss">
.table-header-filter {
	--el-popover-padding: 2px 8px;
}

.table-header-filter-check {
	.el-checkbox-group {
		display: flex;
		flex-flow: column;
	}
}
.el-popover.el-popper {
	min-width: 120px;
}
</style>
