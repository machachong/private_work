<template>
	<div class="comment-input-wrapper">
		<div class="content-editable-wrapper" ref="editor">
			<template v-if="!disabled">
				<vue-tribute :options="options" v-if="showHtml">
					<div
						ref="textarea"
						class="content-editable"
						:style="{ 'min-height': minHeight }"
						contenteditable="plaintext-only"
						@click="getCursorCoordinate"
						@keyup="getCursorCoordinate"
						@input="valueChange"
						@keydown="onKeydown"
						@tribute-active-true="menuOpened = true"
						@tribute-active-false="menuOpened = false"
						:placeholder="placeholder"
						v-html="defaultHtmlValue"
					></div>
				</vue-tribute>
			</template>
			<div
				v-else
				ref="textarea"
				class="content-readonly"
				:style="{ 'min-height': minHeight }"
				v-html="modelValue"
			></div>
			<div class="content-input-count" v-if="limit && !disabled"> {{ modelValue.length }}/{{ limit }} </div>
		</div>
		<div style="margin-top: 5px" v-if="$slots.extra">
			<slot name="extra"></slot>
		</div>
		<div style="margin-top: 5px"></div>
		<div class="comment-input-operations">
			<div class="my-info" v-if="!disabled">
				<el-popover v-if="needEmoji" ref="emojiPopover" placement="top" :width="225" :hide-after="0" trigger="click">
					<div class="emoji-area my-scroll">
						<div
							class="emoji"
							v-for="(item, index) in emoji"
							:key="index"
							:title="item.label"
							@click="insertEmoji(item.value)"
						>
							<span>{{ item.value }}</span>
						</div>
					</div>
					<template #reference>
						<span class="extra-emoji" title="添加表情">
							<i class="iconfont icon-xiaolian"></i>
						</span>
					</template>
				</el-popover>
				<!-- 仅在html模式下可以添加超链接 -->
				<el-popover v-if="html" ref="hrefPopover" placement="top" :width="225" :hide-after="0" trigger="click">
					<el-form>
						<el-form-item>
							<el-input v-model="hrefForm.name" placeholder="链接文本"></el-input>
						</el-form-item>
						<el-form-item>
							<el-input v-model="hrefForm.link" placeholder="链接地址"></el-input>
						</el-form-item>
					</el-form>
					<el-divider></el-divider>
					<div style="text-align: right">
						<boke-button @click="onHrefClose">取消</boke-button>
						<boke-button type="primary" @click="onHrefAdd">确定</boke-button>
					</div>
					<template #reference>
						<span class="extra-emoji" title="添加超链接">
							<i class="iconfont icon-link f-s-22"></i>
						</span>
					</template>
				</el-popover>
				<!-- 额外菜单 -->
				<slot name="extra-menu"></slot>
			</div>
			<div v-if="needAction && !disabled">
				<slot name="action">
					<boke-button @click="handleClose">取消</boke-button>
					<boke-button type="primary" @click="handleSubmit" :loading="submitLoading" :disabled="!canSubmit">
						发送
					</boke-button>
				</slot>
			</div>
		</div>
	</div>
</template>

<script>
import VueTribute from 'vue-tribute'
import { ref, computed, defineComponent, onMounted, watch, nextTick } from 'vue'
import { filterName, debounce } from '@/utils/tools'
import { useMessageCenter } from '@/stores'
import emoji from './emoji'
import { useCtrl, useDelete } from './hook'
import { useHref } from './href'
import { useImg } from './img'

