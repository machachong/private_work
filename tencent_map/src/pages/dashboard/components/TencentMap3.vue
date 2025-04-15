<script setup>
import dayjs from "dayjs"
import { onMounted, onUnmounted, ref } from "vue"
import { getGridBasicinfoApi, getMapAreaApi, getMapAreaDataApi, getPopulationApi } from "../api/index"
import white_area from "../images/white_area.png"

const mapkeys = ref(["11260"])
const APP_KEY = "YNDBZ-OWO6Z-QOEXI-7AXSB-HCH4V-6DF6G"
// 11776,11260,17702,201605,4151772520509241217,4151772519864110784,4151772430222681079
const map = ref()
const windowP = ref([])
const windowObj = ref([])
const setTimer = ref()
const populerData = ref()
let cenlat = 0
let cenlng = 0
// 多边形数据
let polygonGeometries = ref([
])
function initMap() {
  let info = document.getElementById("info")
  let center = new TMap.LatLng(cenlat, cenlng)

  // 初始化地图
  map.value = new TMap.Map("container", {
    zoom: 17, // 设置地图缩放级别
    center // 设置地图中心点坐标
  })
  windowP.value.forEach((item) => {
    let infoWindow = new TMap.InfoWindow({
      map: map.value,
      position: item.position, // 设置信息框位置
      content: `人流量 - ${populerData.value?.time}：${item?.count}` // 设置信息框内容
    })
    let infoWindow2 = new TMap.InfoWindow({
      map: map.value,
      position: item.position2, // 设置信息框位置
      content: `区域人数 - ${populerData.value?.time}：${populerData.value?.value}` // 设置信息框内容
    })
    windowObj.value.push({
      id: item?.id,
      obj: infoWindow,
      obj2: infoWindow2
    })

    const points = item.grid_list?.map((area, index) => {
      console.log(area)

      const pointe_item_center = area?.point[0]?.grid_location?.center_gcj?.split(",")
      console.log(pointe_item_center)

      const point_center = new TMap.LatLng(pointe_item_center[0], pointe_item_center[1])
      return {
        id: `marker${index}`,
        position: point_center,
        styleId: "marker",
        properties: {
          title: "marker"
        }
      }
      // 图片
      // const markerIcon = new qq.maps.MarkerImage(
      //   white_area,
      //   new qq.maps.Size(200, 200),
      //   new qq.maps.Point(0, 0),
      //   new qq.maps.Point(80, 0),
      //   new qq.maps.Size(200, 200)
      // )
      // const marker = new qq.maps.Marker({
      //   map,
      //   position: point_center,
      //   icon: markerIcon
      // })

      // 圆
      // const circle = new TMap.MultiCircle({
      //   map: map.value,
      //   styles: { // 设置圆形样式
      //     circle: new TMap.CircleStyle({
      //       color: "rgba(244,136,110,0.2)",
      //       showBorder: true,
      //       borderColor: "rgba(244,136,110,0.8)",
      //       borderWidth: 2
      //     })
      //   },
      //   geometries: [{
      //     styleId: "circle",
      //     center: point_center,
      //     radius: 80
      //   }]
      // })
    })
    const marker = new TMap.MultiMarker({
      id: "marker-layer",
      map: map.value,
      styles: {
        marker: new TMap.MarkerStyle({
          width: 100,
          height: 100,
          anchor: { x: 16, y: 32 },
          src: white_area
        })
      },
      geometries: points
    })
    // marker.setStyles({ marker: new TMap.MarkerStyle({
    //   width: 70,
    //   height: 70,
    //   src: "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerNew.png",
    //   opacity: 0.5
    // }) })
  })
  let polygonLayer = new TMap.MultiPolygon({
    map: map.value,
    geometries: polygonGeometries.value,
    styles: {
      // 多边形的相关样式
      polygon: new TMap.PolygonStyle({
        color: "#3777FF", // 面填充色
        showBorder: false, // 是否显示拔起面的边线
        borderColor: "#00FFFF" // 边线颜色
      })
    }
  })

  // 高亮选中图层
  let highlightLayer = new TMap.MultiPolyline({
    map: map.value,
    zIndex: 1,
    styles: {
      polygon: new TMap.PolylineStyle({
        color: "rgba(244,136,110,0.8)", // 面填充色
        showBorder: false, // 是否显示拔起面的边线
        // 'borderWidth':20,
        borderColor: "#FF0000" // 边线颜色
      }),
      highlight: new TMap.PolylineStyle({
        color: "rgba(244,136,110,0.8)", // 填充色
        width: 4, // 线宽
        showBorder: false,
        borderColor: "#fff", // 边线颜色
        borderWidth: 1 // 边线宽度
      })
    }
  })

  // 高亮区域
  let highlightGeometry = {
    id: "highlightGeo",
    styleId: "highlight"
  }
}
// 实时区域信息接口
async function postRequest(id) {
  try {
    const response = await getMapAreaApi({
      id,
      key: APP_KEY
    })
    console.log(response, "responseresponseresponse")
    if (response.status === 0) {
      // polygonGeometries.value = []
      const tempcenter = response.data.center.split(",")
      cenlat = tempcenter[0]
      cenlng = tempcenter[1]
      console.log(tempcenter)

      const arealist = response.data.boundary.split("|")
      const regionarea = {
        paths: []
      }

      windowP.value.forEach((item) => {
        if (item.id == id) {
          item.position = new TMap.LatLng(response.data.gravity_center.split(",")[0], response.data.gravity_center.split(",")[1])
          item.position2 = new TMap.LatLng(response.data.upper_right.split(",")[0], response.data.upper_right.split(",")[1])
        }
      })

      for (let index = 0; index < arealist.length; index++) {
        const element = arealist[index]
        const templatlng = element.split(",")
        regionarea.paths.push({
          lat: templatlng[0] - 0,
          lng: templatlng[1] - 0,
          height: 0
        })
      }

      polygonGeometries.value.push(regionarea)
      console.log(windowP.value)
    }
  } catch (error) {
  }
}
function getTime(time) {
  const now = time ? dayjs(time) : dayjs()
  // 获取三分钟前的时间
  const threeMinutesAgo = now.subtract(3, "minute")
  // 将秒和毫秒设置为 0
  const adjustedTime = threeMinutesAgo.set("second", 0).set("millisecond", 0)
  // 获取调整后时间的时间戳
  const timestamp = adjustedTime.unix()

  return timestamp
}
function getPreviousFiveDivisibleTime() {
  let now = dayjs()
  // 减去五分钟
  now = now.subtract(5, "minute")
  // 计算最近的能被5整除的分钟数
  const newMinutes = Math.floor(now.minute() / 5) * 5
  now = now.minute(newMinutes).second(0).millisecond(0)
  return now
}
function getOneHourAgoTime() {
  return dayjs(dayjs().startOf("hour").format("YYYY-MM-DD HH:00:00")).unix()
}
function getHourNext() {
  return dayjs(dayjs().startOf("hour").add(1, "hour").format("YYYY-MM-DD HH:00:00")).unix()
}
async function getMapAreaData() {
  try {
    const res = await getMapAreaDataApi(
      {
        region_ids: mapkeys.value,
        time: getTime(populerData.value?.time),
        key: "YNDBZ-OWO6Z-QOEXI-7AXSB-HCH4V-6DF6G"
      }
    )
    if (res.status === 0) {
      console.log(res?.data?.region_list)
      if (windowP.value?.length) {
        windowP.value?.forEach((item) => {
          const thisItem = res?.data?.region_list?.find(list => list.region_id == item.id)
          item.count = thisItem?.grid_list?.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.grid_pop
          }, 0)
        })
      } else {
        windowP.value = res?.data?.region_list.map((item) => {
          return {
            id: item?.region_id,
            grid_list: item?.grid_list,
            count: item?.grid_list?.reduce((accumulator, currentValue) => {
              return accumulator + currentValue.grid_pop
            }, 0)
          }
        })
      }
    }
  } catch (err) {
    console.log(err)
  }
}
async function getPopulation(id) {
  console.log(getOneHourAgoTime(), getHourNext())

  const res = await getPopulationApi(
    {
      id,
      begin: getOneHourAgoTime(),
      end: getHourNext(),
      interval: 5,
      people_type: "all",
      key: "YNDBZ-OWO6Z-QOEXI-7AXSB-HCH4V-6DF6G"
    }
  )

  populerData.value = res?.data[res?.data?.length - 1]
  console.log(populerData.value)
}
async function getAreaPoint() {
  const newItem = windowP.value[0]
  for (let i in newItem.grid_list) {
    const res = await getGridBasicinfo({
      adcode: "310000",
      grid_ids: [newItem.grid_list[i].grid_id],
      key: "YNDBZ-OWO6Z-QOEXI-7AXSB-HCH4V-6DF6G"
    })
    newItem.grid_list[i].point = res
  }
}
async function getGridBasicinfo(params) {
  const res = await getGridBasicinfoApi(
    params
  )
  return res?.data?.grid_list
}
onMounted(async () => {
  console.log(getPreviousFiveDivisibleTime())
  for (let i in mapkeys.value) {
    await getPopulation(mapkeys.value[i])
  }
  await getMapAreaData()
  for (let i in mapkeys.value) {
    await postRequest(mapkeys.value[i])
  }
  await getAreaPoint()
  initMap()
  setTimer.value = setInterval(async () => {
    for (let i in mapkeys.value) {
      await getPopulation(mapkeys.value[i])
    }
    await getMapAreaData()
    windowObj.value.forEach((item) => {
      const getThis = windowP.value?.find(list => list.id == item.id)

      item.obj.setContent(`人流量 - ${populerData.value?.time}：${getThis?.count}`)
      item.obj2.setContent(`区域人数 - ${populerData.value?.time}：${populerData.value?.value}`)
    })
    // initMap()
  }, 5 * 60000)
})

onUnmounted(() => {
  clearInterval(setTimer.value)
})
</script>

<template>
  <div id="container" />
  <div id="info" style="width: 100%; height :500px" />
</template>

<style scoped>
html,
body {
  height: 100%;
  margin: 0px;
  padding: 0px;
}

#container {
  width: 100%;
  height: 100%;
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
