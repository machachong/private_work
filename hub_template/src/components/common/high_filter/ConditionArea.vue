<!-- eslint-disable vue/no-mutating-props -->
<template>
	<section class="search-content">
		<div class="search-area">
			<p v-for="(item, index) in conditionItem.condition" :key="index" class="m-t-8">
				<el-space :size="8">
					<BokeSelect
						v-model="item.prop"
						:options="filedOptions"
						item-value="prop"
						item-label="label"
						item-key="prop"
						width="190px"
						clearable
						placeholder="请选择要查询的字段"
						@change="handleFiledChange(item)"
					>
					</BokeSelect>
					<BokeSelect
						v-model="item.condition"
						:options="getConditionOption(item.prop)"
						width="120px"
						clearable
						placeholder="请选择条件"
					>
					</BokeSelect>
					<template v-if="item.prop">
						<BokeSelect
							v-if="getConditionType(item.prop) == 'select'"
							v-model="item.value"
							collapse-tags
							:multiple="!activeField?.multiple"
							:max-collapse-tags="1"
							:options="getValueOption(item)"
							:item-value="item?.itemValue || 'value'"
							:item-label="item?.itemLabel || 'label'"
							:item-key="item?.itemValue || 'value'"
							width="220px"
							clearable
						>
						</BokeSelect>
						<el-input
							v-else
							style="width: 220px"
							v-model="item.value"
							placeholder="请输入查询内容"
						></el-input>
					</template>
					<el-icon :size="20" class="color-fail pointer" @click="handleDelete(index)">
						<Delete />
					</el-icon>
				</el-space>
			</p>
		</div>
		<p class="m-t-8">
			<el-space :size="20">
				<boke-text-button @click="handleAdd">
					<el-space :size="4">
						<el-icon><Plus /></el-icon>添加
					</el-space>
				</boke-text-button>
				<el-space v-if="conditionItem.value != 'default'">
					<span class="f-s-14">设置为默认条件</span>
					<el-tooltip
						class="box-item"
						effect="dark"
						content="设置为默认条件后，下次进入该页面默认按照设置的条件查询"
						placement="top"
					>
						<el-icon><Warning /></el-icon>
					</el-tooltip>
					<el-switch v-model="conditionItem.isDefault" />
				</el-space>
			</el-space>
		</p>
	</section>
</template>

<script setup>
import { Warning, Delete, Plus } from "@element-plus/icons-vue"
import { conditionDict } from "./config.js"
const props = defineProps({
	filedOptions: {
		type: Array,
		default: () => []
	},
	conditionItem: {
		type: Object,
		default: () => {
			return {}
		}
	}
})
const emits = defineEmits(["add", "delete", "update:conditionItem"])
const activeField = ref()

const getConditionType = (value) => {
	return props.filedOptions?.find((item) => item.prop == value)?.type
}
const getConditionOption = (value) => {
	const valueType = getConditionType(value)
	return conditionDict.filter((item) => {
		return item.usable?.includes(valueType)
	})
}
const getValueOption = (value) => {
	return props.filedOptions?.find((item) => item.prop == value.prop)?.options
}
const handleFiledChange = (item) => {
	activeField.value = props.filedOptions?.find((list) => list.prop == item.prop)
	item.value = null
}
const handleAdd = () => {
	emits("add", props.conditionItem)
}
const handleDelete = (index) => {
	emits("delete", props.conditionItem, index)
}
</script>

<style scoped lang="scss">
.search-area {
	max-height: 430px;
	overflow-y: auto;
	overflow-x: hidden;
}
</style>