export default defineComponent({
	name: 'CommentInput',
	components: { VueTribute },
	props: {
		modelValue: String,
		taskId: [String, Number],
		spaceId: [String, Number],
		placeholder: {
			type: String,
			default() {
				return '请输入'
			}
		},
		limit: Number,
		submitLoading: Boolean,
		html: Boolean, // 是否输出html
		directSubmit: Boolean, // 是否不判断内容文本直接上传
		// 模式，其中只有mode=pc时有回车提交的逻辑
		mode: {
			type: String,
			validator: (value) => ['pc', 'mobile'].includes(value),
			default: 'pc'
		},
		// 是否需要显示操作，默认显示
		needAction: {
			type: Boolean,
			default() {
				return true
			}
		},
		// 是否能@用户
		canAt: Boolean,
		// 用户选项，由外部输入
		userOptions: {
			type: Array,
			default() {
				return []
			}
		},
		disabled: Boolean,
		minHeight: {
			type: String,
			default: '80px'
		},
		needEmoji: {
			type: Boolean,
			default: true
		}
	},
	emits: ['update:modelValue', 'change', 'submited', 'imgPaste', 'cancle'],
	setup(props, ctx) {
		const messageCenterStore = useMessageCenter()

		const editor = ref(null)

		const textarea = ref(null)

		const emojiPopover = ref(null)

		const fromLocal = ref(false)

		// 记录当前补全菜单是否处于打开状态，如果打开，则按下enter不触发提交事件
		const menuOpened = ref(false)

		/*
      用于记录所有的节点、当前选中的节点以及在选中节点中光标的坐标
      nodes: 所有当前节点
      y: 光标所在节点的index
      x: 在节点中光标的index
    */
		const nowTextNode = ref(null)

		const options = computed(() => {
			return {
				trigger: '@',
				// specify whether a space is required before the trigger string
				requireLeadingSpace: false,
				noMatchTemplate: '<li>暂无数据</li>',
				menuItemTemplate: function (item) {
					return `<div style="display: flex;align-items:center;gap: 2px;"><img style="width:20px;height:20px;" src="${item.original.header_img_url}" /><span>${item.original.label}</span></div>`
				},
				searchOpts: {
					skip: true // true will skip local search, useful if doing server-side search
				},
				values: (text, callback) => {
					console.log(props.userOptions)
					callback(
						props.userOptions.filter((item) => {
							if (!text) {
								return true
							} else {
								return filterName(item.label, text)
							}
						})
					)
				},

				// menuContainer: document.querySelector(".my-body"),
				positionMenu: true,
				menuItemLimit: 200,
				replaceTextSuffix: '',
				selectTemplate: function (item) {
					return `<span contenteditable="false" class="color-main pointer" data-id="${
						item.original.feishu_user_id
					}">@${item.original.label.split(' ')[0]} </span>`
				}
			}
		})

		const defaultHtmlValue = ref('')
		const handleClose = () => {
			messageCenterStore.setCommentVisible(false)
			ctx.emit('cancle')
		}
		function generateHtml() {
			if (!props.html) {
				return props.modelValue.replace(/(@{1})([^@ ]+)( )/g, (res, $1, $2) => {
					return '<span contenteditable="false" class="color-main pointer">@' + $2 + ' </span>'
				})
			}
			return props.modelValue
		}
		defaultHtmlValue.value = generateHtml()
		const showHtml = ref(true)

		watch(
			() => props.modelValue,
			() => {
				if (!fromLocal.value) {
					defaultHtmlValue.value = generateHtml()
					showHtml.value = false
					nextTick(() => {
						showHtml.value = true
						if (props.modelValue) {
							setTimeout(() => {
								getFocusAtLast()
							}, 10)
						}
					})
				} else {
					fromLocal.value = false
				}
			}
		)

		/*
      2023-07-27外部值更新无法触发内部值变化的解释
      在Vue中，当使用`contenteditable`属性将一个DOM元素设置为可编辑时，可以通过`v-on:input`指令来监听该元素的`input`事件。但是，如果将`contenteditable`属性设置为`plaintext-only`，则`input`事件可能会被触发两次。
      这是因为`plaintext-only`属性会限制用户输入的内容只能是纯文本，而且在用户输入时会触发两次`input`事件。第一次触发事件时，事件的`inputType`属性值为`insertText`，表示用户输入了文本内容；第二次触发事件时，事件的`inputType`属性值为`insertLineBreak`，表示用户按下了回车键换行。
      为了避免`input`事件被触发两次，你可以使用`once`修饰符来确保事件只触发一次。例如：
      ```html
      60div contenteditable="plaintext-only" v-on:input.once="handleInput"6260/div62
      ```
      这样，`handleInput`方法只会在第一次`input`事件触发时被调用。
    */
		const valueChange = debounce((e) => {
			getCursorCoordinate(e)
			// 清除残余的 < br > 标签;
			if (deleteOn.value) {
				// message.info("删除");
				// if (e.target?.innerHTML == "<br>") {
				//   e.target.innerHTML = "";
				// }
				// if (e.target?.innerHTML == "\n") {
				//   e.target.innerHTML = "";
				// }
				// // if (
				// //   e.target.innerHTML &&
				// //   [...new Set(e.target.innerHTML.split(""))].length === 1 &&
				// //   [...new Set(e.target.innerHTML.split(""))][0] === "\n"
				// // ) {
				// //   e.target.innerHTML = "";
				// // }
				// if (e.innerHTML == "<br>") {
				//   e.innerHTML = "";
				// }
				// if (e.innerHTML === "\n") {
				//   e.innerHTML = "";
				// }
			}
			const textContent = props.html
				? e.target?.innerHTML || e.innerHTML || ''
				: e.target?.textContent || e.textContent || ''
			/*
        为了适配手机端，从判断是否按下backspace键改为判断内容长度变化来判定是否为删除
      */
			let text = textContent
			if (text?.length < props.modelValue?.length) {
				// 删除
				if (text == '<br>') {
					text = ''
					if (e.target) {
						e.target.innerHTML = ''
					} else if (e.innerHTML) {
						e.innerHTML = ''
					}
				}
				if (text == '\n') {
					text = ''
					if (e.target) {
						e.target.innerHTML = ''
					} else if (e.innerHTML) {
						e.innerHTML = ''
					}
				}
			}
			// const text = textContent.replace(/\&nbsp;/g, " ");
			handleSync(text)
		}, 50)

		const isMoveFocus = ref(false)

		// 获取光标所在位置并加以记录
		function getCursorCoordinate(elem, offsetY = 0, offsetX = 0) {
			if (isMoveFocus.value) {
				return
			}
			const el = elem.target || elem
			function getNodeList(el) {
				return Array.from(el.childNodes)
			}
			const nodeList = getNodeList(el)
			const selection = window.getSelection()
			const cursorIndex = getNodeList(el).findIndex(
				(node) => node.firstChild === selection.anchorNode || node === selection.anchorNode
			)
			const cursorOffset = selection.anchorOffset
			const textNode = {
				nodes: nodeList,
				x: cursorOffset + offsetX,
				y: cursorIndex + offsetY
			}
			nowTextNode.value = textNode
			return textNode
		}

		// 在记录的光标处插入数据或者在末尾插入数据
		function insert(content) {
			if (nowTextNode.value) {
				const node = nowTextNode.value.nodes[nowTextNode.value.y]
				const index = nowTextNode.value.x
				if (node && node.textContent) {
					node.textContent =
						node.textContent.substring(0, index) + content + node.textContent.substring(index, node.textContent.length)
					moveFocus(content.length)
					getCursorCoordinate(textarea.value)
				} else {
					textarea.value.innerHTML += content
					getFocusAtLast()
				}
			} else {
				textarea.value.innerHTML += content
				getFocusAtLast()
			}
			valueChange(textarea.value)
		}

		// 换行
		function insertLine() {
			console.log('insertLine', nowTextNode.value)
			if (nowTextNode.value) {
				const node = nowTextNode.value.nodes[nowTextNode.value.y]
				const index = nowTextNode.value.x
				if (node && node.textContent) {
					if (index === node.textContent.length && nowTextNode.value.y + 1 === nowTextNode.value.nodes.length) {
						console.log('insert \n\n')
						insert('\n\n')
					} else {
						console.log('insert \n')
						insert('\n')
					}
				} else {
					if (
						nowTextNode.value.nodes &&
						nowTextNode.value.nodes[nowTextNode.value.nodes.length - 1] &&
						!nowTextNode.value.nodes[nowTextNode.value.nodes.length - 1].textContent
					) {
						insertHTML('\n\n')
					} else if (nowTextNode.value.nodes.length === 0) {
						insertHTML('\n\n')
					} else {
						insertHTML('\n')
					}
				}
			}
		}

		// 插入html
		function insertHTML(html) {
			if (nowTextNode.value) {
				const node = nowTextNode.value.nodes[nowTextNode.value.y]
				const index = nowTextNode.value.x
				if (node && node.nodeName === '#text') {
					// console.log("父节点", node.parentNode);
					// console.log("子节点", nowTextNode.value.nodes);
					const children = nowTextNode.value.nodes.map((item) => {
						return item.nodeName === '#text' ? item.textContent : item.outerHTML // outerHTML是获取该节点本身的html内容
					})
					children[nowTextNode.value.y] =
						node.textContent.substring(0, index) + html + node.textContent.substring(index, node.textContent.length)
					// 必须修改父节点的innerHTML才行
					node.parentNode.innerHTML = children.join('')
					console.log(nowTextNode.value)
					const offsetY = nowTextNode.value.nodes[Math.max(0, nowTextNode.value.y - 1)]?.nodeName === '#text' ? 3 : 2
					getCursorCoordinate(textarea.value, nowTextNode.value.y + offsetY, 0)
					console.log(nowTextNode.value)
					moveFocus()
				} else {
					textarea.value.innerHTML += html
					getFocusAtLast()
				}
			} else {
				textarea.value.innerHTML += html
				getFocusAtLast()
			}
			valueChange(textarea.value)
		}

		function insertEmoji(emoji) {
			insert(emoji)
			emojiPopover.value?.hide?.()
		}

		/*
      2023-06-30 新增超链接的添加
    */
		const { hrefPopover, hrefForm, onHrefClose, onHrefAdd, onHrefPaste } = useHref((val) => {
			insertHTML(val)
		})

		/*
      2023-08-23 新增图片的复制
    */
		const { onImgPaste } = useImg()

		onMounted(() => {
			// 粘贴超链接事件处理
			onHrefPaste(textarea, (html, content) => {
				if (props.html) {
					insertHTML(html)
				} else {
					insert(content)
				}
			})
			onImgPaste(textarea, (files = []) => {
				ctx.emit('imgPaste', files)
			})
		})

		// 恢复光标先前位置，offset为相较于先前位置的偏移
		function moveFocus(offset = 0) {
			if (nowTextNode.value) {
				if (nowTextNode.value.y >= nowTextNode.value.nodes.length) {
					return getFocusAtLast()
				}
				if (nowTextNode.value.nodes[nowTextNode.value.y]?.nodeName !== '#text') {
					getFocusAtLast(nowTextNode.value.nodes[nowTextNode.value.y])
				}
				isMoveFocus.value = true
				textarea.value.focus()
				const selection = window.getSelection()
				const cursorOffset = nowTextNode.value.x + offset
				const nodeLength = nowTextNode.value.nodes[nowTextNode.value.y]?.textContent?.length || 0
				selection.setPosition(nowTextNode.value.nodes[nowTextNode.value.y], Math.min(cursorOffset, nodeLength))
				isMoveFocus.value = false
			} else {
				getFocusAtLast()
			}
		}

		// function getFocusAtNodeLast(node) {
		// 	textarea.value.focus()
		// 	if (window.getSelection) {
		// 		const selection = window.getSelection() //创建range
		// 		selection.addRange
		// 	}
		// }

		// 光标在最后
		function getFocusAtLast() {
			textarea.value.focus()
			const box2 = textarea.value
			if (window.getSelection) {
				//ie11 10 9 ff safari
				const selection = window.getSelection() //创建range
				selection.selectAllChildren(box2) //range 选择box2下所有子内容
				selection.collapseToEnd() //光标移至最后
			} else if (document.selection) {
				//ie10 9 8 7 6 5
				const range = document.selection.createRange() //创建选择对象
				range.moveToElementText(box2) //range定位到obj
				range.collapse(false) //光标移至最后
				range.select()
			}
		}

		// 聚焦
		const focus = (atLast = false) => {
			if (atLast) {
				getFocusAtLast()
			} else {
				textarea.value?.focus?.()
			}
		}

		// ctrl按键判定
		const ctrlOn = useCtrl()

		// 删除键判定
		const deleteOn = useDelete()

		function onKeydown(e) {
			// enter 直接提交
			if (e.key == 'Enter' && !menuOpened.value) {
				if (props.mode !== 'mobile') {
					if (ctrlOn.value) {
						e.preventDefault()
						insertLine()
						return
					} else {
						e.preventDefault()
						handleSubmit()
						return
					}
				} else {
					return
				}
			}
			// 删除
			// if (e.key == "Backspace") {
			// }
			// 禁止shift呼出vtribute
			if (e.key == 'Shift') {
				// console.log("Shift, tribute menu: ", menuOpened.value);
				// console.log(tribute.value.el);
				e.preventDefault()
				e.stopPropagation()
				e.stopImmediatePropagation()
				return
			}
			// 字数限制
			if (!props.limit) {
				return
			}
			if (props.modelValue?.length >= props.limit) {
				if (e.key != 'Backspace') {
					e.preventDefault()
					return
				}
			}
		}

		function handleSync(val) {
			fromLocal.value = true
			ctx.emit('update:modelValue', val)
			ctx.emit('change', val)
		}

		const canSubmit = computed(() => {
			return props.directSubmit || props.modelValue?.length > 0
		})

		function handleSubmit() {
			ctx.emit('submited')
		}

		return {
			editor,
			textarea,
			emojiPopover,
			emoji,
			menuOpened,
			nowTextNode,
			options,
			defaultHtmlValue,
			showHtml,
			valueChange,
			onKeydown,
			getCursorCoordinate,
			focus,
			insert,
			insertEmoji,
			canSubmit,
			handleSubmit,
			hrefPopover,
			hrefForm,
			onHrefClose,
			onHrefAdd,
			handleClose
		}
	}
})
</script>

