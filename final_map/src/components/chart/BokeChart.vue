<template>
  <div class="chart-scatter">
    <ECharts
             :chart-id="chartId"
             :options="setOptions"
             :loading="loading"
             :width="width"
             :height="height"
             need-clear
             once
             renderSvg
             @e-click="onChartClick" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, toRefs } from "vue"
import ECharts from "./ECharts.vue"
import { merge } from "lodash"
import { getUuid } from "@/utils/tools"
import echartUtil from "./tools/echartTool"
const defaultConfig = {
  tooltip: {
    trigger: "axis",
    show: true
  },
  legend: {
    show: true,
    position: "bottom",
    borderRadius: 4,
    hiddenColumns: false
  },
  convertXY: false,
  xAxis: {
    show: true,
    type: "category"
  },
  yAxis: {
    type: "value",
    show: true
  },
  xyAxis: {
    axisLine: {
      color: null
    }
  },
  colorValue: 1,
  color: ["#6395FA", "#63DAAB", "#657798", "#F7C123", "#7666FA", "#76CBEC", "#9A68BD", "#2A9A99", "#FF9EC6", "#859E66"],
  grid: {
    top: "12%",
    left: "5%",
    bottom: "10%",
    right: "5%",
    containLabel: true
  }, // 设置图表间距
  gridvalue: 12,
  series: {
    smooth: 0.2,
    maxmin: false,
    markLine: false,
    barWidth: 20, // 柱状图宽度
    barLine: null,
    barLineIndex: null,
    showBackground: false,
    labelShow: true,
    labelPosition: "top",
    radius: 56,
    lineStyle: {
      width: 2,
      type: "solid"
    },
    labelLine: {
      show: true
    },
    areaStyle: {
      color: null,
      shadowColor: null,
      opacity: null
    }
  },
  text: {
    format: null,
    fontSize: 12,
    fontWeight: 500,
    color: null,
    fontStyle: "normal",
    textAlign: "right",
    opacity: 1
  }
}

const props = defineProps({
  width: {
    type: String,
    default: "100%"
  },
  height: {
    type: String,
    default: "100%"
  },
  loading: {
    type: Boolean,
    default: false
  },
  datas: {
    type: Array,
    default: () => []
  },
  options: {
    type: Object,
    default: () => {
      return {}
    }
  },
  type: {
    type: String,
    default: "pie"
  }
})
const emits = defineEmits(["change"])
const { datas, options: propOptions } = toRefs(props)
const chartId = ref(`chart-${getUuid()}`)
const setOptions = ref()
const updateChart = () => {
  const newOptions = merge(defaultConfig, propOptions.value)
  console.log("重新执行", newOptions)
  setOptions.value = echartUtil.getEchartOption(newOptions, datas.value, props.type)
}
watch(
  () => [propOptions.value, datas.value],
  () => {
    updateChart()
  },
  {
    immediate: true,
    deep: true
  }
)
const onChartClick = (item) => {
  emits("change", item)
}
onMounted(() => {
  updateChart()
})
defineExpose({
  updateChart
})
</script>

<style scoped lang="scss">
.chart-scatter {
  width: 100%;
  height: 100% !important;
}
</style>
