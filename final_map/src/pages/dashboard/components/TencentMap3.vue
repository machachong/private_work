<script setup>
import dayjs from "dayjs"
import { onMounted, onUnmounted, ref, nextTick, computed } from "vue"
import { getGridBasicinfoApi, getMapAreaApi, getMapAreaDataApi, getPopulationApi, getMapDataApi, getLocationpointApi, getLocationpointRankApi, getMapAreaDataTableApi, } from "../api/index"
import BokeChart from "@/components/chart/BokeChart.vue"
import Trend from "../Trend.vue"
import DialogChart from "./DialogChart.vue"
import videoImg from "../images/video.png"
import videoObj from "../images/video.mp4"

const mapkeys = ref(["11260"])
const mapKeysAll = ref(["11260", '4151772519864110784'])
const APP_KEY = "YNDBZ-OWO6Z-QOEXI-7AXSB-HCH4V-6DF6G"
const map = ref()
const windowP = ref([])
const windowObj = ref([])
const setTimer = ref()
const populerData = ref()
const mapCountList = ref()
const activeTime = ref([])
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
  mapCenter: null,
  showChart: true
})
const mapTwo = ref()

function initMap() {
  let center = new TMap.LatLng(cenlat, cenlng)

  // 初始化地图
  map.value = new TMap.Map("container", {
    zoom: 17, // 设置地图缩放级别
    center // 设置地图中心点坐标
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
  windowP.value.forEach((item) => {
    let infoWindow = new TMap.InfoWindow({
      map: map.value,
      position: item.position, // 设置信息框位置
      offset: { x: 150, y: 0 },
      content: `小网格总人数 - ${populerData.value?.time}：${item?.count}` // 设置信息框内容
    })
    let infoWindow2 = new TMap.InfoWindow({
      map: map.value,
      position: item.position2, // 设置信息框位置
      offset: { x: 150, y: -70 },
      content: `LBS区域总人数 - ${populerData.value?.time}：${populerData.value?.value}` // 设置信息框内容
    })



    const obj3 = []
    item.grid_list?.forEach((area, index) => {
      console.log(area);

      const pointe_item_center = area?.point[0]?.grid_location?.center_gcj?.split(",")

      const point_center = new TMap.LatLng(pointe_item_center[0], pointe_item_center[1])
      const pointe_item_left_down = area?.point[0]?.grid_location?.left_down_gcj?.split(",") // 左下
      const pointe_item_right_upper = area?.point[0]?.grid_location?.right_upper_gcj?.split(",") // 右上
      const point_path = [
        new TMap.LatLng(pointe_item_left_down[0], pointe_item_right_upper[1]),
        new TMap.LatLng(pointe_item_left_down[0], pointe_item_left_down[1]),
        new TMap.LatLng(pointe_item_right_upper[0], pointe_item_left_down[1]),
        new TMap.LatLng(pointe_item_right_upper[0], pointe_item_right_upper[1])
      ]

      const areaObj = new TMap.InfoWindow({
        map: map.value,
        position: point_center, // 设置信息框位置
        content: `<div>网格人数：${area.grid_pop}</div><div>面积比：${area?.area_data?.areaRate}%</div>` // 设置信息框内容
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

        formData.value.checkData = area

        initDialog(area)
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

    if (response.status === 0) {
      // polygonGeometries.value = []
      const tempcenter = response.data.center.split(",")
      cenlat = tempcenter[0]
      cenlng = tempcenter[1]


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
  console.log(dayjs().startOf("hour").add(1, "hour").format("YYYY-MM-DD HH:00:00"));

  return dayjs(dayjs().startOf("hour").add(1, "hour").format("YYYY-MM-DD HH:00:00")).unix()
}
async function getMapAreaDataTable(regionIds) {
  const res = await getMapAreaDataTableApi(
    {
      regionIds: regionIds,
      begin: activeTime.value[0],
      end: activeTime.value[1],
      interval: 5,
      key: "e77060506d32a50f28666dc059586d7b402bee85ab25db2a0fec254946fc3f1c"
    }
  )
  const areaRes = res?.data?.regionList[0]?.regionGridList
  console.log(areaRes);

  return areaRes[areaRes?.length - 1]?.gridList
  // if (res?.data?.regionList?.length > 0) {
  // formData.value.activeData = res?.data?.regionList[0]?.regionGridList?.map(item => {
  //   const newList = item.gridList.find(li => li.gridId == gridId)
  //   return {
  //     ...newList,
  //     "时间": dayjs(item.time).format('HH:mm:ss'),
  //     "人数": newList.gridPop,
  //     type: "小网格总人数",
  //     rate: newList.areaRate,
  //   }
  // })
  // }

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
    const areaRes = await getMapAreaDataTable(mapkeys.value)
    if (res.status === 0) {


      windowP.value = res?.data?.region_list.map((item) => {

        return {
          id: item?.region_id,
          grid_list: item?.grid_list?.map(areaItem => {
            const areaData = areaRes?.find(list => list.gridId == areaItem.grid_id)
            return {
              ...areaItem,
              area_data: areaData
            }
          }),
          count: item?.grid_list?.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.grid_pop
          }, 0)
        }
      })
      console.log(windowP.value);
    }
  } catch (err) {
    console.log(err)
  }
}
async function getPopulation(id) {


  const res = await getPopulationApi(
    {
      id,
      begin: activeTime.value[0],
      end: activeTime.value[1],
      interval: 5,
      people_type: "all",
      key: "YNDBZ-OWO6Z-QOEXI-7AXSB-HCH4V-6DF6G"
    }
  )

  populerData.value = res?.data[res?.data?.length - 1]

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
    activeTime.value = [getOneHourAgoTime(), getHourNext()]
    for (let i in mapkeys.value) {
      await getPopulation(mapkeys.value[i])
    }
    await getMapAreaData()
    getRankData()
    windowObj.value.forEach((item) => {
      const getThis = windowP.value?.find(list => list.id == item.id)
      item.obj.setContent(`LBS区域总人数 - ${populerData.value?.time}：${getThis?.count}`)
      item.obj2.setContent(`小网格总人数 - ${populerData.value?.time}：${populerData.value?.value}`)
      if (item?.obj3?.length > 0) {
        item.obj3.forEach((area) => {
          const findArea = getThis?.grid_list?.find(list => list.grid_id == area.grid_id)
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
  ['峰值人数', 90729, 76757, 157945, 191424, 132308]
])
const handleSwitch = async (key) => {
  map.value?.destroy()
  polygonGeometries.value = []
  mapkeys.value = [key]
  localStorage.setItem("mapkey", key);
  location.reload();
}


const centerXy = computed(() => {
  if (formData.value.checkData?.point?.length) {
    return formData.value.checkData?.point[0]?.grid_location?.center_gcj?.split(",")
  }
  return [0, 0]

})


const pointDatas = ref([])
const pointDatasRank = ref([])
const getLocationpoint = async (compareAxis) => {
  try {
    const res = await getLocationpointApi({
      id: mapkeys.value[0],
      begin: activeTime.value[0],
      end: activeTime.value[1],
      interval: 5,
      people_type: "all",
      key: "YNDBZ-OWO6Z-QOEXI-7AXSB-HCH4V-6DF6G"
    })

    pointDatas.value = res?.data[0].points?.map(item => {
      return {
        ...item,
        count: item.weight
      }
    })?.filter(item => {
      // lat,lng
      const x = item.lat > compareAxis.x[0] && item.lat < compareAxis.x[1]
      const y = item.lng > compareAxis.y[0] && item.lng < compareAxis.y[1]
      return x && y
    })
    const rank_res = await getLocationpointRankApi({
      id: "11260",
      begin: activeTime.value[0],
      end: activeTime.value[1],
      interval: 5,
      people_type: "all",
      key: "YNDBZ-OWO6Z-QOEXI-7AXSB-HCH4V-6DF6G"
    })
    pointDatasRank.value = rank_res?.data[0].heatpoints?.map(item => {


      return {
        ...item,
        id: 'label', // 点图形数据的标志信息
        styleId: 'label', // 样式id
        position: new TMap.LatLng(item.lat, item.lng), // 标注点位置
        content: item?.ranking + '', // 标注文本
        properties: {
          // 标注点的属性数据
          title: 'label',
        },
      }
    })?.filter(item => {
      // lat,lng
      const x = item.lat > compareAxis.x[0] && item.lat < compareAxis.x[1]
      const y = item.lng > compareAxis.y[0] && item.lng < compareAxis.y[1]
      return x && y
    })



  } catch (error) { }
}
// 弹窗内折线图
const areaGridId = ref()
const openVideoInNewTab = () => {
  // 视频文件路径
  const videoUrl = videoObj;

  // 打开新标签页
  const newWindow = window.open('', '_blank');

  // 在新标签页写入HTML内容
  newWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>视频播放</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #f0f0f0;
        }
        video {
          max-width: 100%;
          max-height: 100%;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
      </style>
    </head>
    <body>
      <video controls autoplay style="width:100vw;height:100vh;">
        <source src="${videoUrl}" type="video/mp4">
        您的浏览器不支持 HTML5 video 标签。
      </video>
    </body>
    </html>
  `);

  // 关闭文档写入
  newWindow.document.close();
};
const initDialog = async (area) => {
  try {
    console.log(area);

    const compareLoc = area?.point[0].grid_location
    const left_down_gcj = compareLoc?.left_down_gcj.split(",")
    const right_upper_gcj = compareLoc?.right_upper_gcj.split(",")
    const compareAxis = {
      x: [left_down_gcj[0], right_upper_gcj[0]],
      y: [left_down_gcj[1], right_upper_gcj[1]]
    }
    console.log(`该区域范围坐标：左下：${compareLoc.left_down_gcj}，右上：${compareLoc.right_upper_gcj}`);
    mapTwo.value?.destroy()
    mapTwo.value = undefined
    areaGridId.value = area.grid_id
    // const ids = ["17416,64300", '17440,64399']
    // if (!ids.includes(formData.value.checkData.grid_id)) {
    //   return
    // }

    await getLocationpoint(compareAxis)
    areInfoVisible.value = true

    await nextTick()


    mapTwo.value = new TMap.Map("container-dialog", {
      zoom: 19,
      center: new TMap.LatLng(centerXy.value[0], centerXy.value[1])
    });
    let polygonLayer = new TMap.MultiPolygon({
      map: mapTwo.value,
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
    const poi_list = formData.value.checkData?.point[0]?.poi_list?.map(item => {
      return item.poi_category
    })?.flat()

    const countArr = [...pointDatas.value.map(item => item.count)]



    // poi_name
    const heat = new TMap.visualization.Heat({
      max: Math.max(...countArr) ? Math.max(...countArr) : 10, // 热力最强阈值
      min: Math.min(...countArr) || 0, // 热力最弱阈值
      height: 100, // 峰值高度
      gradientColor: { // 渐变颜色
        // 0.6: "#673198",
        // 0.8: "#e53390",
        // 0.9: "#ffc95a",
        0.2: "#91d265",
        0.4: "#ede85a",
        0.6: "#f5a034",
        0.8: "#f62c47"
      },
      radius: 80 // 最大辐射半径

    }).addTo(mapTwo.value);
    heat.setData(pointDatas.value);


    const markerRank = new TMap.MultiLabel({
      id: 'label-layer',
      map: mapTwo.value,
      styles: {
        label: new TMap.LabelStyle({
          color: '#fff', // 颜色属性
          size: 20, // 文字大小属性
          width: 30, //框宽度
          height: 30, // 文字背景框高度
          backgroundColor: '#1E90FF', // 文字背景框颜色属性
          borderWidth: 2, // 文字背景框边线宽度
          borderRadius: 30,  // 文字背景框圆角
          borderColor: '#1E90FF', // 文字背景框边线颜色
        }),
      },
      geometries: pointDatasRank.value,
    });
    let rankPointWindow;
    const eventClick = (e) => {
      rankPointWindow?.close()


      if (e.geometry) {
        const contentRankWindow = `平均客流密度：${e.geometry?.pop_density}/百平方米`

        rankPointWindow = new TMap.InfoWindow({
          map: mapTwo.value,
          position: e.latLng,
          content: contentRankWindow
        });

      }

    }
    // // 5. 添加点击事件监听
    markerRank.on('hover', eventClick)
    const videoMarker = new TMap.MultiMarker({
      id: 'marker-layer-video',
      map: mapTwo.value,
      styles: {
        "marker": new TMap.MarkerStyle({
          "width": 35,
          "height": 35,
          "anchor": { x: 16, y: 32 },
          "src": videoImg
        })
      },
      geometries: [{
        "id": 'demo',
        "styleId": 'marker',
        "position": new TMap.LatLng(31.226473, 121.49165),

      }]
    });
    const vidoeClick = (e) => {
      openVideoInNewTab()
    }
    videoMarker.on('click', vidoeClick)

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


        return {
          styleId: 'big',
          position: new TMap.LatLng(p_xy[0], p_xy[1]),
          content: item.poi_name,
        }
      }),
    });
  } catch (error) {
    console.log(error);
  }
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
  activeTime.value = [getOneHourAgoTime(), getHourNext()]

  initMapData()
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
      <span class="name">公安智慧魔方</span>
      <!-- <span class="count">人数</span> -->
    </li>
    <li v-for="(item, index) in allAreaData" :key="index" :class="{ active: mapkeys.includes(item.id) }"
      @click="handleSwitch(item.id)">
      <!-- <span class="rank">{{ item.rank }}</span> -->
      <span class="name">{{ item.name }}</span>
      <!-- <span class="count">{{ item.grid_pop }}</span> -->
    </li>
  </div>
  <!-- <div class="hot-chart">

    <BokeChart :datas="chartDataCount" type="line"></BokeChart>
  </div> -->
  <div class="line-chart">
    <!-- <BokeChart :datas="chartDataCount" type="line"></BokeChart> -->
    <Trend component></Trend>
  </div>
  <el-drawer v-model="areInfoVisible" title="智慧魔方" size="1000px" :destroy-on-close="true" @close="handleClose">
    <div style="height:auto;width:600px;margin:0 auto">

      <div id="container-dialog" style="height:600px;width:600px"></div>
      <!-- v-if="formData.showChart" -->
      <div style="width:100%; height:35vh;margin-top: 15px;">
        <DialogChart :checkNowData="formData.checkData" :grid_id="areaGridId" :mapkeys="mapkeys"
          :activeTime="activeTime"></DialogChart>
      </div>

      <!-- <DialogMap :area="formData.checkData"></DialogMap> -->
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

.line-chart {
  position: fixed;
  left: 10vw;
  bottom: 20px;
  width: 80vw;
  height: 460px;
  padding: 10px 12px;
  z-index: 1111;
  background: #Fff;
  border-radius: 8px;
}
</style>
