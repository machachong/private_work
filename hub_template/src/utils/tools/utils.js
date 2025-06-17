import { ElLoading } from 'element-plus'
import formate from '@/utils/tools/format.js'
import { hideLoading, showLoading } from '@/utils/tools/loading.js'
import router from '@/router'

const debounce = function (callback, wait = 200, immediate = false) {
	// 闭包
	let submit
	return function () {
		if (submit) clearTimeout(submit)

		// 立即执行的情况
		if (immediate) {
			let trigger = !submit
			submit = setTimeout(() => {
				submit = null
			}, wait)

			if (trigger) {
				// 箭头函数中的this 只取决包裹箭头函数的第一个普通函数的 this
				// 此处this指向的是调用debounce的函数，arguments为this指向函数的arguments
				callback.apply(this, arguments)
			}
			return
		}

		// 不是立即执行的情况
		submit = setTimeout(() => {
			callback.apply(this, arguments)
		}, wait)
		return
	}
}
const jumpTo = function (path, query = null, _blank = false) {
	/*
    _blank为true的时候，会跳转到新页面
  */
	return new Promise((resolve, reject) => {
		if (!_blank) {
			if (query) {
				router
					.push({ path: path, query: query })
					.then(() => {
						resolve()
					})
					.catch((err) => {
						reject(err)
					})
			} else {
				router
					.push(path)
					.then(() => {
						resolve()
					})
					.catch((err) => {
						reject(err)
					})
			}
		} else {
			let url = {
				href: ''
			}
			if (query) {
				url = router.resolve({
					path: path,
					query: query
				})
			} else {
				url = router.resolve({
					path: path
				})
			}
			window.open(url.href, '_blank')
			resolve()
		}
	})
}

const filterName = function (name, kw) {
	// kw和name都转为小写
	name = name.toLowerCase()
	if (kw) {
		kw = kw.toLowerCase()
	}
	if (
		name.indexOf(kw) != -1 ||
		formate.getFullChars(name).toLowerCase().indexOf(kw) != -1 ||
		formate.getCamelChars(name).toLowerCase().indexOf(kw) != -1
	) {
		return true
	}
	return false
}

const filterNameIndex = function (name, kw) {
	// 在模糊匹配之后，返回最小index
	// kw和name都转为小写
	name = name.toLowerCase()
	if (kw) {
		kw = kw.toLowerCase()
	}
	const index = name.indexOf(kw)
	const fullCharsIndex = formate.getFullChars(name).toLowerCase().indexOf(kw)
	const camelCharsIndex = formate.getCamelChars(name).toLowerCase().indexOf(kw)
	if ([index, fullCharsIndex, camelCharsIndex].some((item) => item !== null && item !== undefined && item > -1)) {
		return Math.min(
			...[index, fullCharsIndex, camelCharsIndex].filter((item) => item !== null && item !== undefined && item > -1)
		)
	} else {
		return null
	}
}

// 获取子页面最小宽度
const getMinWidth = function () {
	const widthWeb = document.body.clientWidth
	return widthWeb > 800
}

const getLoadingInstance = (text) => {
	const params = {
		lock: true,
		text: text,
		background: 'rgba(0, 0, 0, 0.7)'
	}
	const loadingInstance = ElLoading.service(params)
	return loadingInstance
}

// 生成唯一数
const getUuid = () => {
	let s = []
	let hexDigits = '0123456789abcdef'
	for (let i = 0; i < 32; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
	}
	s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23]
	s.unshift(Math.round(new Date().getTime() / 1000) + '')
	let uuid = s.join('')
	return uuid
}

const formatBytes = (bytes, fix_num = 2) => {
	if (bytes === 0) return '0 Bytes'
	const k = 1024
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(fix_num)) + ' ' + sizes[i]
}
/**
 *
 * @param {Function} fun 请求的方法
 * @param {String} url  地址
 * @param {Object} params 参数
 * @param {Boolean} params   请求时是否开启全局loading
 * @returns
 */
const fetchData = async (fun, url, params, loading = false, responseAll = false) => {
	return new Promise((resolve, reject) => {
		if (loading) showLoading()
		fun(url, params, { responseAll })
			.then((res) => {
				if (loading) hideLoading()
				return resolve(res)
			})
			.catch((err) => {
				console.log('err', err)
				reject(err)
				if (loading) hideLoading()
			})
	})
}
// 编辑时，赋默认值
const setDefalut = (source = {}, taget = {}) => {
	try {
		const keys = Object.keys(taget)
		for (let i of keys) {
			taget[i] = source[i]
		}
	} catch (error) {
		console.log(error)
	}
}
// 获取字典对应翻译
const getLabel = (options = [], value, key = 'label', val = 'value') => {
	try {
		const items = options.find((item) => item[val] == value)
		if (!items) return ''
		if (Object.prototype.hasOwnProperty.call(items, key)) return items[key]
		return ''
	} catch (error) {
		console.log(error)
	}
}

