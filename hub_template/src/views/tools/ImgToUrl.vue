<template>
	<boke-card isFull>
		<boke-title mode="list">图片转URL工具</boke-title>
		<div class="m-t-10">
			<BokeUpload
				v-model:value="formData.attach_img"
				:drag="true"
				tipText="支持粘贴,拖拽上传"
				:baseUrl="settings.API_BOKE_URL + '/public/media/img/'"
			></BokeUpload>
		</div>
		<div class="img-list" v-if="formData.attach_img.length > 0">
			<div class="list-head">
				<div class="title" :span="8">图片名称 </div>
				<div class="url" :span="16">URL</div>
			</div>
			<div class="list-item" v-for="(item, index) in formData.attach_img" :key="index">
				<div class="title" :span="8">{{ item?.response?.data?.filename }}</div>
				<div class="url" :span="16">{{ item?.response?.data?.url }}</div>
				<boke-button type="primary" size="small" @click="handleCopy(item?.response?.data?.url)">复制</boke-button>
			</div>
		</div>
	</boke-card>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import settings from '@/utils/config/settings'
import { message } from '@/utils/tools'
import { uploadImgToServer } from '@/api/publicApi'
const formData = reactive({
	attach_img: []
})
function legacyCopy(text) {
	const textarea = document.createElement('textarea')
	textarea.value = text
	textarea.style.position = 'fixed' // 避免滚动
	document.body.appendChild(textarea)
	textarea.focus()
	textarea.select()
	try {
		const successful = document.execCommand('copy')
		document.body.removeChild(textarea)
		return successful
	} catch (err) {
		console.error('execCommand失败:', err)
		document.body.removeChild(textarea)
		return false
	}
}
const handleCopy = async (text) => {
	const res = legacyCopy(text)
	if (res) {
		message.success('复制成功')
	} else {
		message.error('复制失败')
	}
}
const upload = async (file) => {
	const formData = new FormData()
	formData.append('file', file)
	const res = await uploadImgToServer(formData)
	console.log(res)
	return res
}
onMounted(() => {
	document.addEventListener('paste', function (event) {
		let items = event.clipboardData && event.clipboardData.items
		let file = null
		if (items && items.length) {
			for (var i = 0; i < items.length; i++) {
				if (items[i].type.indexOf('image') !== -1) {
					// 此时file就是剪切板中的图片文件
					file = items[i].getAsFile()
					break
				}
			}
		}
		if (!file) return
		upload(file).then((res) => {
			formData.attach_img.push({
				name: res?.filename || '粘贴上传',
				url: res?.url,
				response: {
					data: res
				}
			})
		})
	})
})
</script>
<style lang="scss" scoped>
.img-list {
	.list-head {
		border-bottom: 1px solid var(--boke-color-border-divider);
		display: flex;
		padding: 10px 0;
		gap: 20px;
		margin-bottom: 10px;
		.title {
			width: 300px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.url {
			flex: 1;
			word-break: break-all;
		}
	}
	.list-item {
		display: flex;
		padding: 6px;
		gap: 20px;
		line-height: 20px;
		.title {
			width: 300px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.url {
			flex: 1;
			word-break: break-all;
		}
		&:hover {
			background-color: var(--boke-table-current-row-bg-color);
		}
	}
}
</style>
