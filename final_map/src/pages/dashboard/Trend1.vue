<template>
  <div style="padding-top: 100px;width: 100vw;height: 100vh;overflow: hidden;" v-loading="loading">
    <div style="margin: 0 auto;text-align: center;">
      <h3>{{areaKeys.find(item => item.value == formData.area)?.label}}</h3>
      <el-space style="margin-top:50px">
        <el-space>
          <span>区域:</span>
          <el-select style="width: 300px" v-model="formData.area" :options="areaKeys" @change="init">
            <el-option v-for="item in areaKeys" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-space>
        <el-space style="margin-left: 50px;">
          <span>时间:</span>
          <el-date-picker style="width: 300px" v-model="formData.date" type="date" placeholder="请选择时间"
                          value-format="YYYY-MM-DD" @change="handleChangeDate" :disabled-date="disabledDateMethod" />

        </el-space>
      </el-space>
    </div>
    <div id="container-chart" style="width:100vw;height: 50vh;margin-top: 50px;"></div>
  </div>

</template>
<script setup>
import { onMounted, reactive, ref, shallowRef } from 'vue';
import { Chart } from '@antv/g2';
import dayjs from 'dayjs'
import { getGridBasicinfoApi, getMapAreaApi, getMapAreaDataApi, getPopulationApi, getMapDataApi } from "./api/index"
const formData = reactive({
  area: '11260',
  date: '',
  dateOptions: [],
  dateParams: []
})
const areaKeys = [
  {
    label: '黄浦-豫园核心区',
    value: '11260'
  },
  {
    label: '青浦-进博四叶草',
    value: '4151769457318033095'
  },
  {
    label: '松江-西佘山国家森林公园',
    value: '4151759729273286949'
  },
  {
    label: '黄浦-外滩滨水区',
    value: '4151772519864110784'
  },
  {
    label: '黄浦-新天地(南北里+公园)',
    value: '4151772430222681079'
  }
]
const loading = ref(true)
const customerPeople = ref([])
const tablePeople = ref([])
const chartInstance = shallowRef(null)
const handleChangeDate = () => {
  formData.dateOptions = getFiveMinuteIntervals(dayjs(formData.date).format('YYYY-MM-DD'))
  formData.dateParams = [
    dayjs(dayjs(formData.date).format('YYYY-MM-DD 00:00:00')).unix(),
    dayjs(dayjs(formData.date).add(1, 'day').format('YYYY-MM-DD 00:00:00')).unix()
  ]
  init()
}
function getFiveMinuteIntervals(date) {
  const intervals = [];
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  let current = new Date(start);
  while (current <= end) {
    const hours = String(current.getHours()).padStart(2, '0');
    const minutes = String(current.getMinutes()).padStart(2, '0');
    const item = dayjs(dayjs(`${date} ${hours}:${minutes}`).format("YYYY-MM-DD HH:mm:ss")).unix()


    intervals.push(item);
    current.setMinutes(current.getMinutes() + 30);
  }
  console.log(intervals);

  return intervals;
} function disabledDateMethod(time) {
  return time.getTime() >= new Date().setHours(0, 0, 0, 0) || time.getTime() < new Date("2025-4-23").setHours(0, 0, 0, 0);
}; function getOneHourAgoTime() {
  return dayjs(dayjs().startOf("hour").format("YYYY-MM-DD HH:00:00")).unix()
}
function getHourNext() {
  return dayjs(dayjs().startOf("hour").add(1, "hour").format("YYYY-MM-DD HH:00:00")).unix()
}
async function getMapAreaData(time) {
  try {

    const res = await getMapAreaDataApi(
      {
        region_ids: [formData.area],
        time,
        key: "YNDBZ-OWO6Z-QOEXI-7AXSB-HCH4V-6DF6G"
      }
    )
    console.log(res.data.region_list?.length > 0);
    if (res.data?.region_list) {
      const countData = res.data?.region_list[0].grid_list.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.grid_pop
      }, 0)
      console.log(countData);
      tablePeople.value.push({
        "时间": dayjs(time * 1000).format('HH:mm:ss'),
        "人数": countData,
        type: '网格总人数'
      })
    }

  }
  catch (error) {
    console.log(error);
  }
}
async function getPopulation(id) {
  console.log(getOneHourAgoTime(), getHourNext())

  const res = await getPopulationApi(
    {
      id: formData.area,
      begin: formData.dateParams[0],
      end: formData.dateParams[1],
      interval: 30,
      people_type: "all",
      key: "YNDBZ-OWO6Z-QOEXI-7AXSB-HCH4V-6DF6G"
    }
  )

  customerPeople.value = res?.data?.splice(0, 48)?.map(item => {
    return {
      "时间": dayjs(item.time).format('HH:mm:ss'),
      "人数": item.value,
      type: "自定义总人数"
    }
  })
}
const initChart = () => {
  const totalData = [
    ...tablePeople.value,
    ...customerPeople.value
  ]
  console.log(totalData);
  if (chartInstance.value) {
    chartInstance.value.changeData(totalData)
    chartInstance.value.render();
    return
  }
  // 准备数据
  // 初始化图表实例
  chartInstance.value = new Chart({
    container: 'container-chart',
    autoFit: true
  });

  // 声明可视化
  // chart
  //   .line() // 创建一个 Interval 标记
  //   .data(chartData.value) // 绑定数据
  //   .encode('x', '时间') // 编码 x 通道
  //   .encode('y', '人数'); // 编码 y 通道
  chartInstance.value
    .data(totalData)
    .encode('x', '时间')
    .encode('y', '人数')
    .encode('color', 'type')
    .scale('x', {
      range: [0, 1],
    })
    .scale('y', {
      nice: true,
    })
    .transform({
      type: 'sample',
      thresholds: 200,
      strategy: 'max',
    });

  chartInstance.value.line().encode('shape', 'smooth');

  chartInstance.value.point().encode('shape', 'point').tooltip(false);
  // 渲染可视化
  chartInstance.value.render();
}
const init = async () => {
  try {
    customerPeople.value = []
    tablePeople.value = []
    loading.value = true
    await getPopulation()
    for (let i in formData.dateOptions) {
      await getMapAreaData(formData.dateOptions[i])
    }
    loading.value = false
    initChart()

  } catch (error) {
    loading.value = false
    console.log(error);
  }
}
onMounted(() => {
  formData.date = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  handleChangeDate()
})
</script>