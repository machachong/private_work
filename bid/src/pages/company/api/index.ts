import type * as Map from "./type.ts";
import { request } from "@/http/axios";

export function getCompanyListApi(data: Map.MapParamsData) {
  return request<any>({
    baseURL: import.meta.env.VITE_BASE_URL_M,
    url: "/zc-bid/company/list",
    method: "get",
    data,
  });
}

export function AddCompanyApi(data: Map.MapParamsData) {
  return request<any>({
    baseURL: import.meta.env.VITE_BASE_URL_M,
    url: "/zc-bid/company/save",
    method: "post",
    data,
  });
}

export function editCompanyApi(data: Map.MapParamsData) {
  return request<any>({
    baseURL: import.meta.env.VITE_BASE_URL_M,
    url: "/zc-bid/company/update",
    method: "put",
    data,
  });
}

export function deleteCompanyApi(data: Map.DeleteData) {
  return request<any>({
    baseURL: import.meta.env.VITE_BASE_URL_M,
    url: `/zc-bid/ompany/delete/${data.id}`,
    method: "delete",
  });
}
export function getCompanyDetailApi(params: Map.DeleteData) {
  return request<any>({
    baseURL: import.meta.env.VITE_BASE_URL_M,
    url: `/zc-bid/company/detail`,
    method: "get",
    params,
  });
}
export function getAllCompanyNameApi() {
  return request<any>({
    baseURL: import.meta.env.VITE_BASE_URL_M,
    url: `/zc-bid/company/ilst/companyName`,
    method: "get",
  });
}
export function getTcdeeopyListApi() {
  return request<any>({
    baseURL: import.meta.env.VITE_BASE_URL_M,
    url: `/zc-bid/dict/codeType/list`,
    method: "get",
  });
}
export function getIcdeemotListApi(params: Map.DeleteData) {
  return request<any>({
    baseURL: import.meta.env.VITE_BASE_URL_M,
    url: `/zc-bid/dict/codeItem/list`,
    method: "get",
    params,
  });
}
