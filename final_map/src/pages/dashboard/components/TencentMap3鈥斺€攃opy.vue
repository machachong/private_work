<script setup>
import dayjs from "dayjs"
import { onMounted, onUnmounted, ref, nextTick, computed } from "vue"
import { getGridBasicinfoApi, getMapAreaApi, getMapAreaDataApi, getPopulationApi, getMapDataApi } from "../api/index"
import BokeChart from "@/components/chart/BokeChart.vue"
import { Chart } from '@antv/g2';

const dateOptions = ref([{
  label: '2025-04-23',
  value: '2025-04-23',
  datas: [
    {
      "人数": 2991,
      "时间": "09"
    },
    {
      "人数": 5321,
      "时间": 10
    },
    {
      "人数": 6638,
      "时间": 11
    },
    {
      "人数": 7151,
      "时间": 12,
    },
    {
      "人数": 7736,
      "时间": 13
    },
    {
      "人数": 7212,
      "时间": 14,
    },
    {
      "人数": 8454,
      "时间": 15
    },
    {
      "人数": 7232,
      "时间": 16,
    },
    {
      "人数": 5457,
      "时间": 17
    },
    {
      "人数": 3950,
      "时间": 18,
    },
    {
      "人数": 1198,
      "时间": 19
    },
    {
      "人数": 369
      ,
      "时间": 20,
    },
    {
      "人数": 354,
      "时间": 21
    }
  ]
},
{
  label: '2025-04-24',
  value: '2025-04-24',
  datas: [
    {
      "人数": 2161,
      "时间": "09"
    },
    {
      "人数": 4444,
      "时间": 10
    },
    {
      "人数": 5782,
      "时间": 11
    },
    {
      "人数": 5547,
      "时间": 12,
    },
    {
      "人数": 5463,
      "时间": 13
    },
    {
      "人数": 6688,
      "时间": 14,
    },
    {
      "人数": 6199,
      "时间": 15
    },
    {
      "人数": 6079,
      "时间": 16,
    },
    {
      "人数": 3993,
      "时间": 17
    },
    {
      "人数": 2540,
      "时间": 18,
    },
    {
      "人数": 763,
      "时间": 19
    },
    {
      "人数": 90,
      "时间": 20,
    },
    {
      "人数": 114,
      "时间": 21
    }
  ]
}, {
  label: '2025-04-25',
  value: '2025-04-25',
  datas: [
    {
      "人数": 1621,
      "时间": "09"
    },
    {
      "人数": 4366,
      "时间": 10
    },
    {
      "人数": 9827,
      "时间": 11
    },
    {
      "人数": 13775,
      "时间": 12,
    },
    {
      "人数": 15612,
      "时间": 13
    },
    {
      "人数": 14366,
      "时间": 14,
    },
    {
      "人数": 13504,
      "时间": 15
    },
    {
      "人数": 11857,
      "时间": 16,
    },
    {
      "人数": 8776,
      "时间": 17
    },
    {
      "人数": 5021,
      "时间": 18,
    },
    {
      "人数": 2235,
      "时间": 19
    },
    {
      "人数": 30,
      "时间": 20,
    },
    {
      "人数": 127,
      "时间": 21
    }
  ]
},
{
  label: '2025-04-26',
  value: '2025-04-26',
  datas: [
    {
      "人数": 1610,
      "时间": "09"
    },
    {
      "人数": 5728,
      "时间": 10
    },
    {
      "人数": 13924,
      "时间": 11
    },
    {
      "人数": 18224,
      "时间": 12,
    },
    {
      "人数": 21789,
      "时间": 13
    },
    {
      "人数": 22040,
      "时间": 14,
    },
    {
      "人数": 19528,
      "时间": 15
    },
    {
      "人数": 16626,
      "时间": 16,
    },
    {
      "人数": 11563,
      "时间": 17
    },
    {
      "人数": 6301,
      "时间": 18,
    },
    {
      "人数": 2097,
      "时间": 19
    },
    {
      "人数": 90,
      "时间": 20,
    },
    {
      "人数": 30,
      "时间": 21
    }
  ]
}, {
  label: '2025-04-27',
  value: '2025-04-27',
  datas: [
    {
      "人数": 988,
      "时间": "09"
    },
    {
      "人数": 3683,
      "时间": 10
    },
    {
      "人数": 8890,
      "时间": 11
    },
    {
      "人数": 12464,
      "时间": 12,
    },
    {
      "人数": 12763,
      "时间": 13
    },
    {
      "人数": 13304,
      "时间": 14,
    },
    {
      "人数": 12062,
      "时间": 15
    },
    {
      "人数": 10788,
      "时间": 16,
    },
    {
      "人数": 11,
      "时间": 17
    },
    {
      "人数": 11,
      "时间": 18,
    },
    {
      "人数": 11,
      "时间": 19
    },
    {
      "人数": 11,
      "时间": 20,
    },
    {
      "人数": 11,
      "时间": 21
    }
  ]
}
])
const mapkeys = ref(["4151769457318033095"])
const mapKeysAll = ref(["201605","11776","11260","4151769457318033095", "4151759729273286949", "151848", "201966","4151772520509241217","4151772519864110784","4151772430222681079"])
const APP_KEY = "YNDBZ-OWO6Z-QOEXI-7AXSB-HCH4V-6DF6G"
const map = ref()
const windowP = ref([])
const windowObj = ref([])
const setTimer = ref()
const populerData = ref()
const mapCountList = ref()
let cenlat = 0
let cenlng = 0
// 多边形数据
let polygonGeometries = ref([
])
const allAreaData = ref([])
const mapLoading = ref(false)
const loading = ref(false)
const areInfoVisible = ref(false)
const formData = ref({
  date: '2025-04-23',
  checkData: null,
  mapCenter: null
})
const mapTwo = ref()
function initMap() {
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
      offset: { x: 150, y: 0 },
      content: `网格总人数 - ${populerData.value?.time}：${item?.count}` // 设置信息框内容
    })
    let infoWindow2 = new TMap.InfoWindow({
      map: map.value,
      position: item.position2, // 设置信息框位置
      offset: { x: 150, y: -70 },
      content: `自定义总人数 - ${populerData.value?.time}：${populerData.value?.value}` // 设置信息框内容
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
    console.log(item.grid_list)
    const obj3 = []
    item.grid_list?.forEach((area, index) => {

      const pointe_item_center = area?.point[0]?.grid_location?.center_gcj?.split(",")
      console.log(pointe_item_center)
      const point_center = new TMap.LatLng(pointe_item_center[0], pointe_item_center[1])
      const pointe_item_left_down = area?.point[0]?.grid_location?.left_down_gcj?.split(",") // 左下
      const pointe_item_right_upper = area?.point[0]?.grid_location?.right_upper_gcj?.split(",") // 右上
      const point_path = [
        new TMap.LatLng(pointe_item_left_down[0], pointe_item_right_upper[1]),
        new TMap.LatLng(pointe_item_left_down[0], pointe_item_left_down[1]),
        new TMap.LatLng(pointe_item_right_upper[0], pointe_item_left_down[1]),
        new TMap.LatLng(pointe_item_right_upper[0], pointe_item_right_upper[1])
      ]
      console.log(pointe_item_left_down, pointe_item_right_upper)
      const areaObj = new TMap.InfoWindow({
        map: map.value,
        position: point_center, // 设置信息框位置
        content: `网格人数：${area.grid_pop}` // 设置信息框内容
      })

      obj3.push({
        grid_id: area.grid_id,
        obj: areaObj
      })




      const polygon_react = new TMap.MultiPolygon({
        id: `polygon-layer${index}`, // 图层id
        map: map.value, // 显示多边形图层的底图
        styles: {
          // 多边形的相关样式
          polygon: new TMap.PolygonStyle({
            color: "rgba(244,136,110,0.5)", // 面填充色
            showBorder: true, // 是否显示拔起面的边线
            borderColor: "#fff" // 边线颜色
          })
        },
        geometries: [
          {
            id: `polygon${index}`, // 多边形图形数据的标志信息
            styleId: `polygon`, // 样式id
            paths: point_path, // 多边形的位置信息
            properties: {
              // 多边形的属性数据
              title: "polygon"
            }
          }
        ]
      })

      const layerId = polygon_react.id // 获取图层ID
      // 根据输入 LAYER_LEVEL 常量调整 layerId 对应图层的渲染层级 ，其中layerId可以通过图层getId方法获取。TMap.constants.LAYER_LEVEL 代表图层级别常量，见帮助文档（https://lbs.qq.com/webApi/javascriptGL/glDoc/docIndexMap）
      // map.value.moveLayer(layerId, TMap.constants.LAYER_LEVEL.TEXT)
      map.value.moveLayer(layerId, TMap.constants.LAYER_LEVEL.TEXT)
      const eventClick = (event) => {
        console.log(event);
        console.log(area)
        formData.value.checkData = area

        initDialog()
      }
      polygon_react.on('click', eventClick);
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
    windowObj.value.push({
      id: item?.id,
      obj: infoWindow,
      obj2: infoWindow2,
      obj3
    })
    // const marker = new TMap.MultiMarker({
    //   id: "marker-layer",
    //   map: map.value,
    //   styles: {
    //     marker: new TMap.MarkerStyle({
    //       width: 100,
    //       height: 100,
    //       anchor: { x: 16, y: 32 },
    //       src: white_area
    //     })
    //   },
    //   geometries: points
    // })
    // marker.setStyles({ marker: new TMap.MarkerStyle({
    //   width: 70,
    //   height: 70,
    //   src: "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerNew.png",
    //   opacity: 0.5
    // }) })
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
          item.position = new TMap.LatLng(response.data.upper_right.split(",")[0], response.data.upper_right.split(",")[1])
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
      // if (windowP.value?.length) {
      //   windowP.value?.forEach((item) => {
      //     const thisItem = res?.data?.region_list?.find(list => list.region_id == item.id)
      //     item.count = thisItem?.grid_list?.reduce((accumulator, currentValue) => {
      //       return accumulator + currentValue.grid_pop
      //     }, 0)
      //     item.grid_list = thisItem?.grid_list
      //   })
      // } else {
      windowP.value = res?.data?.region_list.map((item) => {
        return {
          id: item?.region_id,
          grid_list: item?.grid_list,
          count: item?.grid_list?.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.grid_pop
          }, 0)
        }
      })
      // }
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
const getRankData = async () => {
  try {

    const res = await getMapDataApi({
      adcode: "310000",
      time: getTime(populerData.value?.time),
      rank_type: 0,
      key: "YNDBZ-OWO6Z-QOEXI-7AXSB-HCH4V-6DF6G",

    })

    mapCountList.value = res.data?.list?.splice(0, 10)
    const grid_ids = mapCountList.value?.map(item => item.grid_id)
    const name_res = await getGridBasicinfo({
      adcode: "310000",
      grid_ids,
      key: "YNDBZ-OWO6Z-QOEXI-7AXSB-HCH4V-6DF6G"
    })
    mapCountList.value.forEach((item, index) => {
      item.grid_name = name_res[index]?.grid_name
    })
  } catch (error) {
    console.log(error);

  }
}

const getAllData = async () => {
  try {
    mapKeysAll.value?.forEach(async (item) => {
      const response = await getMapAreaApi({
        id: item,
        key: APP_KEY
      })
      allAreaData.value.push(response.data)
      console.log(response)
    })
  } catch (err) {
    console.log(err)
  }

}

const initMapData = async () => {
  loading.value = true
  mapLoading.value = false
  getRankData()
  for (let i in mapkeys.value) {
    await getPopulation(mapkeys.value[i])
  }
  mapLoading.value = true
  await getMapAreaData()
  for (let i in mapkeys.value) {
    await postRequest(mapkeys.value[i])
  }
  await getAreaPoint()
  loading.value = false
  initMap()
  setTimer.value = setInterval(async () => {
    for (let i in mapkeys.value) {
      await getPopulation(mapkeys.value[i])
    }
    await getMapAreaData()
    getRankData()
    windowObj.value.forEach((item) => {
      const getThis = windowP.value?.find(list => list.id == item.id)
      item.obj.setContent(`自定义总人数 - ${populerData.value?.time}：${getThis?.count}`)
      item.obj2.setContent(`网格总人数 - ${populerData.value?.time}：${populerData.value?.value}`)
      if (item?.obj3?.length > 0) {
        item.obj3.forEach((area) => {
          const findArea = getThis?.grid_list?.find(list => list.grid_id == area.grid_id)
          console.log(area, findArea)
          area.obj.setContent(`网格人数：${findArea?.grid_pop || 0}`)
        })
      }
    })
    // initMap()
  }, 5 * 60000)
}
const chartData = ref([]);
const chartDataCount = ref([
  ['时间', '0423', '0424', '0425', '0426', '0427'],
  ['峰值人数',90729,76757,157945,191424,132308]
])
const handleSwitch = async (key) => {
  map.value?.destroy()
  polygonGeometries.value = []
  mapkeys.value = [key]
  localStorage.setItem("mapkey", key);
  location.reload();
}
const handleChangeDate = () => {
  const timeData = dateOptions.value?.find(item => item.value == formData.value.date)?.datas
  chartData.value = timeData

}
const centerXy = computed(() => {
  if (formData.value.checkData?.point?.length) {
    return formData.value.checkData?.point[0]?.grid_location?.center_gcj?.split(",")
  }
  return [0, 0]

})
const initChart = () => {
  // 准备数据
  const data = [
    { genre: 'Sports', sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action', sold: 120 },
    { genre: 'Shooter', sold: 350 },
    { genre: 'Other', sold: 150 },
  ];
  // 初始化图表实例
  const chart = new Chart({
    container: 'container-chart',
    autoFit: true
  });

  // 声明可视化
  // chart
  //   .line() // 创建一个 Interval 标记
  //   .data(chartData.value) // 绑定数据
  //   .encode('x', '时间') // 编码 x 通道
  //   .encode('y', '人数'); // 编码 y 通道
  chart
    .data(chartData.value)
    .encode('x', '时间')
    .encode('y', '人数')
    .scale('x', {
      range: [0, 1],
    })
    .scale('y', {
      nice: true,
    })
    .axis('y',)
    .transform({
      type: 'sample',
      thresholds: 200,
      strategy: 'max',
    });

  chart.line().encode('shape', 'smooth');

  chart.point().encode('shape', 'point').tooltip(false);
  // 渲染可视化
  chart.render();
}
const initDialog = async () => {

  mapTwo.value?.destroy()
  mapTwo.value = undefined
  const ids = ["17416,64300", '17440,64399']
  if (!ids.includes(formData.value.checkData.grid_id)) {
    return
  }
  areInfoVisible.value = true

  await nextTick()
  initChart()
  mapTwo.value = new TMap.Map("container-dialog", {
    zoom: 18,
    center: new TMap.LatLng(centerXy.value[0], centerXy.value[1])
  });
  const poi_list = formData.value.checkData?.point[0]?.poi_list?.map(item => {
    return item.poi_category
  })?.flat()
  console.log(poi_list);
  // poi_name

  new TMap.MultiMarker({
    map: mapTwo.value, // 显示Marker图层的底图
    styles: {
      small: new TMap.MarkerStyle({
        // 点标注的相关样式
        width: 34, // 宽度
        height: 46, // 高度
        anchor: { x: 17, y: 23 }, // 标注点图片的锚点位置
        src: 'https://mapapi.qq.com/web/lbs/visualizationApi/demo/img/small.png', // 标注点图片url或base64地址
        color: '#333', // 标注点文本颜色
        size: 16, // 标注点文本文字大小
        direction: 'bottom', // 标注点文本文字相对于标注点图片的方位
        offset: { x: 0, y: 8 }, // 标注点文本文字基于direction方位的偏移属性
        strokeColor: '#fff', // 标注点文本描边颜色
        strokeWidth: 2, // 标注点文本描边宽度
      }),
      big: new TMap.MarkerStyle({
        width: 30,
        height: 38,
        anchor: { x: 36, y: 32 },
        src: 'https://mapapi.qq.com/web/lbs/visualizationApi/demo/img/big.png',
        color: '#333',
        size: 16,
        direction: 'bottom',
        strokeColor: '#fff',
        offset: { x: 0, y: 10 },
        strokeWidth: 2,
      }),
    },
    enableCollision: false, // 开启碰撞
    geometries: poi_list.map((item) => {
      const p_xy = item.location?.split(",") || [0, 0]
      console.log(item);

      return {
        styleId: 'big',
        position: new TMap.LatLng(p_xy[0], p_xy[1]),
        content: item.poi_name,
      }
    }),
  });
}
const handleClose = () => {
  mapTwo.value?.destroy()
}

onMounted(() => {
  const cacheKey = localStorage.getItem("mapkey")
  console.log(cacheKey);
  if (cacheKey) {
    mapkeys.value = [cacheKey]
  }
  getAllData()
  initMapData()
  handleChangeDate()
})

onUnmounted(() => {
  clearInterval(setTimer.value)
})
</script>

<template>
  <div id="container" v-if="mapLoading" v-loading="loading"></div>
  <div class="hot-list">
    <li>
      <!-- <span class="rank">排名</span> -->
      <span class="name">位置</span>
      <!-- <span class="count">人数</span> -->
    </li>
    <li v-for="(item, index) in allAreaData" :key="index" :class="{ active: mapkeys.includes(item.id) }"
        @click="handleSwitch(item.id)">
      <!-- <span class="rank">{{ item.rank }}</span> -->
      <span class="name">{{ item.name }}</span>
      <!-- <span class="count">{{ item.grid_pop }}</span> -->
    </li>
  </div>
  <div class="hot-chart">
    <BokeChart :datas="chartDataCount" type="line"></BokeChart>
  </div>
  <el-drawer v-model="areInfoVisible" title="区域（小网格地图）" size="50%" :destroy-on-close="true" @close="handleClose">
    <div style="height:auto">
      <div id="container-dialog"></div>
      <!-- <DialogMap :area="formData.checkData"></DialogMap> -->
    </div>
    <div style="height:35vh;margin-top: 30px;">
      <el-space>
        <span>切换时间：</span>
        <el-select style="width: 300px" v-model="formData.date" :options="dateOptions" @change="handleChangeDate">
          <el-option v-for="item in dateOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-space>

      <!-- <BokeChart :datas="chartData" type="line"></BokeChart> -->
      <div id="container-chart" style="width:100%;height: 100%;"></div>
    </div>
  </el-drawer>
</template>

<style scoped>
#container {
  width: 100vw;
  height: 100vh;
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
  z-index: 1111;
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
