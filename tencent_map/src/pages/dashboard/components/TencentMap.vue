<template>
  <div id="mapContainer" style="width: 100%; height: 800px"></div>
</template>
<script setup>
import dayjs from "dayjs"
import { onMounted, ref } from "vue"
import { getMapDataApi } from "../api/index"
import redImg from "../images/red_shadow.png"
import { forEach } from "lodash-es"
const mapCountList = ref()
const acitveTime = ref()
const setTimer = ref()
const initData = async () => {
  try {

    const res = await getMapDataApi({
      adcode: "310000",
      time: acitveTime.value,
      rank_type: 0,
      key: "YNDBZ-OWO6Z-QOEXI-7AXSB-HCH4V-6DF6G",

    })

    mapCountList.value = res.data?.list?.splice(0, 10)

    console.log(mapCountList.value);
  } catch (error) {
    console.log(error);

  }
}
const getTime = () => {
  const now = dayjs();
  // 获取三分钟前的时间
  const threeMinutesAgo = now.subtract(3, 'minute');
  // 将秒和毫秒设置为 0
  const adjustedTime = threeMinutesAgo.set('second', 0).set('millisecond', 0);
  // 获取调整后时间的时间戳
  const timestamp = adjustedTime.unix();

  return timestamp
}
const initMap = () => {
  acitveTime.value = getTime()
  initData().then(() => {
    const markerIcon = new qq.maps.MarkerImage(
      redImg,
      new qq.maps.Size(200, 200),
      new qq.maps.Point(0, 0),
      new qq.maps.Point(80, 0),
      new qq.maps.Size(200, 200)
    );

    // 初始化地图
    const map = new qq.maps.Map(document.getElementById("mapContainer"), {
      center: new qq.maps.LatLng(31.218936, 121.42399),
      zoom: 19, // 设置地图缩放级别
    });






    const latlngs = [

      new qq.maps.LatLng(31.217906, 121.42299),

      new qq.maps.LatLng(31.218936, 121.42398),

      new qq.maps.LatLng(31.219966, 121.42497),
      new qq.maps.LatLng(31.218906, 121.42599),

      new qq.maps.LatLng(31.219936, 121.42698),



    ];


    latlngs?.forEach((po, i) => {
      const item = mapCountList.value[i]
      const marker = new qq.maps.Marker({
        map: map,
        position: po,
        icon: markerIcon,
        title: "愚园路" + item?.rank,
      });
      const content = `<p>人流量： ${item?.grid_pop}</p>`
      const info = new qq.maps.InfoWindow({
        map: map,
        content: `<div style="padding:4px;"><div style="font-size:18px;">愚园路 <span style="font-size:16px;">排名${item.rank}</span></div>${content}</div>`,
        position: po,
      });

      info.open();
      qq.maps.event.addListener(marker, "click", function () {
        if (info.getMap()) {
          info.close();
        } else {
          info.open();
        }
      });


    })

  })
}
onMounted(() => {
  initMap()
  setTimer.value = setInterval(() => {
    initMap()
  }, 60000)

})
onUnmounted(() => {
  clearInterval(setTimer.value)
})
</script>