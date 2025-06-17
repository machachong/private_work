<template>
	<div :style="{ width: width, height: 'auto' }" class="boke-md-editor">
		<!-- <div ref="vditorRef" class="md-editor"></div> -->
		<BokeWangEditor
			:modelValue="turnHtml"
			:height="height"
			pasteIgnoreImg
			mode="simple"
			:read-only="readonly"
			:hideTool="hideTool"
			class="editor-chart"
			placeholder="请输入内容"
			:excludeKeys="contentExcludeKeys"
			@change="changeValue"
			@click="showPreviewImg"
		></BokeWangEditor>
		<boke-dialog title="图片预览" v-model="imgPreview.visible" width="70%">
			<div style="width: 100%; height: 100%">
				<img style="max-width: 100%; max-height: auto" :src="imgPreview.src" alt="" />
			</div>
		</boke-dialog>
	</div>
</template>
<script setup>
// import Vditor from "vditor"
// import "vditor/dist/index.css"
import MarkdownIt from 'markdown-it'
// import TurndownService from "turndown"
import { contentExcludeKeys } from '@/components/demand/config/index'
import { useDemandList } from '@/views/demand/hook/useDemandList'
import { getImageApi } from '@/api/publicApi'
const props = defineProps({
	modelValue: {
		type: String,
		default: ''
	},
	readonly: {
		type: Boolean,
		default: false
	},
	hideTool: {
		type: Boolean,
		default: false
	},
	height: {
		type: String,
		default: '220px'
	},
	width: {
		type: String,
		default: '625px'
	}
})
const { getFeishuDocument } = useDemandList()
// const vditor = ref("")
// const vditorRef = ref()
const turnHtml = ref()
// const turndownService = ref()
const turnMdService = ref()
const urlArrays = ref([])
const imgArrays = ref([])
const imgPreview = ref({
	visible: false,
	src: ''
})
// 提取链接
const resolveMdUrl = (value) => {
	urlArrays.value = []
	return value.replace(/(\[(.[^\]]+)\]\((.[^)]+)\))/g, (rs, $1, $2, $3) => {
		const key = `urlKey${urlArrays.value?.length}`
		urlArrays.value.push({
			key,
			url: $3,
			name: $2 || $3
		})
		return `[${key}](${$3})`
	})
}
// 提取图片
const resolveMdImg = (value) => {
	imgArrays.value = []
	return value.replace(/!\[([^\]]+)\]\(([^)]+)(?:\s*["']([^"']*)["'])?\)/g, (rs, $1, $2) => {
		imgArrays.value.push({
			url: '',
			key: $2
		})
		return `<img src="${$2}" style="max-width: 100%" alt="${$1}" >`
	})
}
// 转换链接
const resolveUrl = async () => {
	try {
		for (let item of urlArrays.value) {
			const res = await getFeishuDocument({
				url: item.url
			})
			if (res?.title) {
				item.name = res.title
			}
		}
		for (let item of imgArrays.value) {
			const res = await getImageApi({
				image_key: item.key
			})
			item.url = res.image_path
		}
	} catch (error) {
		console.log(error)
	}
}
const showPreviewImg = (e) => {
	if (e.target.nodeName === 'IMG') {
		imgPreview.value.visible = true //打开图片放大器开关
		let userAgent = navigator.userAgent //获取浏览器属性
		if (userAgent.indexOf('Chrome') > -1) {
			//Google
			imgPreview.value.src = e.target.currentSrc
		} else {
			//其他
			imgPreview.value.src = e.target.href
		}
	}
}
watch(
	() => props.modelValue,
	(value) => {
		if (value) {
			let newValue = resolveMdUrl(value)
			resolveMdImg(value)
			resolveUrl().then(() => {
				// 替换url
				for (let item of urlArrays.value) {
					newValue = newValue?.replace(item.key, item.name)
				}
				for (let item of imgArrays.value) {
					newValue = newValue?.replace(item.key, item.url)
				}
				let newRes = turnMdService.value?.render(newValue)
				// 替换图片链接
				turnHtml.value = newRes
			})
		}
	},
	{
		immediate: true
	}
)
const emits = defineEmits(['change', 'update:modelValue'])
const changeValue = (val) => {
	emits('update:modelValue', val)
	emits('change', val)
}
onMounted(() => {
	turnMdService.value = new MarkdownIt({
		html: true,
		breaks: true,
		linkify: true,
		langPrefix: 'language-'
	})
})
onUnmounted(() => {
	turnMdService.value = null
})
</script>

<style scoped lang="scss">
:deep(.vditor-reset) {
	padding: 10px !important;
	font-size: 14px;
	& p {
		margin-bottom: 0;
	}
	.vditor-ir__link {
		color: var(--boke-color-main);
	}
}
:deep(.vditor-toolbar) {
	padding-left: 10px !important;
}
:deep(.vditor-toolbar--hide) {
	display: none;
}
:deep(.vditor-ir pre.vditor-reset[contenteditable='false']) {
	opacity: 0.6;
}
:deep(.md-editor) {
	height: 0;
	width: 0;
	opacity: 0;
}
.boke-md-editor {
	white-space: normal;
	word-break: break-all;
	img {
		max-width: 100%;
	}
}
</style>
