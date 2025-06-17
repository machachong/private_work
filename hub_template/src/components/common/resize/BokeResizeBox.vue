<template>
	<div ref="resize" :class="{ 'resize-vartical': vertical, resize: !vertical }">
		<slot />
		<div ref="resizeHandle" class="handle-resize">
			<!-- <i class="iconfont icon-a-huaban4"></i> -->
		</div>
	</div>
</template>
<script setup>
import { setSession, getSession } from "@/utils/tools"
import { watch } from "vue"
const props = defineProps({
	resizeConf: {
		type: Object,
		default: () => ({
			size: 300, // 初始宽度
			sizeRange: [100, 1000] // 宽度范围
		})
	},
	vertical: {
		type: Boolean,
		default: false
	}, // 默认左右拖动，true为上下拖动
	cache: {
		type: Boolean,
		default: false
	} // 是否开启缓存
})
const { resizeConf, vertical } = toRefs(props)
const resize = ref()
const resizeHandle = ref()
onMounted(() => {
	const size = getSession("card_width")
	if (size) {
		resizeConf.value.size = size
	}
	dragControllerDiv(resize.value, resizeHandle.value)
})
watch(
	() => resizeConf.value?.size,
	() => {
		dragControllerDiv(resize.value, resizeHandle.value)
	},
	{
		immediate: false
	}
)
const dragControllerDiv = (resizeBox, resizeHandle) => {
	if (vertical.value) {
		resizeBox.style.height = resizeConf.value.size + "px"
	} else {
		resizeBox.style.width = resizeConf.value.size + "px"
	}
	// 鼠标按下事件
	resizeHandle.onmousedown = (e) => {
		const resizeWidth = vertical.value ? resizeBox.offsetHeight : resizeBox.offsetWidth
		const startX = vertical.value ? e.clientY : e.clientX // 水平坐标
		// 鼠标拖动事件
		document.onmousemove = (ev) => {
			const moveX = vertical.value ? ev.clientY : ev.clientX
			const moveLen = resizeWidth + (moveX - startX)
			if (resizeConf.value.sizeRange[0] <= moveLen && resizeConf.value.sizeRange[1] >= moveLen) {
				if (vertical.value) {
					resizeBox.style.height = moveLen + "px"
				} else {
					resizeBox.style.width = moveLen + "px"
				}
			}
			if (props.cache) {
				console.log(props.cache)

				setSession("card_width", moveLen)
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
		z-index: 2;
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
.resize-vartical {
	position: relative;
	width: 100%;
	height: auto;
	.handle-resize {
		cursor: row-resize;
		border-top: 1px solid var(--boke-color-text-describe);
		border-bottom: 1px solid var(--boke-color-text-describe);
		border-right: none;
		border-left: none;
		position: absolute;
		left: 50%;
		bottom: -7px;
		width: 100px;
		height: 5px;
		z-index: 2;
	}
	&::after {
		content: "";
		width: 100%;
		height: 1px;
		background-color: var(--boke-color-border-divider);
		position: absolute;
		left: 0;
		bottom: -4.5px;
		z-index: 1;
	}
}
</style>