<style scoped lang="scss">
:deep(.el-button:not(.is-circle):not(.el-button--text):not(.is-link):not(.el-button--small)) {
	min-width: 56px;
}

.el-divider--horizontal {
	margin: 8px 0;
}

.comment-input-wrapper {
	width: 100%;
}
.content-readonly {
	line-height: 1.5;
	padding: 5px 11px;
	box-sizing: border-box;
	font-size: 13px;
	white-space: pre-line;
	outline: 0;
}
.content-readonly:empty::before {
	content: '-';
	color: var(--boke-color-describe);
}
.content-editable-wrapper {
	width: 100%;
	position: relative;
	:deep(a) {
		color: var(--boke-color-main);
	}
}
.content-editable {
	line-height: 1.5;
	padding: 5px 11px;
	box-sizing: border-box;
	border-radius: 4px;
	border: 1px solid #dedfe6;
	/* box-shadow: 0 0 0 1px #dedfe6 inset; */
	font-size: 13px;
	-webkit-user-modify: read-write-plaintext-only;
	white-space: pre-line;
	outline: 0;
}
.content-editable:empty:before {
	content: attr(placeholder);
	color: #cccccc;
}
.content-editable:focus {
	border-color: var(--boke-color-main);
}
.content-input-count {
	position: absolute;
	color: var(--my-info);
	font-size: 12px;
	line-height: 14px;
	bottom: 5px;
	right: 10px;
}

