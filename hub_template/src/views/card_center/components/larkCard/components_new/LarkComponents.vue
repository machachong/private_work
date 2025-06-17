<template>
	<template v-for="(item, index) in info" :key="index">
		<!-- {{ item.tag }} -->
		<BokeMd v-show="item.tag === 'markdown'" :text="item?.content"></BokeMd>
		<LarkDiv v-if="item.tag === 'div'" :info="item"></LarkDiv>
		<LarkImg v-if="item.tag === 'img'" :info="item"></LarkImg>
		<LarkAction v-if="item.tag === 'action'" :info="item"></LarkAction>
		<div class="lark-hr" v-if="item.tag === 'hr'"></div>
		<LarkNote v-if="item.tag === 'note'" :info="item"></LarkNote>
		<LarkColumn v-if="item.tag === 'column_set'" :info="item?.columns" :detail="item"></LarkColumn>
		<LarkColumn v-if="item.tag === 'column'" :info="item?.elements" :detail="item"></LarkColumn>
		<LarkTable v-if="item.tag === 'table'" :info="item"></LarkTable>
		<LarkChart v-if="item.tag === 'chart'" :info="item"></LarkChart>
		<LarkRepeat v-if="item.tag === 'repeat'" :info="item"></LarkRepeat>
		<LarkInteractive v-if="item.tag === 'interactive_container'" :info="item"></LarkInteractive>
		<LarkPerson v-if="item.tag === 'person'" :info="item"></LarkPerson>
		<LarkButton
			v-if="item.tag === 'button'"
			:type="item.type"
			:disabled="getDisabled(item)"
			@click="clickEvent(item)"
			>{{ item?.text?.content }}</LarkButton
		>
		<!-- 2024-9-23 因为下拉框不能操作，所以禁用下拉框 :disabled="item?.disabled" -->
		<template v-if="item?.tag == 'select_person'">
			<el-select
				class="action-item"
				clearable
				:model-value="item?.initial_index"
				:placeholder="item?.placeholder?.content"
				:style="{ width: getWidth(item) }"
				disabled
			>
				<el-option v-for="opt in item?.options" :key="opt?.value" :label="opt?.text?.content" :value="opt?.value" />
			</el-select>
		</template>
		<!-- 2024-9-23 因为下拉框不能操作，所以禁用下拉框 :disabled="item?.disabled" -->
		<template v-if="item?.tag === 'select_static'">
			<el-select
				class="action-item"
				clearable
				:model-value="item?.value"
				:placeholder="item?.placeholder?.content"
				:style="{ width: getWidth(item) }"
				disabled
			>
				<el-option
					v-for="opt in JSON.parse(item?.options)"
					:key="opt?.action_value"
					:label="opt?.text"
					:value="opt?.action_value"
				/>
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
		<!-- <template v-if="item?.tag === 'overflow'">
			<larkMore :info="item?.options" class="action-item"></larkMore>
		</template> -->
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
		<larkForm v-if="item.tag === 'form'" :info="item"></larkForm>
		<LarkCollapse v-if="item.tag === 'collapsible_panel'" :detail="item"></LarkCollapse>
		<LarkPersonList v-if="item.tag === 'person_list'" :info="item"></LarkPersonList>
	</template>
</template>
<script setup>
import { useLark } from '../hook/lark'
import LarkColumn from './LarkColumn.vue'
// import larkMore from '../components/larkMore.vue'
import LarkImg from '../components/LarkImg.vue'
import LarkAction from '../components/LarkAction.vue'
import LarkNote from '../components/LarkNote.vue'
import LarkDiv from '../components/LarkDiv.vue'
import LarkTable from './LarkTable.vue'
import LarkRepeat from './LarkRepeat.vue'
import LarkPerson from './LarkPerson.vue'
import LarkChart from './LarkChart.vue'
import LarkButton from '../components/LarkButton.vue'
import LarkForm from './LarkForm.vue'
import LarkInteractive from './LarkInteractive.vue'
import LarkCollapse from '../components_new/LarkCollapse.vue'
import LarkPersonList from './LarkPersonList.vue'

const { clickEvent, getDisabled } = useLark()
const props = defineProps({
	info: {
		type: Array,
		default: () => []
	},
	row: {
		type: Object,
		default: () => {
			return {}
		}
	}
})
const { info } = toRefs(props)
// provide("listRow", props.row)
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
</script>
<style scoped lang="scss">
.lark-hr {
	width: 100%;
	height: 1px;
	background-color: rgba(31, 35, 41, 0.15);
	margin-top: 16px;
}
</style>
