<template>
	<div class="editor-wrapper" :style="{ width, height, maxHeight }">
		<div class="editor-catalog" v-if="showCatalog && catalogList.length > 0">
			<ul id="catalog-container">
				<li v-for="catalog in catalogList" :key="catalog.id" :type="catalog.type" @click="onCatalogJump(catalog.id)">
					{{ catalog.text }}
				</li>
			</ul>
		</div>
		<div class="editor-container">
			<Toolbar
				v-show="!hideTool"
				ref="toolbarRef"
				style="border-bottom: 1px solid #ccc"
				:editor="editorRef"
				:mode="mode"
				:defaultConfig="toolbarConfig"
			/>
			<Editor
				class="editor-content"
				:model-value="modelValue"
				:defaultConfig="editorConfig"
				:mode="mode"
				@onChange="onChange"
				@update:modelValue="onSync"
				@onCreated="onCreated"
			/>
		</div>
	</div>
</template>

<script>
import { defineComponent, ref, shallowRef, onBeforeUnmount, computed } from 'vue'
import settings from '@/utils/config/settings'
import { getAuthorization } from '@/utils/auth/login'
import './style.css'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar, SlateNode } from './index'

export default defineComponent({
	name: 'WangEditor',
	components: {
		Editor,
		Toolbar
	},
	props: {
		modelValue: String,
		mode: String,
		width: String,
		height: String,
		maxHeight: String,
		readOnly: Boolean,
		showCatalog: Boolean, // 是否显示目录
		hideTool: Boolean,
		pasteIgnoreImg: Boolean,
		placeholder: {
			type: String,
			default() {
				return '请输入内容'
			}
		},
		excludeKeys: {
			type: Array,
			default: () => []
		}
	},
	emits: ['change', 'update:modelValue'],
	setup(props, ctx) {
		const editorRef = shallowRef(null)

		const toolbarRef = shallowRef(null)

		const toolbarConfig = computed(() => {
			return {
				excludeKeys: ['group-video', 'fontSize', 'fontFamily', 'lineHeight', ...props.excludeKeys]
			}
		})

		const catalogList = ref([])

		const onCatalogJump = (id) => {
			editorRef.value?.scrollToElem?.(id)
		}

		const editorConfig = computed(() => {
			const params = {
				placeholder: props.placeholder,
				config: {
					pasteIgnoreImg: props.pasteIgnoreImg
				},
				readOnly: props.readOnly,
				linkCheck: function () {
					return true
				},
				MENU_CONF: {
					uploadImage: {
						// server: settings.API_URL + '/develop_task/demand_pool/attach_img/',
						server: settings.DQ_API_URL + '/public/media/image/upload/',
						fieldName: 'file',
						headers: {
							authorization: getAuthorization()
						}
					},
					codeSelectLang: {
						codeLangs: [
							{ text: 'SQL', value: 'sql' },
							{ text: 'Python', value: 'python' },
							{ text: 'HTML', value: 'html' },
							{ text: 'Markdown', value: '"markdown' },
							{ text: 'Bash', value: '"bash' }
							// 其他
						]
					}
				}
			}
			return params
		})

		const onChange = (editor) => {
			// const toolbar = DomEditor.getToolbar(editor)
			// console.log(111, curToolbarConfig) // 当前菜单排序和分组
			// const curToolbarConfig = toolbar?.getConfig()
			const headers = editor.getElemsByTypePrefix('header')
			catalogList.value = headers.map((header) => {
				const text = SlateNode.string(header)
				const { id, type } = header
				return { id, type, text }
			})
		}

		const onSync = (val) => {
			ctx.emit('update:modelValue', val)
			ctx.emit('change', val)
		}

		const onCreated = (editor) => {
			editorRef.value = editor // 记录 editor 实例，重要！
		}

		onBeforeUnmount(() => {
			editorRef.value?.destroy()
		})
		// 点击直接打开，会影响原来的链接交互
		// watch(
		// 	() => props.modelValue,
		// 	() => {
		// 		if (props.modelValue) {
		// 			// 将所有a链接跳转为点击打开
		// 			nextTick(() => {
		// 				const doms = document.querySelectorAll('.w-e-text-container [data-slate-editor] a')
		// 				doms?.forEach((dom) => {
		// 					dom.addEventListener('click', (e) => {
		// 						e.preventDefault()
		// 						window.open(dom?.href, '_blank')
		// 						// 删除事件绑定
		// 						dom.removeEventListener('click', e)
		// 					})
		// 				})
		// 			})
		// 		}
		// 	},
		// 	{
		// 		immediate: true
		// 	}
		// )
		return {
			editorRef,
			toolbarRef,
			editorConfig,
			toolbarConfig,
			catalogList,
			onCatalogJump,
			onChange,
			onSync,
			onCreated
		}
	}
})
</script>

<style scoped lang="scss">
:deep(.w-e-text-container [data-slate-editor] p) {
	margin: 6px 0;
}
:deep(.w-e-text-placeholder) {
	top: 0px;
	line-height: 34px;
}
:deep(a) {
	color: var(--boke-color-main);
}
:deep(.w-e-modal) {
	padding: 5px;
	.babel-container {
		margin-bottom: 5px;
		span {
			margin-bottom: 0;
			line-height: 1.5;
		}
	}
}
:deep(.w-e-bar-item) {
	padding: 4px 3px;
}
:deep(.w-e-select-list) {
	z-index: 9999;
	position: relative;
}
</style>