// 打开飞书云文档
const openFeishuDoc = (url) => {
	let href = url
	const a = document.createElement('a')
	a.target = '_blank'
	a.href = href
	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)
}
// 获取at标签中的邮箱
const getEmail = (str) => {
	const reg = /<at\s+email=([^>]+)/i
	const b = str.match(reg)
	return b && b[1]
}
// 获取at标签中的邮箱
const getId = (str) => {
	const reg = /<at\s+id=([^>]+)/i
	const b = str.match(reg)
	return b && b[1]
}

const dateFormat = function (fmt, date) {
	let ret
	if (!date) {
		return ''
	}
	const opt = {
		'Y+': date.getFullYear().toString(), // 年
		'm+': (date.getMonth() + 1).toString(), // 月
		'd+': date.getDate().toString(), // 日
		'H+': date.getHours().toString(), // 时
		'M+': date.getMinutes().toString(), // 分
		'S+': date.getSeconds().toString() // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	}
	for (let k in opt) {
		ret = new RegExp('(' + k + ')').exec(fmt)
		if (ret) {
			fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'))
		}
	}
	return fmt
}
const dateParse = function (dateStr) {
	// 注意js月份是从0开始的
	const datetimes = dateStr.split(' ')
	const date = datetimes[0].split('-')
	const year = Number(date[0])
	const month = Number(date[1]) - 1
	const day = Number(date[2])

	let hour = 0
	let minute = 0
	let second = 0
	if (datetimes.length > 1) {
		const time = datetimes[1].split(':')
		hour = Number(time[0])
		minute = Number(time[1])
		second = Number(time[2])
	}

	return new Date(year, month, day, hour, minute, second)
}
const formatTimestamp = (timestamp = '2023-01-01 00:00:00') => {
	let _date = ''
	let _time = ''
	if (timestamp.includes(' ')) {
		;[_date, _time] = timestamp.split(' ')
		_time = ' ' + _time
	} else {
		_date = timestamp
	}
	const date = new Date()
	const yDate = new Date()
	const tDate = new Date()
	yDate.setTime(yDate.getTime() - 3600 * 1000 * 24 * 1)
	tDate.setTime(tDate.getTime() + 3600 * 1000 * 24 * 1)
	const today = dateFormat('YYYY-mm-dd', date)
	const yesterday = dateFormat('YYYY-mm-dd', yDate)
	const tomorrow = dateFormat('YYYY-mm-dd', tDate)
	if (_date == today) {
		return '' + _time
	} else if (_date == yesterday) {
		return '昨天' + _time
	} else if (_date == tomorrow) {
		return '明天' + _time
	}
	const nYear = dateFormat('YYYY', date)
	const year = dateFormat('YYYY', dateParse(timestamp))
	if (nYear === year) {
		_date = dateFormat('mm-dd', dateParse(timestamp))
	}
	return _date + _time
}
const checkUrl = function (url) {
	var strRegex = '^((https|http)://)'
	var re = new RegExp(strRegex)
	const ok = re.test(url)
	return ok
}
// 是否是手机端打开
const isMobile = () => {
	const userAgent = navigator.userAgent
	const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
	return mobileRegex.test(userAgent)
}
// 清除浏览器参数
const clearQuery = () => {
	window.history.pushState({}, '', window.location.pathname)
}
// 缓存函数，提升函数
const memoize = (fn) => {
	const cache = {}
	return (...args) => {
		const key = JSON.stringify(args)
		if (!cache[key]) {
			cache[key] = fn(...args)
		}
		return cache[key]
	}
}
// 判断富文本内容是否为空
const getWangEditorEmpty = (str) => {
	console.log('str', str)
	return str
		?.replace(/<[^<p>]+>/g, '') // 将所有<p>标签 replace ''
		.replace(/<[</p>$]+>/g, '') // 将所有</p>标签 replace ''
		.replace(/&nbsp;/gi, '') // 将所有 空格 replace ''
		.replace(/<[^<br/>]+>/g, '') // 将所有 换行符 replace ''
}
export {
	jumpTo,
	filterName,
	filterNameIndex,
	getMinWidth,
	getLoadingInstance,
	getUuid,
	formatBytes,
	fetchData,
	debounce,
	setDefalut,
	getLabel,
	memoize,
	clearQuery,
	isMobile,
	checkUrl,
	formatTimestamp,
	getId,
	getEmail,
	openFeishuDoc,
	getWangEditorEmpty
}
