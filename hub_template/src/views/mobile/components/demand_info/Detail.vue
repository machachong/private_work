<template>
	<section>
		<div class="detail-item">
			<DemandInfo
				:demandRow="demandRow"
				:taskRow="taskRow"
				:title="title"
				:optionsStore="optionsStore"
			></DemandInfo>
		</div>
	</section>
</template>
<script setup>
import DemandInfo from "@/views/demand/components/demand_list/DemandInfo.vue"
defineProps({
	demandRow: {
		type: Object,
		default: () => {
			return {}
		}
	},
	taskRow: {
		type: Object,
		default: () => {
			return {}
		}
	},
	title: {
		type: String,
		default: ""
	},
	optionsStore: {
		type: Object,
		default: () => {
			return {}
		}
	}
})
</script>

<style scoped lang="scss">
.detail-item {
	width: 100%;
}
</style>
