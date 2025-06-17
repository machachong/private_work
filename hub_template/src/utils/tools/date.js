import dayjs from 'dayjs'
// 日期相关的通用函数

// 时间格式
const timeShortcuts = [
	{
		text: '今天',
		value: () => {
			const date = new Date()
			const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
			const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
			return [startOfDay, endOfDay]
		}
	},
	{
		text: '昨天',
		value: () => {
			const date = new Date()
			const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
			const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
			startOfDay.setTime(startOfDay.getTime() - 3600 * 1000 * 24 * 1)
			endOfDay.setTime(endOfDay.getTime() - 3600 * 1000 * 24 * 1)
			return [startOfDay, endOfDay]
		}
	},
	{
		text: '过去一周',
		value: () => {
			const date = new Date()
			const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
			const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
			startOfDay.setTime(startOfDay.getTime() - 3600 * 1000 * 24 * 7)
			endOfDay.setTime(endOfDay.getTime() - 3600 * 1000 * 24 * 1)
			return [startOfDay, endOfDay]
		}
	},
	{
		text: '过去一个月',
		value: () => {
			const date = new Date()
			const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
			const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
			startOfDay.setTime(startOfDay.getTime() - 3600 * 1000 * 24 * 30)
			endOfDay.setTime(endOfDay.getTime() - 3600 * 1000 * 24 * 1)
			return [startOfDay, endOfDay]
		}
	},
	{
		text: '过去三个月',
		value: () => {
			const date = new Date()
			const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
			const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
			startOfDay.setTime(startOfDay.getTime() - 3600 * 1000 * 24 * 90)
			endOfDay.setTime(endOfDay.getTime() - 3600 * 1000 * 24 * 1)
			return [startOfDay, endOfDay]
		}
	}
]
// 过去一周卡片
const timeShortcutsWeek = [
	{
		text: '今天',
		value: () => {
			const date = new Date()
			const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
			const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
			return [startOfDay, endOfDay]
		}
	},
	{
		text: '昨天',
		value: () => {
			const date = new Date()
			const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
			const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
			startOfDay.setTime(startOfDay.getTime() - 3600 * 1000 * 24 * 1)
			endOfDay.setTime(endOfDay.getTime() - 3600 * 1000 * 24 * 1)
			return [startOfDay, endOfDay]
		}
	},
	{
		text: '过去三天',
		value: () => {
			const date = new Date()
			const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
			const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
			startOfDay.setTime(startOfDay.getTime() - 3600 * 1000 * 24 * 3)
			endOfDay.setTime(endOfDay.getTime() - 3600 * 1000 * 24 * 1)
			return [startOfDay, endOfDay]
		}
	},
	{
		text: '过去一周',
		value: () => {
			const date = new Date()
			const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
			const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
			startOfDay.setTime(startOfDay.getTime() - 3600 * 1000 * 24 * 7)
			endOfDay.setTime(endOfDay.getTime() - 3600 * 1000 * 24 * 1)
			return [startOfDay, endOfDay]
		}
	}
]
// 时间格式
const dateShortcuts = [
	{
		text: '今天',
		value: new Date()
	},
	{
		text: '昨天',
		value: () => {
			const day = new Date()
			day.setTime(day.getTime() - 3600 * 1000 * 24 * 1)
			return day
		}
	},
	{
		text: '3天前',
		value: () => {
			const day = new Date()
			day.setTime(day.getTime() - 3600 * 1000 * 24 * 3)
			return day
		}
	},
	{
		text: '7天前',
		value: () => {
			const day = new Date()
			day.setTime(day.getTime() - 3600 * 1000 * 24 * 7)
			return day
		}
	}
]
const weekShortcuts = [
	{
		text: '本周',
		value: () => {
			return [
				dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD'),
				dayjs().endOf('week').add(1, 'day').format('YYYY-MM-DD')
			]
		}
	},
	{
		text: '上周',
		value: () => {
			return [
				dayjs().add(-1, 'week').startOf('week').add(1, 'day').format('YYYY-MM-DD'),
				dayjs().add(-1, 'week').endOf('week').add(1, 'day').format('YYYY-MM-DD')
			]
		}
	},
	{
		text: '本月',
		value: () => {
			return [dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format('YYYY-MM-DD')]
		}
	},
	{
		text: '上月',
		value: () => {
			return [
				dayjs().add(-1, 'month').startOf('month').format('YYYY-MM-DD'),
				dayjs().add(-1, 'month').endOf('month').format('YYYY-MM-DD')
			]
		}
	}
]
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
	const month = date[1] ? Number(date[1]) - 1 : 0
	const day = date[2] ? Number(date[2]) : 1

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
// 生成指定日期过去多少天的日期列表
const generateLastDays = (date, day_num) => {
	let result = []
	for (let i = 0; i <= day_num; i++) {
		let day = new Date(date)
		day.setDate(day.getDate() - i)
		result.unshift(day.toISOString().slice(0, 10)) // format date as "yyyy-mm-dd"
	}
	return result
}

// 将秒数转为时分秒
const convertSeconds = (seconds) => {
	let resp = ''
	if (seconds >= 1) {
		const hour = Math.floor(seconds / 3600)
		const minute = Math.floor((seconds % 3600) / 60)
		const second = Number((seconds % 60).toFixed(0))
		if (hour > 0) {
			resp += hour + '小时'
		}
		if (minute > 0) {
			resp += minute + '分'
		}
		if (second > 0) {
			resp += second + '秒'
		}
	} else if (seconds >= 0.001 && seconds < 1) {
		resp = Number((seconds * 1000).toFixed(0)) + '毫秒'
	} else if (seconds >= 0.000001 && seconds < 0.001) {
		resp = Number((seconds * 1000000).toFixed(0)) + '微秒'
	} else {
		resp = Number((seconds * 1000000000).toFixed(0)) + '纳秒'
	}
	return resp
}
// 格式化时间
const formatDate = (date) => {
	return dayjs(date).format('YYYY-MM-DD')
}
/**
 * 对日期数组进行排序
 * @param {*} values
 * @param {*} type 排序方式 asc升序，des降序
 */