.comment-input-operations {
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
}

.emoji-area {
	width: 100%;
	height: 200px;
	overflow-y: auto;
	display: flex;
	flex-flow: row wrap;
}
.emoji-area .emoji {
	width: 22px;
	height: 22px;
	line-height: 22px;
	margin-right: 20px;
	margin-bottom: 10px;
	cursor: pointer;
	text-align: center;
}
.emoji-area .emoji:nth-of-type(5n) {
	margin-right: 0;
}
.emoji-area .emoji:nth-last-child(3) {
	margin-bottom: 0;
}
</style>
<style>
.tribute-container {
	z-index: 9999;
}

.extra-emoji {
	cursor: pointer;
}
.extra-emoji + .extra-emoji {
	margin-left: 8px;
}
.extra-emoji .iconfont {
	font-size: 22px;
	line-height: 32px;
}
.extra-emoji .el-icon {
	height: 100%;
	vertical-align: bottom;
}
.tribute-container {
	background-color: #fff;
	box-shadow: 0 2px 5px rgb(0 0 0 / 8%);
	min-width: 120px;
	padding: 5px 0;
	font-size: 13px;
	line-height: 22px;
	max-height: 102px;
	overflow: auto;
}
.tribute-container ul {
	margin-block-start: 0;
	margin-block-end: 0;
	padding-inline-start: 0;
}
.tribute-container li {
	list-style: none;
	padding: 0 10px;
	cursor: pointer;
}
.tribute-container li.highlight {
	background-color: var(--boke-color-main);
	color: #fff;
}
</style>
