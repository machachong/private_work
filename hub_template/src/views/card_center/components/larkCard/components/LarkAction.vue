<template>
	<div class="lark-action">
		<template v-for="(item, index) in actions" :key="index">
			<lark-button
				class="lark-button action-item m-r-10"
				v-if="item?.tag === 'button'"
				:type="item?.type"
				:size="item.size"
				@click="clickEvent(item)"
				:disabled="item?.disabled || getDisabled(item)"
				:style="{ width: getWidth(item) }"
				>{{ item?.text?.content }}</lark-button
			>
			<template v-if="item?.tag === 'select_static' || item?.tag == 'select_person'">
				<!-- 2024-9-23 因为下拉框不能操作，所以禁用下拉框 :disabled="item?.disabled" -->
				<el-select
					class="action-item action-select"
					clearable
					:model-value="item?.initial_index"
					:placeholder="item?.placeholder?.content"
					:style="{ width: getWidth(item) }"
					disabled
				>
					<el-option v-for="opt in item?.options" :key="opt?.value" :label="opt?.text?.content" :value="opt?.value" />
				</el-select>
			</template>
			<template v-if="item?.tag === 'date_picker'">
				<el-date-picker
					class="action-item"
					:model-value="item?.initial_date"
					:placeholder="item?.placeholder?.content"
					:style="{ width: getWidth(item) }"
					:disabled="item?.disabled"
				/>
			</template>
			<template v-if="item?.tag === 'overflow'">
				<larkMore :info="item?.options" class="action-item"></larkMore>
			</template>
			<template v-if="item?.tag === 'picker_time'">
				<el-time-picker
					class="action-item"
					:model-value="getVar(item?.initial_time)"
					type="date"
					format="HH:mm"
					:placeholder="item?.placeholder?.content"
					:style="{ width: getWidth(item) }"
					:disabled="item?.disabled"
				/>
			</template>
			<template v-if="item?.tag === 'picker_datetime'">
				<el-date-picker
					class="action-item"
					:model-value="item?.initial_date"
					format="YYYY-MM_DD HH:mm:ss"
					type="datetime"
					:placeholder="item?.placeholder?.content"
					:style="{ width: getWidth(item) }"
					:disabled="item?.disabled"
				/>
			</template>
			<template v-if="item?.tag === 'input'">
				<el-input
					class="action-item"
					:model-value="item?.default_value"
					:placeholder="item?.placeholder?.content"
					:style="{ width: getWidth(item) }"
					:disabled="item?.disabled"
				/>
			</template>
		</template>
		<section v-if="info?.tag == 'form'">
			<lark-button class="card-button" type="primary">确定</lark-button>
			<lark-button class="card-button">取消</lark-button>
		</section>
	</div>
</template>
<script setup>
import larkMore from './LarkMore.vue'
import LarkButton from './LarkButton.vue'
import { toRefs, computed } from 'vue'
import { useLark } from '../hook/lark'
const { clickEvent, getDisabled } = useLark()
const props = defineProps({
	info: {
		type: Object,
		default: () => ({})
	}
})
const { info } = toRefs(props)
const actions = computed(() => {
	if (info.value?.tag == 'form') {
		return info.value?.elements || []
	}
	return info.value?.actions || []
})
const getWidth = (item) => {
	if (item?.width == 'default') {
		if (item?.tag == 'button') {
			return
		}
		return '300px'
	} else if (item?.width == 'fill') {
		return '100%'
	} else {
		if (item?.tag == 'button') {
			return
		}
		return item?.width
	}
}
const getVar = () => {
	return ''
}
</script>
<style lang="scss" scoped>
.lark-action {
	margin: 6px 0;
	.default-button {
		border-radius: 6px;
		box-sizing: border-box;
		color: #3370ff;
		cursor: pointer;
		line-height: 32px;
		border-color: rgb(208, 211, 214);
	}
	.lark-button {
		padding: 0 26px;
	}
	.action-item {
		margin: 6px;
	}
	.action-select {
		width: 204px;
	}
}
</style>
