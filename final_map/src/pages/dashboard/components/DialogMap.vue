<script setup>

import { computed, onMounted, onUnmounted, ref } from "vue"
const props = defineProps({
    area: {
        type: Object,
        default: () => {
            return {}
        },
    },

})
const map = ref()
const centerXy = computed(() => {
    if (props.area.point?.length) {
        return props.area.point[0]?.grid_location?.center_gcj?.split(",")
    }
    return [0, 0]

})
function initMap() {
    console.log(centerXy.value[0], centerXy.value[1]);
    var mapTwo = new TMap.Map("container-dialog", {
        center: new TMap.LatLng(39.984104, 116.307503)
    });
    // let center = new TMap.LatLng(centerXy.value[0], centerXy.value[1])

    // // 初始化地图
    // map.value = new TMap.Map("container-dialog", {
    //     zoom: 17, // 设置地图缩放级别
    //     center // 设置地图中心点坐标
    // })
    // windowP.value.forEach((item) => {
    //     let infoWindow = new TMap.InfoWindow({
    //         map: map.value,
    //         position: item.position, // 设置信息框位置
    //         offset: { x: 90, y: 0 },
    //         content: `人流量 - ${populerData.value?.time}：${item?.count}` // 设置信息框内容
    //     })
    //     let infoWindow2 = new TMap.InfoWindow({
    //         map: map.value,
    //         position: item.position2, // 设置信息框位置
    //         offset: { x: 90, y: -70 },
    //         content: `区域人数 - ${populerData.value?.time}：${populerData.value?.value}` // 设置信息框内容
    //     })

    //     let polygonLayer = new TMap.MultiPolygon({
    //         map: map.value,
    //         geometries: polygonGeometries.value,
    //         styles: {
    //             // 多边形的相关样式
    //             polygon: new TMap.PolygonStyle({
    //                 color: "#3777FF", // 面填充色
    //                 showBorder: false, // 是否显示拔起面的边线
    //                 borderColor: "#00FFFF" // 边线颜色
    //             })
    //         }
    //     })
    // })

}
onMounted(() => {
    // initMap()
})


</script>

<template>
    QQ11
    <div id="container-dialog"></div>
</template>

<style scoped>
#container {
    width: 100%;
    height: 50vh;
    overflow: hidden;
}

#info {
    display: none;
    position: absolute;
    left: 30px;
    top: 30px;
    background: #fff;
    border-radius: 5px;
    padding: 10px;
}
</style>
<style scoped lang="scss">
.hot-list {
    position: fixed;
    left: 120px;
    top: 120px;
    width: auto;
    max-width: 500px;
    height: auto;
    background: #fff;
    padding: 10px 12px;
    z-index: 999;
    border-radius: 8px;

    li {
        list-style: none;
        display: flex;
        gap: 8px;
        padding: 8px;
        border: 1px solid #fff;
        border-top: 1px solid #ddd;
        cursor: pointer;

        &:hover {
            background-color: rgba(244, 136, 110, 0.4);
            border: 1px solid rgba(244, 136, 110, 1);
        }

        &.active {
            background-color: rgba(244, 136, 110, 0.4);
            border: 1px solid rgba(244, 136, 110, 1);
        }

        &:first-child {
            font-weight: bold;
            border-top: none;
        }

        .rank {
            width: 60px;
            text-align: center;
        }

        .name {
            flex: 1;
        }

        .count {
            width: 100px;
            text-align: center;
        }
    }
}

.hot-chart {
    position: fixed;
    left: 120px;
    bottom: 120px;
    width: 500px;
    height: 300px;
    padding: 10px 12px;
    z-index: 999;
    background: #Fff;
    border-radius: 8px;
}
</style>
