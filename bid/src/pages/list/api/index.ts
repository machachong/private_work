import type * as Map from "./type.ts"
import { request } from "@/http/axios"



export function getBidListApi(data: Map.MapParamsData) {
  return request<any>({
    baseURL: import.meta.env.VITE_BASE_URL_M,
    url: "/zc-bid/bid/list",
    method: "get",
    data
  })
}

export function AddBidListApi(data: Map.MapParamsData) {
  return request<any>({
    baseURL: import.meta.env.VITE_BASE_URL_M,
    url: "/zc-bid/bid/save",
    method: "post",
    data
  })
}

export function editBidListApi(data: Map.MapParamsData) {
  return request<any>({
    baseURL: import.meta.env.VITE_BASE_URL_M,
    url: "/zc-bid/bid/update",
    method: "put",
    data
  })
}

export function deleteBidListApi(data: Map.DeleteData) {
  return request<any>({
    baseURL: import.meta.env.VITE_BASE_URL_M,
    url: `/zc-bid/bid/delete/${data.bidNumber}`,
    method: "delete",
  })
}
export function getInfoBidListApi(data: Map.DeleteData) {
  return request<any>({
    baseURL: import.meta.env.VITE_BASE_URL_M,
    url: `/zc-bid/bid/get/${data.bidNumber}`,
    method: "get",
  })
}
