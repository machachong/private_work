/* eslint-disable no-useless-escape */
// 不同meta的分数
const SQL_VARIABLE_SCORE = 120
const SQL_KEYWORD_AUTOCOMPLETE_SCORE = 100
const SQL_FUNCTIONS_AUTOCOMPLETE_SCORE = 90
const DATABASE_AUTOCOMPLETE_SCORE = 60
const TABLE_AUTOCOMPLETE_SCORE = 55
const COLUMN_AUTOCOMPLETE_SCORE = 50
const DEFAULT_SCORE = 20

// 根据meta获取分数
function getScore(meta) {
	switch (meta) {
		case "table":
			return TABLE_AUTOCOMPLETE_SCORE
		case "column":
			return COLUMN_AUTOCOMPLETE_SCORE
		case "database":
			return DATABASE_AUTOCOMPLETE_SCORE
		case "function":
			return SQL_FUNCTIONS_AUTOCOMPLETE_SCORE
		case "keyword":
			return SQL_KEYWORD_AUTOCOMPLETE_SCORE
		case "variable":
			return SQL_VARIABLE_SCORE
		default:
			return DEFAULT_SCORE
	}
}

// 获取补全用数据的通用函数
const getCompleteDatas = function (result, meta = "") {
	const tables = []
	for (let i = 0; i < result.length; i++) {
		tables.push({
			name: result[i], // 名称
			value: result[i], // 值
			caption: result[i], // 字幕，也就是展示在列表中的内容
			meta: meta, // 展示类型
			score: getScore(meta),
		})
	}
	return tables
}

/*
  2023-05-24新增 专门用于变量的补全数据
*/
const getVariableCompleteDatas = (variables = []) => {
	const tables = []
	for (let variable of variables) {
		tables.push({
			name: variable.name, // 名称
			value: variable.name, // 值
			caption: `${variable.name}当前值:${variable.value}`, // 字幕，也就是展示在列表中的内容
			meta: "variable", // 展示类型
			score: getScore("varialbe"),
		})
	}
	return tables
}

// 设置补全
const setCompleteData = function (editor, data) {
	/*
    editor为编译器实例
  */
	const completer = {
		/*
      处理别名的补全
      添加正则表达式，使得输入.的时候也能触发补全逻辑
      2023-05-23新增 添加{触发补全的机制
    */
		identifierRegexps: [/[\w|\.|\$\{|!\*]+/],
		getCompletions: function (editor, session, pos, prefix, callback) {
			if (!Number.isNaN(parseInt(prefix, 10))) {
				return
			}
			return callback(null, data)
		},
	}
	// 此处为替换设置
	editor.completers = [completer]
}

// 增加补全
const addCompleteData = function (editor, data) {
	/*
    editor为编译器实例
  */
	const completer = {
		getCompletions: function (editor, session, pos, prefix, callback) {
			if (!Number.isNaN(parseInt(prefix, 10))) {
				return
			}
			return callback(null, data)
		},
	}
	// 此处为增加设置
	editor.completers = [...editor.completers, completer]
}

import keywordMap from "@/utils/ace/completer/keywords"

const setSqlCompleteData = function (
	editor,
	dbType = "adb",
	database = [],
	table = [],
	column = [],
	variable = []
) {
	const databaseDatas = getCompleteDatas(database, "database")
	const tableDatas = getCompleteDatas(table, "table")
	const columnDatas = getCompleteDatas(column, "column")
	const variableDatas = getVariableCompleteDatas(variable)

	const allKeywords = keywordMap[dbType].SQL_KEYWORDS.concat(
		keywordMap[dbType].SQL_DATA_TYPES
	)
	const sqlKeywords = getCompleteDatas(allKeywords, "keyword")

	const sqlFunction = getCompleteDatas(
		keywordMap[dbType].SQL_FUNCTION,
		"function"
	)

	const allDatas = sqlKeywords
		.concat(sqlFunction)
		.concat(databaseDatas)
		.concat(tableDatas)
		.concat(columnDatas)
		.concat(variableDatas)
	return setCompleteData(editor, allDatas)
}

// 设置高亮 貌似如果不在setMode中调用的话就没有用
const setHighLight = function (editor, callback) {
	const session = editor.session
	const rules = session.$mode.$highlightRules.getRules()
	callback(rules)
	session.$mode.$highlightRules.$rules = rules
	// force recreation of tokenizer
	session.$mode.$tokenizer = null
	session.bgTokenizer.setTokenizer(session.$mode.getTokenizer())
	// force re-highlight whole document
	session.bgTokenizer.start(0)
}

export { setCompleteData, addCompleteData, setSqlCompleteData, setHighLight }
