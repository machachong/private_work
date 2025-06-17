/* eslint-disable @typescript-eslint/no-this-alias */
/**
 * echart 工具类
 */
/**
 * 格式化为千，万，百万···
 * @param {值} value
 * @param {转换值} multiple
 * @param {单位} unit
 * @returns
 */
export const formatUnit = (value, multiple, unit) => {
	return (value / multiple).toFixed(2) + unit
}
/**
 *
 * @param {传入的值} text
 * @param {格式化类型} type
 */
export const formatText = (value, type = 0) => {
	switch (type) {
		case 1:
			return value * 100 + "%"
		case 2:
			return (value * 100).toFixed(2) + "%"
		case 3:
			return Number(value).toFixed(2)
		case 4:
			return Math.round(value)
		case 5:
			return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		case 6:
			return formatUnit(value, 1000, "千")
		case 7:
			return formatUnit(value, 10000, "万")
		case 8:
			return formatUnit(value, 1000000, "百万")
		case 9:
			return formatUnit(value, 10000000, "千万")
		case 10:
			return formatUnit(value, 100000000, "亿")
		default:
			return value
	}
}
export default class EchartUtil {
	//正则判断字符串是否为数字
	static checkNum(value) {
		return /^[0-9]*$/.test(value)
	}

	// 生成图例位置
	static getLegendPosition(legend) {
		if (!legend) {
			return {
				left: "center",
				top: "3%",
				orient: "horizontal"
			}
		}
		const { position } = legend
		if (position == "left") {
			return {
				left: "3%",
				orient: "vertical",
				top: "middle"
			}
		}
		if (position == "right") {
			return {
				right: "3%",
				orient: "vertical",
				top: "middle"
			}
		}
		if (position == "bottom") {
			return {
				left: "center",
				bottom: "3%",
				orient: "horizontal"
			}
		}
		return {
			left: "center",
			top: "3%",
			orient: "horizontal"
		}
	}
	// 动态创建Series
	static creatSeries(propOptions, datas, type) {
		const groups = []
		if (type == "pie") datas = [datas, []]
		let newType = type
		if (type === "ring") {
			newType = "pie"
		}
		for (let i = 0; i < datas.length - 1; i++) {
			let item = {}
			item = {
				type: newType,
				smooth: propOptions?.series?.smooth,
				seriesLayoutBy: "row",
				emphasis: { focus: "series" },
				showBackground: propOptions?.series?.showBackground,
				label: {
					show: propOptions?.series?.labelShow,
					position: newType == "pie" ? "outside" : propOptions?.series?.labelPosition,
					formatter: function (value) {
						if (propOptions?.series?.label?.formatter) {
							return propOptions?.series?.label?.formatter(value)
						}
						if (value?.componentSubType == "pie" || type === "ring" || propOptions?.chart_type_id == "2") {
							return `${value.name}: ${value.data[1]} (${value.percent}%)`
						}
						return formatText(value?.data[i + 1], propOptions?.text?.format)
					},
					fontSize: propOptions?.text?.fontSize,
					fontWeight: propOptions?.text?.fontWeight,
					color: propOptions?.text?.color || "#666",
					fontStyle: propOptions?.text?.fontStyle
				},
				itemStyle: {
					borderWidth: 1
				},
				barWidth: propOptions?.series?.barWidth,
				barGap: "15%",
				lineStyle: {
					width: propOptions?.series?.lineStyle?.width,
					type: propOptions?.series?.lineStyle?.type
				},
				symbol: propOptions?.series?.symbol,
				labelLine: {
					normal: {
						show: true
					},
					lineStyle: {
						width: 1, // 增加线宽
						color: "rgba(0,0,0,0.5)" // 可以设置颜色和透明度
					},
					length: propOptions?.series?.labelLine?.length || 15,
					zlevel: 9999 // 设置一个较高的 zlevel 值
				}
			}
			if (propOptions?.series?.maxmin) {
				item.markPoint = {
					data: [
						{ type: "max", name: "Max" },
						{ type: "min", name: "Min" }
					]
				}
			}
			if (propOptions?.series?.markLine) {
				item.markLine = {
					data: [{ type: "average", name: "Avg" }]
				}
			}
			// tyep:2 柱状图堆叠
			if (propOptions?.chart_type_id == "6") {
				item.stack = "x"
			}
			if (propOptions?.series?.stack) {
				item.stack = propOptions?.series?.stack
			}
			// tyep:2 折线面积图
			if (propOptions?.chart_type_id == "4") {
				item.areaStyle = {
					color: propOptions?.series?.areaStyle?.color,
					shadowColor: propOptions?.series?.areaStyle?.shadowColor,
					opacity: propOptions?.series?.areaStyle?.opacity
				}
			}
			if (propOptions?.series?.barLineIndex == i && propOptions?.chart_type_id == "7") {
				item.type = "line"
			}
			// 设置饼图和环形饼图
			if (type === "pie") {
				item.radius = `${propOptions?.series?.radius}%`
			}
			if (type === "ring" || propOptions?.chart_type_id == "2") {
				item.radius = [`${propOptions?.series?.radius - 20}%`, `${propOptions?.series?.radius}%`]
			}
			groups.push(item)
		}
		return groups
	}
	//公用配置
	static getEchartOption(propOptions, datas, type) {
		let echartUtil = this
		return {
			title: {
				...propOptions.title,
				textStyle: {
					fontSize: 14
				}
			},
			tooltip: {
				confine: true,
				trigger: propOptions?.tooltip?.trigger || "axis",
				alwaysShowContent: false,
				show: propOptions?.tooltip?.show,
				// trigger: "item",
				textStyle: {
					fontSize: propOptions?.text?.fontSize,
					fontWeight: propOptions?.text?.fontWeight,
					color: propOptions?.text?.color || "#666",
					fontStyle: propOptions?.text?.fontStyle
				},
				axisPointer: {
					// 坐标轴指示器配置项。
					type: "cross", // 'line' 直线指示器  'shadow' 阴影指示器  'none' 无指示器  'cross' 十字准星指示器。
					axis: "auto", // 指示器的坐标轴。
					snap: true // 坐标轴指示器是否自动吸附到点上
				},
				...propOptions?.tooltip
			},
			legend: {
				show: propOptions?.legend?.show,
				icon: "circle",
				itemHeight: 10,
				itemWidth: 20,
				padding: [8, 0, 0, 0],
				itemGap: 7,
				// formatter: function (name) {
				//   if (typeof value === 'name') return name;
				//   return formatText(name, propOptions?.text?.format);
				// },
				textStyle: {
					fontSize: propOptions?.text?.fontSize,
					fontWeight: propOptions?.text?.fontWeight,
					color: propOptions?.text?.color || "#666",
					fontStyle: propOptions?.text?.fontStyle
				},
				...propOptions?.legend,
				...echartUtil.getLegendPosition(propOptions?.legend)
			},
			grid: propOptions?.grid, // !! 饼图设置边距不生效,需要设置饼图大小来调整边距
			color: propOptions?.color,
			dataset: {
				// dimensions: dimensions.value,
				source: datas
			},
			dataZoom: propOptions?.dataZoom,
			xAxis: {
				show: ["line", "bar"].includes(type) ? propOptions?.xAxis?.show : false,
				type: propOptions?.xAxis?.type ?? "category",
				boundaryGap: true,
				splitLine: {
					show: false,
					lineStyle: {
						color: "#E5E5E5",
						width: 1,
						type: "solid"
					}
				},
				axisLabel: {
					fontSize: propOptions?.text?.fontSize,
					fontWeight: propOptions?.text?.fontWeight,
					color: propOptions?.text?.color || "#9AA2A1",
					fontStyle: propOptions?.text?.fontStyle,
					...propOptions?.xAxis?.axisLabel
				},
				axisLine: {
					shwo: propOptions?.xyAxis?.show,
					lineStyle: {
						color: propOptions?.xyAxis?.axisLine?.color || "#A9AEB8"
					}
				},
				axisTick: {
					show: false
				}
				// data: propOptions?.xAxis?.data,
			},
			yAxis: {
				show: ["line", "bar"].includes(type) ? propOptions?.yAxis?.show : false,
				type: propOptions?.yAxis?.type ?? "value",
				axisLabel: {
					fontSize: propOptions?.text?.fontSize,
					fontWeight: propOptions?.text?.fontWeight,
					color: propOptions?.text?.color || "#666",
					fontStyle: propOptions?.text?.fontStyle
				}
			},
			series: echartUtil.creatSeries(propOptions, datas, type)
		}
	}
}
