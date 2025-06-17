import { message } from './message'

export const downloadImg = function (res, name) {
	try {
		let blob = new Blob([res.data], { type: 'application/octet-stream' }) //type是文件类，详情可以参阅blob文件类型
		// 创建新的URL并指向File对象或者Blob对象的地址
		const blobURL = window.URL.createObjectURL(blob)
		// 创建a标签，用于跳转至下载链接
		const tempLink = document.createElement('a')
		tempLink.style.display = 'none'
		tempLink.href = blobURL
		tempLink.download = name
		tempLink.setAttribute('download', decodeURI(res.headers['content-disposition'].split(';')[1].split('=')[1]))
		// 兼容：某些浏览器不支持HTML5的download属性
		if (typeof tempLink.download === 'undefined') {
			tempLink.setAttribute('target', '_blank')
		}
		// 挂载a标签
		document.body.appendChild(tempLink)
		tempLink.click()
		document.body.removeChild(tempLink)
		// 释放blob URL地址
		window.URL.revokeObjectURL(blobURL)
	} catch (error) {
		console.log(console.error())
		message.error('下载失败')
	}
}
const getBlob = (url) => {
	return new Promise((resolve) => {
		const xhr = new XMLHttpRequest()
		xhr.open('GET', url, true)
		xhr.responseType = 'blob'
		xhr.onload = () => {
			if (xhr.status === 200) {
				resolve(xhr.response)
			}
		}
		xhr.send()
	})
}
/**
 *
 * @param {*} url
 * @param {*} name
 */
export const urlDownFile = async (url, name, across) => {
	try {
		let href = url
		if (across) {
			const blob = await getBlob(url)
			href = window.URL.createObjectURL(blob)
		}
		const lastOf = url.lastIndexOf('/')
		if (!name) name = url.substr(lastOf + 1)
		const a = document.createElement('a')
		a.href = href
		a.download = name // 下载文件的名字
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
	} catch (error) {
		console.log(error)
		message.error('下载失败')
	}
}
