import type * as Map from "./type.ts"
import { request } from "@/http/axios"


export function getMapDataApi(data: Map.MapParamsData) {
  return request<any>({
    // baseURL: 'https://apis.map.qq.com',
    url: "/bigdata/realtime/v1.1/grid_poprank",
    method: "post",
    data
  })
}
export function getMapAreaApi(data: Map.MapParamsData) {
  return request<any>({
    // baseURL: 'https://apis.map.qq.com',
    url: "/bigdata/realtime/v1.1/region",
    method: "post",
    data
  })
}
export function getMapAreaDataApi(data: Map.MapParamsData) {
  return request<any>({
    // baseURL: 'https://apis.map.qq.com',
    url: "/bigdata/realtime/v1.1/region_grid_pop",
    method: "post",
    data
  })
}
export function getPopulationApi(data: Map.MapParamsData) {
  return request<any>({
    // baseURL: 'https://apis.map.qq.com',
    url: "/bigdata/realtime/v1.1/population",
    method: "post",
    data
  })
}
export function getGridBasicinfoApi(data: Map.MapParamsData) {
  return request<any>({
    // baseURL: 'https://apis.map.qq.com',
    url: "/bigdata/realtime/v1.1/grid_basicinfo/list",
    method: "post",
    data
  })
}
// https://apis.map.qq.com/bigdata/realtime/v1.1/grid_basicinfo/list

// https://apis.map.qq.com/bigdata/realtime/v1.1/region_grid_pop
// https://apis.map.qq.com/bigdata/realtime/v1.1/region


// 获取自定义区域所覆盖网格的实时人数
export function getMapAreaDataTableApi(data: Map.MapParamsData) {
  return request<any>({
    baseURL: import.meta.env.VITE_BASE_URL_M,
    url: "/big-data/bigdata/realtime/v1/region_grid_pop",
    method: "post",
    data
  })
}

// 区域实时接口
export function getMapAreaDataAreaApi(data: Map.MapParamsData) {
  return request<any>({
    // baseURL: 'https://apis.map.qq.com',
    baseURL: import.meta.env.VITE_BASE_URL_M,
    url: "/big-data/bigdata/realtime/v1/population",
    method: "post",
    data
  })
}

// 分析区域实时人口的热力分布
export function getLocationpointApi(data: Map.MapParamsData) {
  return request<any>({
    url: "/bigdata/realtime/v1.1/locationpoint",
    method: "post",
    data
  })
}


export function getLocationpointRankApi(data: Map.MapParamsData) {
  return request<any>({
    url: "/bigdata/realtime/v1.1/locationpointrank",
    method: "post",
    data
  })
}