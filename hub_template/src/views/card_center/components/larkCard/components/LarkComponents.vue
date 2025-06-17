<template>
	<template v-for="(item, index) in info" :key="index">
		<BokeMd v-show="item.tag === 'markdown'" :text="item?.content"></BokeMd>
		<LarkDiv v-if="item.tag === 'div'" :info="item"></LarkDiv>
		<LarkImg v-if="item.tag === 'img'" :info="item"></LarkImg>
		<LarkAction v-if="item.tag === 'action'" :info="item"></LarkAction>
		<div class="lark-hr" v-if="item.tag === 'hr'"></div>
		<LarkNote v-if="item.tag === 'note'" :info="item"></LarkNote>
		<LarkColumn v-if="item.tag === 'column_set'" :info="item?.columns" :detail="item"></LarkColumn>
		<LarkButton
			v-if="item.tag === 'button'"
			:type="item.type"
			:disabled="getDisabled(item)"
			@click="clickEvent(item)"
			>{{ item?.text?.content }}</LarkButton
		>
		<LarkCollapse v-if="item.tag === 'collapsible_panel'" :detail="item"></LarkCollapse>
		<LarkPersonList v-if="item.tag === 'person_list'" :info="item"></LarkPersonList>
	</template>
</template>
<script setup>
import { toRefs } from 'vue'
import { useLark } from '../hook/lark'
import LarkColumn from './LarkColumn.vue'
import LarkImg from './LarkImg.vue'
import LarkAction from './LarkAction.vue'
import LarkNote from './LarkNote.vue'
import LarkDiv from './LarkDiv.vue'
import LarkButton from './LarkButton.vue'
import LarkCollapse from '../components_new/LarkCollapse.vue'
import LarkPersonList from '../components_new/LarkPersonList.vue'
const { clickEvent, getDisabled } = useLark()
const props = defineProps({
	info: {
		type: Array,
		default: () => []
	}
})
const { info } = toRefs(props)
</script>
<style scoped lang="scss">
.lark-hr {
	width: 100%;
	height: 1px;
	background-color: rgba(31, 35, 41, 0.15);
	margin-top: 16px;
}
</style>
