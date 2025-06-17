<template>
	<div class="pay-content" :class="{ 'pay-content-web': mode === 'web' }">
		<el-empty v-if="!taskData?.length && mode == 'web'" description="暂无交付物"></el-empty>
		<template v-else>
			<ul class="pay-item" v-for="item in taskData" :key="item.feishu_user_id">
				<li><span class="color-title">执行人：</span>{{ getLabel(customUserDict, item.feishu_user_id) }}</li>
				<li>
					<span class="color-title" style="padding-top: 8px">内容：</span>
					<!-- <div class="item-content-wrap" :class="{ mobile: mode == 'mobile' }" v-html="item.task_doc"></div> -->
					<BokeWangEditor
						v-model="item.task_doc"
						maxHeight="450px"
						width="90%"
						readOnly
						pasteIgnoreImg
						mode="simple"
						class="item-content-wrap"
						placeholder="请输入内容"
						:class="{ mobile: mode == 'mobile' }"
						:hideTool="true"
					></BokeWangEditor>
					<!-- <BokeWangEditor
					v-model="item.process_content"
					readOnly
					pasteIgnoreImg
					mode="simple"
					class="process-content m-t-10"
					placeholder="请输入内容"
					:hideTool="true"
				></BokeWangEditor> -->
				</li>
				<li>
					<span class="color-title">附件：</span>
					<div class="item-content">
						<p v-for="(file, index) in getFile(item.task_file_path)" :key="index" @click="downFile(file.url)">
							{{ file.name }}
						</p>
					</div>
				</li>
				<el-divider />
			</ul>
		</template>
	</div>
</template>

<script setup>
import { useDemand } from '@/views/dw_demand/hook/useDemand'
import { getLabel, urlDownFile } from '@/utils/tools'

defineProps({
	taskData: {
		type: Array,
		default: () => []
	},
	customUserDict: {
		type: Array,
		default: () => []
	},
	mode: {
		type: String,
		default: 'mobile'
	}
})

const { resolveFile } = useDemand()

const getFile = (task_file_path) => {
	const fileList = task_file_path?.split(',')?.map((item) => {
		const lastOf = item.lastIndexOf('/')
		const name = item.substr(lastOf + 1)
		return {
			url: item,
			name
		}
	})
	return fileList
}
const downFile = (url) => {
	try {
		const newUrl = resolveFile(url)
		urlDownFile(newUrl)
	} catch (error) {
		console.log(error)
	}
}
</script>

<style scoped lang="scss">
.pay-content {
	max-height: 750px;
	overflow-y: auto;
	.pay-item {
		padding: 6px 0;
		li {
			list-style: none;
			display: flex;
			line-height: 18px;
			align-items: flex-start;
			margin-bottom: 6px;
			span {
				display: block;
				width: 60px;
				white-space: nowrap;
			}
			.item-content {
				// flex: 1;
				width: calc(100% - 60px);
				p {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					color: var(--boke-color-main);
					cursor: pointer;
				}
			}
			.item-content-wrap {
				width: calc(100% - 60px);
				white-space: pre-line;
				background-color: var(--boke-table-th-bg);
				padding: 6px 0px;
				border-radius: 4px;
				min-height: 50px;
				max-height: 450px;
				overflow-y: auto;
				&.mobile {
					padding-left: 0;
					padding-right: 0;
				}
				:deep(a) {
					color: var(--boke-color-main);
				}
				.w-e-text-container {
					padding: 0;
				}
				:deep(.w-e-text-container) {
					padding: 0;
					#w-e-textarea-2 {
						padding: 0;
					}
					p {
						margin: 0;
					}
					.w-e-text-placeholder {
						line-height: 22px;
						display: none;
					}
				}
			}
		}
	}
	&.pay-content-web {
		overflow-y: auto;
		padding: 8px 12px;
		.pay-item {
			li {
				font-size: 14px;
			}
		}
	}
}
.editor-chart {
	max-height: 150px;
	height: auto;
	min-height: 38px;
}
</style>
