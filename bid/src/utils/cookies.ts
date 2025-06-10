const SYSTEM_NAME = "v3-admin-vite";

/** 缓存数据时用到的 Key */
export class CacheKey {
  static readonly TOKEN = `${SYSTEM_NAME}-token-key`;
  static readonly CONFIG_LAYOUT = `${SYSTEM_NAME}-config-layout-key`;
  static readonly SIDEBAR_STATUS = `${SYSTEM_NAME}-sidebar-status-key`;
  static readonly ACTIVE_THEME_NAME = `${SYSTEM_NAME}-active-theme-name-key`;
  static readonly VISITED_VIEWS = `${SYSTEM_NAME}-visited-views-key`;
  static readonly CACHED_VIEWS = `${SYSTEM_NAME}-cached-views-key`;
}

import Cookies from "js-cookie";

export function getToken() {
  return Cookies.get(CacheKey.TOKEN);
}

export function setToken(token: string) {
  Cookies.set(CacheKey.TOKEN, token);
}

export function removeToken() {
  Cookies.remove(CacheKey.TOKEN);
}
