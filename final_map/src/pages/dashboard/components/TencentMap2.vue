<template>
  <div id="container"></div>
  <div id="info" style="width: 100%; height :500px"></div>
</template>
<script setup>
import dayjs from "dayjs"
import { onMounted, onUnmounted,ref } from 'vue';
import { getMapAreaApi, getMapAreaDataApi } from "../api/index"
const mapkeys = ref(['11776', '11260', '17702', '201605', '4151772520509241217', '4151772519864110784', '4151772430222681079'])
const APP_KEY = "YNDBZ-OWO6Z-QOEXI-7AXSB-HCH4V-6DF6G"
// 11776,11260,17702,201605,4151772520509241217,4151772519864110784,4151772430222681079
const map = ref();
const windowP = ref([])
const windowObj = ref([])
const setTimer = ref()
let cenlat = 0
let cenlng = 0
// 多边形数据
let polygonGeometries = ref([
])
function initMap() {
  let info = document.getElementById("info");
  let center = new TMap.LatLng(cenlat, cenlng);

  //初始化地图
  map.value = new TMap.Map("container", {
    zoom: 16, //设置地图缩放级别
    center: center, //设置地图中心点坐标
  });
  windowP.value.forEach((item) => {
    let infoWindow = new TMap.InfoWindow({
      map: map.value,
      position: item.position, //设置信息框位置
      content: `人流量：${item?.count}` //设置信息框内容
    });
    windowObj.value.push({
      id: item?.id,
      obj: infoWindow
    })
  })

  let polygonLayer = new TMap.MultiPolygon({
    map: map.value,
    geometries: polygonGeometries.value,
    styles: {
      // 多边形的相关样式
      polygon: new TMap.PolygonStyle({
        color: '#3777FF', // 面填充色
        showBorder: false, // 是否显示拔起面的边线
        borderColor: '#00FFFF', // 边线颜色
      }),
    },
  })

  // 高亮选中图层
  let highlightLayer = new TMap.MultiPolyline({
    map: map.value,
    zIndex: 1,
    styles: {
      polygon: new TMap.PolylineStyle({
        color: 'rgba(244,136,110,0.8)', // 面填充色
        showBorder: false, // 是否显示拔起面的边线
        // 'borderWidth':20,
        borderColor: '#FF0000', // 边线颜色
      }),
      highlight: new TMap.PolylineStyle({
        'color': 'rgba(244,136,110,0.8)', //填充色
        'width': 4, // 线宽
        "showBorder": false,
        'borderColor': '#fff', //边线颜色
        'borderWidth': 1 //边线宽度
      })
    }
  });

  // 高亮区域
  let highlightGeometry = {
    id: 'highlightGeo',
    styleId: 'highlight'
  }

}
// 实时区域信息接口
async function postRequest(id) {
  try {
    const response = await getMapAreaApi({
      id,
      key: APP_KEY,
    })
    console.log(response, 'responseresponseresponse')
    if (response.status === 0) {
      // polygonGeometries.value = []
      const tempcenter = response.data.center.split(',')
      cenlat = tempcenter[0]
      cenlng = tempcenter[1]
      console.log(tempcenter);

      const arealist = response.data.boundary.split('|')
      const regionarea = {
        'paths': []
      }
   
      
      console.log(windowP.value);
      windowP.value.forEach(item => {
        if (item.id == id) {
          item.position = new TMap.LatLng(response.data.gravity_center.split(',')[0], response.data.gravity_center.split(',')[1])
        }
      })

      for (let index = 0; index < arealist.length; index++) {

        const element = arealist[index];
        const templatlng = element.split(',')
        regionarea['paths'].push({
          "lat": templatlng[0] - 0,
          "lng": templatlng[1] - 0,
          "height": 0
        })
      }

      polygonGeometries.value.push(regionarea)
      console.log(polygonGeometries.value, '------polygonGeometriespolygonGeometries')

    }
  } catch (error) {
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
async function getMapAreaData() {
  try {
    const res = await getMapAreaDataApi(
      {
        "region_ids": mapkeys.value,
        "time": getTime(),
        "key": 'YNDBZ-OWO6Z-QOEXI-7AXSB-HCH4V-6DF6G'
      }
    )
    if (res.status === 0) {
      console.log(res?.data?.region_list);
      if(windowP.value?.length){
        windowP.value?.forEach(item => {
          const thisItem = res?.data?.region_list?.find(list => list.region_id == item.id)
          item.count = thisItem?.grid_list?.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.grid_pop;
          }, 0)
        })
      } else {
        windowP.value = res?.data?.region_list.map(item => {
        return {
          id: item?.region_id,
          count: item?.grid_list?.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.grid_pop;
          }, 0)
        }
      })
      }
     

    }


  } catch (err) {
    console.log(err);

  }
}
onMounted(async () => {
  await getMapAreaData()
    for (let i in mapkeys.value) {
      await postRequest(mapkeys.value[i])
    }
    initMap()
    setTimer.value = setInterval(async () => {
      await getMapAreaData()
      windowObj.value.forEach(item => {
        const getThis = windowP.value?.find(list => list.id == item.id)
       
        item.obj.setContent(`人流量：${getThis?.count}`);
      })
      // initMap()
    }, 60000)
})

onUnmounted(() => {
  clearInterval(setTimer.value)
})
</script>
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