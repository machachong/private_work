<template>
	<div ref="boxEle" class="virtual-list-box">
		<div ref="scrollEle" class="virtual-list-scroll">
			<div v-for="(v, i) in curData" :key="i" class="virtual-list-box-item">
				<slot :item="v"></slot>
			</div>
		</div>
	</div>
</template>
<script setup>
import { onMounted, ref, toRefs } from 'vue'

const props = defineProps({
	// 列表数据
	data: {
		type: Array,
		default: () => []
	},
	// 每行占用高度
	itemH: {
		type: Number,
		default: () => 0
	}
})

const { data, itemH } = toRefs(props)

const boxEle = ref(null) //列表外层的容器DOM元素对象
const scrollEle = ref(null) // 列表的容器DOM元素对象
// div可视窗口最多可显示的项数
let maxVisibleNum = 0
// 当前已加载项数
let curItemNum = 0

const curData = ref([])
// 为了更平滑的滚动
let isScrollBusy = false

onMounted(() => {
	start()
})
function start() {
	if (data.value.length === 0) return
	maxVisibleNum = Math.floor(boxEle.value.clientHeight / itemH.value)
	curItemNum = maxVisibleNum * 2
	// 初始化加载显示 （首次加载，分两种情况）
	// 第一种：列表总长度小于 maxVisibleNum*2
	let initNum = data.value.length
	if (maxVisibleNum * 2 <= initNum) {
		// 第二种：可加载长度大于等于列表的总长度
		initNum = maxVisibleNum * 2
		// 注册滚动事件
		boxEle.value.addEventListener('scroll', scrollHandler())
	}
	curData.value = data.value.slice(0, initNum)
}

function scrollHandler() {
	return () => {
		// 滚动事件发生，动态加载列表
		if (isScrollBusy) return
		isScrollBusy = true
		// requestAnimationFrame为了更平滑的滚动, 其实用setTimeout也可以
		window.requestAnimationFrame(() => {
			isScrollBusy = false
			// 滚动条件：滚动到最新加载列表的三分之二处，开始加载下一页列表
			const scrollLine = scrollEle.value.clientHeight - boxEle.value.clientHeight - Math.floor(itemH.value / 3)
			const offsetTop = boxEle.value.scrollTop // 滚动X轴的偏移量
			if (offsetTop >= scrollLine) {
				// 处理列表最后一页的数据
				if (data.value.length > curItemNum + maxVisibleNum) {
					curItemNum += maxVisibleNum
				} else {
					curItemNum = data.value.length
				}
				curData.value = data.value.slice(0, curItemNum)
			}
		})
	}
}
</script>

<style lang="less" scoped>
.virtual-list-box {
	width: 300px;
	height: 300px;
	overflow: auto;
}
.virtual-list-box-item {
	margin: 0px 10px 20px 10px;
}
</style>
