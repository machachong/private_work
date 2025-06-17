<template>
	<section>
		<DemandProgress
			:processList="processList"
			:taskRow="taskRow"
			:developProcess="developProcess"
			:demandRow="demandRow"
			type="noScroll"
			@updateProgress="emits('updateProgress')"
			@ok="emits('ok')"
			@updateProd="(val) => emits('updateProd', val)"
		></DemandProgress>
	</section>
</template>

<script setup>
import DemandProgress from "@/views/demand/components/demand_list/DemandProgressMobile.vue"
const emits = defineEmits(["ok", "updateProgress", "updateProd"])
defineProps({
	processList: {
		type: Array,
		default: () => []
	},
	taskRow: {
		type: Object,
		default: () => {
			return {}
		}
	},
	developProcess: {
		type: Array,
		default: () => []
	},
	demandRow: {
		type: Object,
		default: () => {
			return {}
		}
	}
})
</script>

<style scoped lang="scss"></style>
