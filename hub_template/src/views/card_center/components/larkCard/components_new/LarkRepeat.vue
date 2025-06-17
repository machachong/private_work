<template>
	<div v-for="(item, index) in repeatEl" :key="index">
		<LarkColumn v-if="item.tag == 'column_set'" :info="item.columns" :detail="item"></LarkColumn>
		<LarkInteractive v-else-if="item.tag == 'interactive_container'" :info="item"></LarkInteractive>
		<larkComponents v-else :info="item.elements" :row="item"></larkComponents>
	</div>
</template>
<script setup>
import { computed } from 'vue'
import { cloneDeep } from 'lodash'
import LarkColumn from './LarkColumn.vue'
import LarkInteractive from './LarkInteractive.vue'
import LarkComponents from './LarkComponents.vue'
const props = defineProps({
	info: {
		type: Object,
		default: () => ({})
	},
	detail: {
		type: Object,
		default: () => ({})
	}
})
const deepTransfer = (current, values) => {
	if (current.tag == 'input') {
		current.default_value = transferProps(current.default_value, values)
	} else if (current.tag == 'div') {
		current.text.content = transferProps(current.text.content, values)
	} else if (current.tag == 'markdown') {
		current.content = transferProps(current.content, values)
	}
	if (current?.columns?.length > 0 || current?.elements?.length > 0) {
		let keys = current?.columns || current?.elements
		for (let i in keys) {
			deepTransfer(keys[i], values)
		}
	}
}
const transferProps = (str, values) => {
	// eslint-disable-next-line no-useless-escape
	let regex = /\$\{([^\}]+)\}/g
	if (!str || Array.isArray(str)) return str
	return str?.replaceAll(regex, function (value, props) {
		let val = props
		for (let i of Object.keys(values)) {
			if (`${varOne.value}.${i}` == props) {
				val = values[i]
			}
		}
		if (Array.isArray(val)) {
			return JSON.stringify(val)
		}
		return val
	})
}
const varOne = computed(() => {
	return props.info.variable
})
const repeatEl = computed(() => {
	let res = props.info?.value?.map((item, index) => {
		return {
			index,
			...cloneDeep(props.info?.elements[0]),
			value: item
		}
	})
	res?.forEach((item) => {
		deepTransfer(item, item.value)
	})
	return res
})
</script>

<style scoped lang="scss"></style>
