<template>
	<my-editor
		ref="editor"
		:id="id"
		:model-value="modelValue"
		:disabled="disabled"
		:width="width"
		:height="height"
		:resizable="resizable"
		:handle-tab="handleTab"
		:auto-scroll="autoScroll"
		mode="sql"
		v-bind="$attrs"
		:extra-keywords="extraKeywords"
		:extra-type="extraType"
		:extra-function="extraFunction"
		:extra-mode="dbType"
		@update:modelValue="handleSync"
		@selected="handleSelected"
		@save="handleSave"
		@run="handleRun"
		@format="handleFormat"
		@ace-input="handleInput"
		@ace-delete="autocompleteShow = false"
	>
		<sql-pointer-completer
			v-model="autocompleteShow"
			:top="top"
			:left="left"
			:words="columnWords"
		></sql-pointer-completer>
	</my-editor>
</template>

<script>
import { defineComponent, nextTick, onMounted, ref, watch } from "vue"
import MyEditor from "@/components/form/editor/MyEditor.vue"
import { setSqlCompleteData } from "@/utils/ace/completer/sql"
import SqlPointerCompleter from "./completer/SqlPointerCompleter.vue"
import keywordMap from "@/utils/ace/completer/keywords"

export default defineComponent({
	name: "SqlEditor",
	components: {
		MyEditor,
		SqlPointerCompleter
	},
	props: {
		modelValue: {
			type: String,
			default() {
				return ""
			}
		},
		id: {
			type: String,
			default() {
				return "editor"
			}
		},
		// 2022-08-05新增 数据库类型
		dbType: {
			type: String,
			default() {
				return "adb"
			}
		},
		disabled: Boolean,
		width: {
			type: String,
			default() {
				return "100%"
			}
		},
		height: {
			type: String,
			default() {
				return "100%"
			}
		},
		resizable: {
			type: Boolean,
			default() {
				return false
			}
		},
		handleTab: Boolean, // 将四个空格转为'\t'
		autoScroll: Boolean,
		databaseWords: {
			type: Array,
			default() {
				return []
			}
		},
		tableWords: {
			type: Array,
			default() {
				return []
			}
		},
		columnWords: {
			type: [Array, Promise],
			default() {
				return []
			}
		},
		variables: {
			type: Array,
			default() {
				return []
			}
		}
	},
	emits: ["update:modelValue", "selected", "save", "run", "format", "variable", "extraCompleter"],
	setup(props, ctx) {
		const editor = ref(null)

		function handleSync(val) {
			ctx.emit("update:modelValue", val)
		}

		function handleSelected(val) {
			ctx.emit("selected", val)
		}

		function handleSave(val) {
			ctx.emit("save", val)
		}

		function handleRun(val) {
			ctx.emit("run", val)
		}

		function handleFormat(val) {
			ctx.emit("format", val)
		}

		// 调用以修改编译器尺寸
		function resize() {
			editor.value.resize()
		}

		// 聚焦
		function focus() {
			editor.value.focus()
		}

		// 插入
		function insert(val) {
			editor.value.insert(val)
		}

		// 替换选择范围内的文本(用于选择文本美化或者选择文本注释)
		function replaceSelection(val) {
			editor.value.editor.session.replace(editor.value.editor.getSelectionRange(), val)
		}

		// 获取当前SQL
		function getCurrentSql() {
			/* 2023-02-02新增，对ref的判断，解决07df530bb43c443382031923c045e7bbJSON */
			if (!editor.value) {
				return ""
			}
			if (!editor.value.editor) {
				return ""
			}
			// 获取当前光标所在的行和列
			const position = editor.value.editor.selection.getCursor()
			const row = position.row
			const col = position.column
			const sql = props.modelValue.replace(/\n/g, " \n ")
			const sqlRows = sql.split("\n")
			let tail = ""
			let hasTail = false
			const currentRow = sqlRows[row]
			for (let i = col; i < currentRow.length; i++) {
				tail += currentRow[i]
				if (currentRow[i] === ";") {
					hasTail = true
					break
				}
			}
			if (!hasTail && row < sqlRows.length - 1) {
				for (let i = row + 1; i < sqlRows.length; i++) {
					if (!hasTail) {
						for (let j = 0; j < sqlRows[i].length; j++) {
							tail += sqlRows[i][j]
							if (sqlRows[i][j] == ";") {
								hasTail = true
								break
							}
						}
					}
				}
			}
			let head = ""
			let hasHead = false
			if (col !== 0) {
				for (let i = col - 1; i >= 0; i--) {
					head = currentRow[i] + head
					if (currentRow[i] === ";") {
						hasHead = true
						break
					}
				}
			}
			if (!hasHead && row > 0) {
				for (let i = row - 1; i >= 0; i--) {
					if (!hasHead) {
						for (let j = sqlRows[i].length - 1; j >= 0; j--) {
							head = sqlRows[i][j] + head
							if (sqlRows[i][j] == ";") {
								hasHead = true
								break
							}
						}
					}
				}
			}
			return head + tail
		}

		// 设置SQL编译器的补全信息
		function setCompleteData() {
			nextTick(() => {
				const editorInstance = editor.value.editor
				if (props.columnWords instanceof Promise) {
					props.columnWords.then((columns) => {
						setSqlCompleteData(
							editorInstance,
							props.dbType,
							props.databaseWords,
							props.tableWords,
							columns,
							props.variables
						)
					})
				} else {
					setSqlCompleteData(
						editorInstance,
						props.dbType,
						props.databaseWords,
						props.tableWords,
						props.columnWords,
						props.variables
					)
				}
			})
		}

		// 根据输入的数组的变化，自动进行补全的刷新
		watch(
			() => [
				props.databaseWords,
				props.tableWords,
				props.columnWords,
				props.variables,
				props.dbType
			],
			() => {
				setCompleteData()
			},
			{
				deep: true
			}
		)

		/*
      监听输入
    */
		const top = ref(0)
		const left = ref(0)
		const autocompleteShow = ref(false)

		function handleInput() {
			// if (e.data) {
			//   if (e.data == ".") {
			//     ctx.emit("extraCompleter");
			//     autocompleteShow.value = true;
			//   } else {
			//     autocompleteShow.value = false;
			//   }
			// }
			// const el = e.srcElement;
			// top.value = el.offsetTop;
			// left.value = el.offsetLeft;
		}

		/*
      2022-07-27新增 自定义高亮关键词
    */
		// 关键词
		const extraKeywords = keywordMap[props.dbType].SQL_KEYWORDS
		// 类型
		const extraType = keywordMap[props.dbType].SQL_DATA_TYPES
		// 函数
		const extraFunction = keywordMap[props.dbType].SQL_FUNCTION

		/*
      2023-05-24新增 呼出变量的快捷方式
    */
		const ctrlP = () => {
			const func = () => {
				ctx.emit("variable")
			}
			editor.value?.editor.commands.addCommand({
				name: "variable",
				exec: func,
				bindKey: { win: "ctrl-p", mac: "cmd-p" }
			})
		}

		onMounted(() => {
			setCompleteData()
			ctrlP()
		})

		return {
			editor,
			handleSync,
			handleSelected,
			handleSave,
			handleRun,
			handleFormat,
			resize,
			focus,
			getCurrentSql,
			insert,
			replaceSelection,
			top,
			left,
			autocompleteShow,
			handleInput,
			extraKeywords,
			extraType,
			extraFunction
		}
	}
})
</script>

<style scoped></style>
