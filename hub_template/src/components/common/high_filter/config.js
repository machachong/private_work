export const conditionDict = [
	{
		value: 1,
		label: "等于",
		usable: ["select", "input"]
	},
	{
		value: 2,
		label: "不等于",
		usable: ["select", "input"]
	},
	{
		value: 3,
		label: "包含",
		usable: ["input"]
	},
	{
		value: 4,
		label: "不包含",
		usable: ["input"]
	}
]
export const defaultFilter = {
	prop: null, // 字段
	condition: null, // 条件表达式
	value: null // 值 下拉的话可能是数组
}
export const defaultCondition = {
	value: "default",
	label: "设置",
	isDefault: false,
	condition: [
		{
			...defaultFilter
		}
	]
}
// 获取字典对应翻译
export const getLabel = (options = [], value, key = "label") => {
	try {
		const items = options.find((item) => item.value == value)
		if (!items) return ""
		if (Object.prototype.hasOwnProperty.call(items, key)) return items[key]
		return ""
	} catch (error) {
		console.log(error)
	}
}
