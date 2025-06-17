import { systemPre } from "@/utils/config/settings"
export const setSession = (key, value) => {
	sessionStorage.setItem(`${systemPre}${key}`, value)
}
export const getSession = (key) => {
	return sessionStorage.getItem(`${systemPre}${key}`)
}
export const deleteSession = (key) => {
	sessionStorage.removeItem(`${systemPre}${key}`)
}
export const getLocalStorage = (key) => {
	return localStorage.getItem(systemPre + key)
}
export const setLocalStorage = (key, value) => {
	return localStorage.setItem(systemPre + key, value)
}
export const removeLocalStorage = (key) => {
	return localStorage.removeItem(systemPre + key)
}