const sortDates = (values, type = 'asc') => {
	values.sort((a, b) => {
		const dateA = dayjs(a)
		const dateB = dayjs(b)
		// 根据时间戳进行排序
		return type == 'asc' ? dateA.valueOf() - dateB.valueOf() : dateB.valueOf() - dateA.valueOf()
	})
	return values.map((dt) => dt.toString())
}
const disabledAbortToday = (time) => {
	if (dayjs(time.getTime()).format('YYYY-MM-DD') == dayjs().format('YYYY-MM-DD') || time.getTime() > Date.now()) {
		return false
	}
	return true
}
// 获取当前日期是当月的第几周
function getWeekOfMonth(date = new Date(), weekStartDay = 1) {
	// 转换为dayjs对象
	const currentDate = dayjs(date)

	// 获取当月第一天
	const firstDayOfMonth = currentDate.startOf('month')

	// 计算当月第一天是星期几（0=周日，1=周一...6=周六）
	const firstDayWeekday = firstDayOfMonth.day()

	// 计算当月第一天距离周起始日的偏移量
	const offset = (firstDayWeekday - weekStartDay + 7) % 7

	// 获取当前日期是当月的第几天
	const dayOfMonth = currentDate.date()

	// 计算当前日期是第几周（向上取整）
	return Math.ceil((dayOfMonth + offset) / 7)
}
// 判断是当月的第几个周五
function getFridayOfMonth(date = new Date()) {
	const currentDate = dayjs(date)

	// 获取当月第一天
	const firstDayOfMonth = currentDate.startOf('month')

	// 计算当月第一天是星期几（0=周日，1=周一...6=周六）
	const firstDayWeekday = firstDayOfMonth.day()

	// 计算当月第一个周五的日期（距离第一天的天数差）
	// 如果第一天是周五(5)，则差值为0；否则计算需要加几天到周五
	const diffToFirstFriday =
		firstDayWeekday <= 5
			? 5 - firstDayWeekday // 同一天或之后
			: 5 - firstDayWeekday + 7 // 之前，需要等到下一周

	// 获取当月第一个周五的日期
	const firstFriday = firstDayOfMonth.add(diffToFirstFriday, 'day')

	// 计算当前日期对应的周五（如果今天是周五，直接返回；否则计算下一个周五）
	const currentWeekday = currentDate.day()
	const diffToCurrentFriday =
		currentWeekday <= 5
			? 5 - currentWeekday // 同一天或之后
			: 5 - currentWeekday + 7 // 之前，需要等到下一周

	const currentFriday = currentDate.add(diffToCurrentFriday, 'day')

	// 计算是第几个周五（两个周五之间相差7天，所以除以7加1）
	const fridayCount = Math.floor(currentFriday.diff(firstFriday, 'day') / 7) + 1

	return fridayCount
}
/**
 * 获取指定日期所在ISO周的周一和周日
 * @param {Date|string|number} date - 要计算的日期（默认为今天）
 */
function getWeekRange(date = new Date(), startOfWeek = 0) {
	// const targetDate = dayjs(date)
	// // 获取目标日期是星期几（0-周日，1-周一，...，6-周六）
	// const currentWeekday = targetDate.day()
	// // 计算需要偏移的天数，以获取所在周的第一天
	// // 如果当前周几小于起始日，则需要向前偏移一周
	// let diff = currentWeekday - startOfWeek
	// if (diff < 0) {
	// 	diff += 7
	// }
	// const firstDay = targetDate.subtract(diff, 'day')
	// const weekDays = []
	// // 生成一周的日期
	// for (let i = 0; i < 7; i++) {
	// 	console.log(firstDay.add(i, 'day').format('YYYY-MM-DD'))
	// 	weekDays.push(firstDay.add(i, 'day').format('YYYY-MM-DD'))
	// }
	// return weekDays
	const currentDate = dayjs(date)

	// 计算今天是星期几（0=周日，1=周一...6=周六）
	const weekday = currentDate.day()

	// 计算距离周一的天数差
	// 如果今天是周日(0)，则距离周一差-6天；否则距离周一差1-weekday天
	const diffToMonday = weekday === startOfWeek ? -6 : 1 - weekday
	const diffToSunday = diffToMonday + 6
	// 计算距离周日的天数差（周日是周一之后的第6天）
	const thisWeeks = []

	for (let i = diffToMonday; i <= diffToSunday; i++) {
		const day = currentDate.add(i, 'day')
		thisWeeks.push(day.format('YYYY-MM-DD'))
	}
	// // 获取周一和周日的日期
	// const monday = currentDate.add(diffToMonday, 'day').format('YYYY-MM-DD')
	// const sunday = currentDate.add(diffToSunday, 'day').format('YYYY-MM-DD')

	return thisWeeks
}
export {
	generateLastDays,
	dateShortcuts,
	timeShortcuts,
	timeShortcutsWeek,
	weekShortcuts,
	dateFormat,
	dateParse,
	convertSeconds,
	formatDate,
	sortDates,
	disabledAbortToday,
	getWeekOfMonth,
	getWeekRange,
	getFridayOfMonth
}
