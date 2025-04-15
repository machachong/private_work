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