<template>
    <div style="padding-top: 100px;width: 100vw;height: 100vh;overflow: hidden;" v-loading="loading" :style="{
        width: component ? '100%' : '100vw', height: component ? 'auto' : '100vh', 'padding-top': component
            ? '0' : '50px'
    }">
        <div style="margin: 0 auto;text-align: center;">
            <h3 v-if="!component">{{areaKeys.find(item => item.value == formData.area)?.label}}</h3>
            <el-space :style="{ 'margin-top': component ? '0' : '50px' }">
                <!-- <el-space>
                    <span>区域:</span>
                    <el-select style="width: 300px" v-model="formData.area" :options="dateOptions" @change="init">
                        <el-option v-for="item in areaKeys" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-space> -->
                <el-space style="margin-left: 50px;">
                    <span>时间:</span>
                    <el-date-picker style="width: 300px" v-model="formData.date" type="date" placeholder="请选择时间"
                        value-format="YYYY-MM-DD" @change="handleChangeDate" :disabled-date="disabledDateMethod" />

                </el-space>
            </el-space>
        </div>
        <div id="container-chart" style="width:100%;margin-top: 20px;"
            :style="{ height: component ? '400px' : '50vh' }"></div>
    </div>

</template>
<script setup>
import { onMounted, reactive, ref, shallowRef } from 'vue';
import { Chart } from '@antv/g2';
import dayjs from 'dayjs'
import { getMapAreaDataTableApi, getMapAreaDataAreaApi, } from "./api/index"
const props = defineProps({
    component: {
        type: Boolean,
        default: false
    }
})
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
const sumPeople = ref([])
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
// async function getMapAreaData(time) {
//     try {

//         const res = await getMapAreaDataApi(
//             {
//                 region_ids: [formData.area],
//                 time,
//                 key: "YNDBZ-OWO6Z-QOEXI-7AXSB-HCH4V-6DF6G"
//             }
//         )
//         console.log(res.data.region_list?.length > 0);
//         if (res.data?.region_list) {
//             const countData = res.data?.region_list[0].grid_list.reduce((accumulator, currentValue) => {
//                 return accumulator + currentValue.grid_pop
//             }, 0)
//             console.log(countData);
//             tablePeople.value.push({
//                 "时间": dayjs(time * 1000).format('YYYY-MM-DD HH:mm:ss'),
//                 "人数": countData,
//                 type: '网格总人数'
//             })
//         }

//     }
//     catch (error) {
//         console.log(error);
//     }
// }
async function getMapAreaDataArea() {
    const res = await getMapAreaDataAreaApi(
        {
            regionId: formData.area,
            begin: formData.dateParams[0],
            end: formData.dateParams[1],
            interval: 5,
            key: "e77060506d32a50f28666dc059586d7b402bee85ab25db2a0fec254946fc3f1c"
        }
    )
    console.log(res);

    customerPeople.value = res?.data?.splice(0, 288)?.map(item => {
        return {
            "时间": dayjs(item.time).format('HH:mm:ss'),
            "人数": item.value,
            type: "LBS区域总人数"
        }
    })
}
async function getMapAreaDataTable() {
    console.log(getOneHourAgoTime(), getHourNext())

    const res = await getMapAreaDataTableApi(
        {
            regionIds: [formData.area],
            begin: formData.dateParams[0],
            end: formData.dateParams[1],
            interval: 5,
            key: "e77060506d32a50f28666dc059586d7b402bee85ab25db2a0fec254946fc3f1c"
        }
    )
    console.log(res);
    if (res?.data?.regionList?.length > 0) {
        tablePeople.value = res?.data?.regionList[0]?.regionGridList?.slice(0, 288)?.map(item => {
            return {
                "时间": dayjs(item.time).format('HH:mm:ss'),
                "人数": item.gridPopSum,
                type: "小网格总人数",
                rate: item.rate,
            }
        })
        sumPeople.value = res?.data?.regionList[0]?.regionGridList?.slice(0, 288)?.map(item => {
            return {
                "时间": dayjs(item.time).format('HH:mm:ss'),
                "人数": item.gridPopNewSum,
                type: "优化后总人数",
            }
        })
    }

}
const findMinMax = (arr, property) => {
    const values = arr.map(item => item[property]);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    const minObj = arr.find(item => item[property] === minValue);
    const maxObj = arr.find(item => item[property] === maxValue);

    return { minObj, maxObj };
};
const initChart = () => {
    const totalData = [
        ...tablePeople.value,
        ...customerPeople.value,
        ...sumPeople.value
    ]
    console.log(totalData);
    if (chartInstance.value) {
        chartInstance.value?.changeData(totalData)
        chartInstance.value.render();
        return
    }
    // 准备数据
    // 初始化图表实例
    chartInstance.value = new Chart({
        container: 'container-chart',
        autoFit: true,

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
        .legend({
            position: 'top'
        })



    chartInstance.value.line().encode('shape', 'smooth');
    // chartInstance.value.options({
    //     type: 'line',
    //     tooltip: {
    //         title: '年份11', // 标题
    //         items: [
    //             { field: 'value', channel: 'y' } // 显示哪些字段
    //         ],
    //         // 自定义内容
    //         render: (_, data) => {
    //             console.log(data);

    //             return `<div>自定义内容: ${data[0].data.value}</div>`;
    //         }
    //     },

    // });
    chartInstance.value.interaction('tooltip', {
        // render 回调方法返回一个innerHTML 或者 DOM
        render: (event, { title, items }) => {
            console.log(title, items);
            let newItem = tablePeople.value.find(item => item['时间'] === title)
            let str = ''
            items.forEach(
                (d) => {
                    str += `<li style="list-style:none">${d.name}：${d.value}</li>`
                })

            return `<div><h3 style="padding:0;margin:0">${title}<span style="font-size:13px;font-weight:500;margin-left:10px"><span >相差率：</span> ${newItem.rate}</li></h3><div>${str}</div></div>`
        },
    });
    const { minObj: minData, maxObj: maxData } = findMinMax(totalData, 'value');
    // chartInstance.value.guide().dataMarker({
    //     top: true,
    //     content: '峰值：' + maxData.time + maxData.value,
    //     position: [max.time, max.UV],
    //     style: {
    //         text: {
    //             fontSize: 13,
    //             stroke: 'white',
    //             lineWidth: 2
    //         }
    //     },
    //     lineLength: 30
    // });;
    // chartInstance.value.guide().text({
    //     position: [minData.time, minData.value - 5],
    //     content: `${minData.time}: ${minData.value}`,
    //     style: {
    //         fill: 'green',
    //         fontSize: 12
    //     }
    // });

    // chart.point().encode('shape', 'point').tooltip(false);
    // 渲染可视化
    chartInstance.value.render();
}
const init = async () => {
    try {
        customerPeople.value = []
        tablePeople.value = []
        loading.value = true
        await getMapAreaDataTable()
        await getMapAreaDataArea()
        // for (let i in formData.dateOptions) {
        //     await getMapAreaData(formData.dateOptions[i])
        // }
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