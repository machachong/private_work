<template>
	<div ref="resize" class="resize">
		<div ref="resizeHandle" class="handle-resize">
			<!-- <i class="iconfont icon-a-huaban4"></i> -->
		</div>
		<slot />
	</div>
</template>
<script setup>
import { onMounted, toRefs } from "vue"
const props = defineProps({
	resizeConf: {
		type: Object,
		default: () => ({
			width: 280, // 初始宽度
			widthRange: [100, 1000] // 宽度范围
		})
	},
	vertical: {
		type: Boolean,
		default: false
	}
})
const { resizeConf } = toRefs(props)
const resize = ref()
const resizeHandle = ref()
onMounted(() => {
	dragControllerDiv(resize.value, resizeHandle.value)
})
const dragControllerDiv = (resizeBox, resizeHandle) => {
	resizeBox.style.width = resizeConf.value.width + "px"
	// 鼠标按下事件
	resizeHandle.onmousedown = (e) => {
		const resizeWidth = resizeBox.offsetWidth
		const startX = e.clientX // 水平坐标
		// 鼠标拖动事件
		document.onmousemove = (ev) => {
			const moveX = ev.clientX
			const moveLen = resizeWidth + (moveX - startX)
			if (resizeConf.value.widthRange[0] <= moveLen && resizeConf.value.widthRange[1] >= moveLen) {
				resizeBox.style.width = moveLen + "px"
			}
		}
		// 鼠标松开事件
		document.onmouseup = function () {
			document.onmousemove = null
			document.onmouseup = null
		}
	}
}
</script>
<style lang="scss" scoped>
.resize {
	position: relative;
	word-wrap: break-word;
	padding-right: 8px;
	height: 100%;
	.handle-resize {
		cursor: col-resize;
		position: absolute;
		right: 0px;
		width: 5px;
		height: 50px;
		border-left: 1px solid var(--boke-color-text-describe);
		border-right: 1px solid var(--boke-color-text-describe);
		top: 40%;
		z-index: 9;
	}
	&::after {
		content: "";
		width: 1px;
		height: 100%;
		background-color: var(--boke-color-border-divider);
		position: absolute;
		right: 2.5px;
		top: 0px;
		z-index: 1;
	}
}
</style>
