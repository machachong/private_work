<template>
	<section :style="{ height: getHeight() }" class="lark-chart">
		<BokeChart
			v-if="chartDatas?.length > 0"
			:options="chart_spec"
			:datas="chartDatas"
			:type="chartType"
			class="height-100"
		></BokeChart>
		<el-empty v-else description="暂无数据" />
	</section>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
	info: {
		type: Object,
		default: () => {
			return {}
		}
	}
})
const chart_spec = computed(() => {
	return JSON.parse(props.info?.chart_spec || {})
})
const chartType = computed(() => {
	return chart_spec.value?.type
})
const chartDatas = computed(() => {
	console.log(36, props.info)
	const xField = Array.isArray(chart_spec.value?.xField) ? chart_spec.value?.xField : [chart_spec.value?.xField]
	const yField = chart_spec.value?.yField
	const type = chart_spec.value?.seriesField
	const xValues = xField
		?.filter((item) => {
			return item != type
		})
		.map((field) => {
			let newArr = [field]
			chart_spec.value?.data?.values.forEach((item) => {
				newArr.push(item[field])
			})
			newArr = [...new Set([...newArr])]
			return newArr
		})
	const yValues = groupBy(chart_spec.value?.data?.values, type, yField)
	const total = []
	for (let i in yValues) {
		total.push([i, ...yValues[i]])
	}
	return [...xValues, ...total]
})
const groupBy = (array, key, keyTwo) => {
	return array?.reduce((result, currentValue) => {
		let groupKey = currentValue[key]

		if (!result[groupKey]) {
			result[groupKey] = []
		}
		result[groupKey].push(currentValue[keyTwo])

		return result
	}, {}) // 初始化一个空对象作为累加器
}
const getHeight = () => {
	// 图表宽度默认580
	if (props.info?.height && props.info?.height != 'auto') {
		return props.info?.height
	}
	if (props.info?.aspect_ratio == '2:1') {
		return '300px'
		// eslint-disable-next-line no-dupe-else-if
	} else if (props.info?.aspect_ratio == '2:1') {
		return '580px'
	} else if (props.info?.aspect_ratio == '4:3') {
		return '420px'
	} else {
		return '330px'
	}
}
</script>

<style scoped lang="scss">
.lark-chart {
	margin: 10px 0;
}
</style>
