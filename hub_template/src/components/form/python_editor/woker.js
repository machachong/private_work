import * as monaco from "monaco-editor"
/**
 * 注册：自定义语法补全
 * @param language 语言类型
 * @param constValues 常量提示
 */
export const registerProvider = (language, constValues) => {
	const monacoProvider = monaco.languages.registerCompletionItemProvider(language, {
		provideCompletionItems: function (model, position) {
			// 获取当前行数
			const line = position.lineNumber
			// 获取当前列数
			const column = position.column
			// 获取当前输入行的所有内容
			const content = model.getLineContent(line)
			// 通过下标来获取当前光标后一个内容，即为刚输入的内容
			const sym = content[column - 2]
			const word = model.getWordUntilPosition(position)
			const range = {
				startLineNumber: position.lineNumber,
				endLineNumber: position.lineNumber,
				startColumn: word.startColumn,
				endColumn: word.endColumn,
			}
			let suggestions = []
			if (sym === "$") {
				suggestions = constValues.map((e) => ({
					label: e,
					kind: monaco.languages.CompletionItemKind.Keyword,
					insertText: "{" + e + "}",
					detail: "常量配置",
				}))
				//拦截到用户输入$，开始设置提示内容，同else中代码一致，自行拓展
			} else if(language === "sql"){
				// 直接提示，以下为sql语句关键词提示
				var sqlStr = ["SELECT", "FROM", "WHERE", "AND", "OR", "LIMIT", "ORDER BY", "GROUP BY", "LEFT", "ON", "if(){}", "for(){}", "size", "get()", "substring", "return"]
				suggestions = sqlStr.map((e) => ({
					label: e, // 显示的提示内容
					kind: monaco.languages.CompletionItemKind["Function"], // 用来显示提示内容后的不同的图标
					insertText: e, // 选择后粘贴到编辑器中的文字
					detail: "", // 提示内容后的说明
					range: range,
				}))
			}
			return {
				suggestions: suggestions,
			}
		},
		triggerCharacters: ["$", ""],
	})
	return monacoProvider
}