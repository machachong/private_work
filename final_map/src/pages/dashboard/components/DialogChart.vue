<template>
    <div>
        <div class="m-b-10">
            <el-space>

                <span>格子面积：</span>
                <span>{{ lastData?.gridArea }}</span>
            </el-space>
        </div>
        <div class="m-b-10">
            <el-space>
                <span>面积比：</span>
                <span>{{ lastData?.areaRate }}%</span>
            </el-space>
        </div>
        <div class="m-b-10">
            <el-space>
                <span>优化后人数：</span>
                <span>{{ lastData?.gridPopNew }}</span>
            </el-space>
        </div>
        <el-space>
            <span>切换时间：</span>

            <el-date-picker style="width: 300px" v-model="formData.date" type="date" placeholder="请选择时间"
                value-format="YYYY-MM-DD" @change="handleChangeDate" :disabled-date="disabledDateMethod" />
        </el-space>



        <div id="container-chart-dialog" style="width:600px;height: 400px;"></div>
    </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';
import { Chart } from '@antv/g2';
import dayjs from "dayjs"
import { getMapAreaDataTableApi } from "../api"
const props = defineProps({
    grid_id: {
        type: String,
        default: ""
    },
    mapkeys: {
        type: Array,
        default: () => []
    },
    activeTime: {
        type: Array,
        default: () => []
    },
    checkNowData: {
        type: Array,
        default: () => []
    }
})
const chartInstanceDialog = shallowRef()
const formData = ref({
    date: null,
    checkData: [],
    activeData: [],
    mapCenter: null,
    showChart: true
})
const lastData = computed(() => {
    console.log(props.checkNowData);
    return props.checkNowData?.area_data
    // return formData.value.checkData[formData.value.checkData?.length - 1]
})
function disabledDateMethod(time) {
    return time.getTime() >= new Date().setHours(0, 0, 0, 0) || time.getTime() < new Date("2025-4-23").setHours(0, 0, 0, 0);
};
const initChart = async () => {
    // 准备数据
    console.log(chartInstanceDialog.value);
    if (chartInstanceDialog.value) {
        await getMapAreaDataTable(props.grid_id)
        chartInstanceDialog.value?.changeData(formData.value.checkData)
        chartInstanceDialog.value.render();
        return
    }
    chartInstanceDialog.value = new Chart({
        container: 'container-chart-dialog',
        autoFit: true,
    });
    chartInstanceDialog.value
        .data(formData.value.checkData)
        .encode('x', '时间')
        .encode('y', '人数')
        .scale('x', {
            range: [0, 1],
        })
        .scale('y', {
            nice: true,
        })
        .legend({
            position: 'top'
        })

    chartInstanceDialog.value.line().encode('shape', 'smooth');
    chartInstanceDialog.value.point().style('fill', 'white').tooltip(false);
    chartInstanceDialog.value.render();
}
async function getMapAreaDataTable(gridId) {

    const begin = dayjs(dayjs(formData.value.date).format("YYYY-MM-DD 00:00:00")).unix()
    const end = dayjs(dayjs(formData.value.date).format("YYYY-MM-DD 23:00:00")).unix()
    const res = await getMapAreaDataTableApi(
        {
            regionIds: props.mapkeys,
            begin: begin,
            end: end,
            interval: 60,
            key: "e77060506d32a50f28666dc059586d7b402bee85ab25db2a0fec254946fc3f1c"
        }
    )
    console.log(res);
    if (res?.data?.regionList?.length > 0) {
        formData.value.checkData = res?.data?.regionList[0]?.regionGridList?.map(item => {
            const newList = item.gridList.find(li => li.gridId == gridId)
            return {
                ...newList,
                "时间": dayjs(item.time).format('HH:mm:ss'),
                "人数": newList.gridPop,
                type: "小网格总人数",
                rate: newList.areaRate,
            }
        })
        console.log(formData.value.checkData);

    }

}
async function getMapAreaDataTableTwo(gridId) {
    const res = await getMapAreaDataTableApi(
        {
            regionIds: props.mapkeys,
            begin: props.activeTime[0],
            end: props.activeTime[1],
            interval: 60,
            key: "e77060506d32a50f28666dc059586d7b402bee85ab25db2a0fec254946fc3f1c"
        }
    )
    console.log(res);
    if (res?.data?.regionList?.length > 0) {
        formData.value.activeData = res?.data?.regionList[0]?.regionGridList?.map(item => {
            const newList = item.gridList.find(li => li.gridId == gridId)
            return {
                ...newList,
                "时间": dayjs(item.time).format('HH:mm:ss'),
                "人数": newList.gridPop,
                type: "小网格总人数",
                rate: newList.areaRate,
            }
        })
        console.log(formData.value.activeData);

    }

}
const handleChangeDate = async () => {
    await getMapAreaDataTable(props.grid_id)
    await getMapAreaDataTableTwo(props.grid_id)
    initChart()


}
onMounted(() => {
    formData.value.date = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    console.log(formData.date);

    handleChangeDate();
});
watch(() => props.grid_id, () => {

})
onUnmounted(() => {
    chartInstanceDialog.value?.destroy()
    chartInstanceDialog.value = undefined
})
</script>
<style lang="scss" scoped>
.m-b-10 {
    margin-bottom: 10px;
}
</style>