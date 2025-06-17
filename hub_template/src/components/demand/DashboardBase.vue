<template>
	<div>
		<boke-card class="tab-card">
			<boke-tabs v-model:active="activeTabs" :tabs="tabs" size="small" noUrlChange></boke-tabs>
		</boke-card>
		<div class="m-t-12" v-if="activeTabs == 1">
			<slot name="default"></slot>
		</div>
		<PersonalStatistics class="m-t-12" :type="type" v-if="activeTabs == 2" />
	</div>
</template>

<script setup>
import PersonalStatistics from './PersonalStatistics.vue'
defineProps({
	type: {
		type: String,
		default: 'dev'
	}
})
const activeTabs = ref(1)
const tabs = ref([
	{ label: '需求总览', name: 1 },
	{ label: '个人统计', name: 2 }
])
</script>

<style scoped lang="scss">
.tab-card {
	:deep(.el-card__body) {
		padding: 10px 0 10px 20px;
	}
}
</style>
