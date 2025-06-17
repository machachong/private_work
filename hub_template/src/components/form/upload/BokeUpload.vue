<template>
	<el-upload
		v-model:file-list="fileList"
		:headers="headers"
		:action="actionUrl"
		:before-upload="handleBeforeUpload"
		:on-error="handleUploadFail"
		:on-preview="handlePictureCardPreview"
		:on-success="handleUploadSuccess"
		:on-remove="handleRemove"
		:list-type="listType"
		:disabled="disabled"
		:accept="accept"
		:drag="listType === 'picture-card' || drag"
		v-bind="$attrs"
	>
		<div class="upload-content">
			<el-button type="primary" v-if="listType === 'text' || listType === 'picture'">点击上传</el-button>
			<el-icon v-if="listType === 'picture-card'"><Plus /></el-icon>
		</div>
		<template #tip>
			<div class="el-upload__tip">
				{{ tipTextV && `${tipTextV},` }}支持格式：{{ accept }}，单个文件不能超过{{ parseInt(maxSize / 1000000) }}MB
			</div>
		</template>
	</el-upload>
	<boke-dialog v-model="dialogVisible">
		<div class="img-priview">
			<img w-full :src="dialogImageUrl" alt="Preview Image" />
		</div>
	</boke-dialog>
</template>

<script>
import { Plus } from '@element-plus/icons-vue'
import settings from '@/utils/config/settings'
import { getAuthorization } from '@/utils/auth/login'
import { message } from '@/utils/tools'
export default {
	name: 'BokeUpload',
	components: {
		Plus
	},
	props: {
		value: {
			type: Array,
			default: () => []
		},
		uploadUrl: {
			type: String,
			default: '/develop_task/demand_pool/attach_img/'
		},
		maxSize: {
			type: Number,
			default: 10485760 // 默认10M
		},
		listType: {
			type: String,
			default: 'picture-card'
		},
		accept: {
			type: String,
			default: '.png,.jpg,.jpeg,.gif'
		},
		drag: {
			type: Boolean,
			default: false
		},
		tipText: {
			type: String,
			default: ''
		},
		disabled: {
			type: Boolean,
			default: false
		},
		baseUrl: {
			type: String,
			default: ''
		}
	},
	emits: ['onPreview'],
	setup(props, contexts) {
		const tipTextV = computed(() => props.tipText)
		const dialogImageUrl = ref('')
		const dialogVisible = ref(false)
		const fileList = ref(props.value)
		const headers = {
			authorization: getAuthorization()
		}
		const actionUrl = computed(() => {
			if (props.baseUrl) {
				return props.baseUrl
			}
			return settings.API_URL + props.uploadUrl
		})
		const handleBeforeUpload = (file) => {
			// 在文件上传之前判断文件大小，如果过大直接报错
			const size = file.size
			if (size > props.maxSize) {
				message.error(`文件不能超过${parseInt(props.maxSize / 1000000)}M`)
				return false
			}
			return true
		}
		watch(
			() => props.value,
			() => {
				fileList.value = props.value
			}
		)
		const handleUploadSuccess = (response, file, fileList) => {
			console.log(fileList)
			contexts.emit('update:value', fileList)
		}
		const handleRemove = (uploadFile, uploadFiles) => {
			console.log(uploadFiles)
			contexts.emit('update:value', uploadFiles)
		}
		const handleUploadFail = (err, file, fileList) => {
			if (err.message) {
				const resp = JSON.parse(err.message)
				message.error(resp.message)
				console.log(file, fileList)
			} else {
				message.error('文件上传失败')
			}
		}
		const handlePictureCardPreview = (uploadFile) => {
			console.log(uploadFile.url)
			if (props.listType == 'picture' || props.listType == 'picture-card') {
				dialogImageUrl.value = uploadFile.url
				dialogVisible.value = true
			} else {
				contexts.emit('onPreview', uploadFile)
			}
		}
		return {
			fileList,
			headers,
			actionUrl,
			handleBeforeUpload,
			handleUploadSuccess,
			handleUploadFail,
			handlePictureCardPreview,
			dialogVisible,
			dialogImageUrl,
			tipTextV,
			handleRemove
		}
	}
}
</script>

<style scoped lang="scss">
:deep(.el-upload-list),
:deep(.el-upload) {
	padding: 10px 0 0 10px;
}
:deep(.el-upload-list) {
	.el-upload {
		padding: 0;
	}
}
.el-upload__tip {
	padding: 0px 0px 8px 10px;
	line-height: 20px;
}
:deep(.el-upload--picture-card) {
	// width: 100px;
	// height: 100px;
	.el-upload-dragger {
		width: 100%;
		height: 100%;
	}

	.upload-content {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 16px;
	}
}
.img-priview {
	max-width: 1000px;
	max-height: 700px;
	overflow: auto;
	display: flex;
	align-items: center;
	justify-content: center;
	img {
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;
	}
}
</style>
