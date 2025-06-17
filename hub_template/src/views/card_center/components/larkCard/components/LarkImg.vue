<template>
	<el-image
		class="lark-img"
		:src="imgUrl"
		:width="info?.custom_width || width"
		:height="info?.custom_height || height"
		:zoom-rate="1.2"
		:max-scale="7"
		:min-scale="0.2"
		:preview-src-list="[imgUrl]"
		:initial-index="4"
		fit="cover"
	></el-image>
</template>
<script setup>
import { toRefs, ref, watch } from 'vue'
import { getImageApi } from '@/api/publicApi'
const props = defineProps({
	info: {
		type: Object,
		default: () => ({})
	},
	width: {
		type: String,
		default: '240px'
	},
	height: {
		type: String,
		default: 'auto'
	}
})
const { info } = toRefs(props)
const imgUrl = ref('')
watch(
	() => info.value,
	() => {
		if (!info.value?.img_key) imgUrl.value = null
		getImageApi({ image_key: info.value?.img_key })
			.then((res) => {
				const image_path = res.image_path
				imgUrl.value = image_path
			})
			.catch((err) => {
				console.log(err)
			})
	},
	{
		immediate: true
	}
)
</script>
<style lang="scss" scoped>
.lark-img {
	margin: 6px 0;
}
</style>
