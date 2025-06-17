<template>
  <BokeChart v-if="datas?.length > 0" :loading="loading" :options="options" :datas="datas" :type="type" class="height-100"></BokeChart>
  <el-empty v-else description="暂无数据" />
</template>

<script setup>
defineProps({
	datas: {
		type: Array,
		default: () => []
	},
	loading: {
		type: Boolean,
		default: false
	},
	options: {
		type: Object,
		default: () => {
			return {}
		}
	},
	type:{
		type: String,
		default: ""
	}
})
</script>

<style scoped lang='scss'>
</style>