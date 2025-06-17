import { DomEditor } from '@wangeditor/editor'
// import { getAuthorization } from '@/utils/auth/login'
import settings from '@/utils/config/settings'
import { getFeishuDocUApi } from '@/api/publicApi'

const getFeishuDocument = async (url) => {
	const params = {
		url: url,
		app_id: settings.BOKE_APP_ID
	}
	const res = await getFeishuDocUApi(params)
	console.log(res)
	return res.title || url
}

function replaceSymbols(str) {
	return str.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

async function check(menuKey, editor, text, url) {
	const { checkLink } = editor.getMenuConfig(menuKey)
	if (checkLink) {
		const res = await checkLink(text, url)
		if (typeof res === 'string') {
			// 检验未通过，提示信息
			editor.alert(res, 'error')
			return false
		}
		if (res == null) {
			// 检验未通过，不提示信息
			return false
		}
	}

	return true // 校验通过
}

async function parse(menuKey, editor, url) {
	const { parseLinkUrl } = editor.getMenuConfig(menuKey)
	if (parseLinkUrl) {
		const newUrl = await parseLinkUrl(url)
		return newUrl
	}
	return url
}

function isMenuDisabled(editor) {
	if (editor.selection == null) return true

	const selectedElems = DomEditor.getSelectedElems(editor)
	const notMatch = selectedElems.some((elem) => {
		const { type } = elem
		if (editor.isVoid(elem)) return true
		if (['pre', 'code', 'link'].includes(type)) return true
	})
	if (notMatch) return true // disabled
	return false // enable
}

async function genLinkNode(url) {
	const title = await getFeishuDocument(url)
	const linkNode = {
		type: 'link',
		url: replaceSymbols(url),
		children: title ? [{ text: title }] : []
	}
	return linkNode
}

async function insertLink(editor, text, url) {
	if (!url) return
	if (!text) text = url // 无 text 则用 url 代替

	// 还原选区
	editor.restoreSelection()
	if (isMenuDisabled(editor)) return

	// 校验
	const checkRes = await check('insertLink', editor, text, url)
	if (!checkRes) return // 校验未通过

	// 转换 url
	const parsedUrl = await parse('insertLink', editor, url)
	editor.insertText(' ')

	const linkNode = await genLinkNode(parsedUrl)
	editor.insertNode(linkNode)
	editor.insertFragment([{ text: ' ' }])
}

export default function pluginLink(editor) {
	const { insertData } = editor
	const newEditor = editor
	newEditor.insertData = async (data) => {
		const text = data.getData('text/plain')
		// 如果内容包含https://并且包含.feishu.cn，则认为是飞书文档链接，进行插入
		if (text.startsWith('https://') && text.includes('.feishu.cn')) {
			if (isMenuDisabled(newEditor)) return // disabled
			const { selection } = newEditor
			if (selection == null) return
			const selectedText = newEditor.getSelectionText() // 获取选中的文字
			insertLink(newEditor, selectedText, text)
		}
		// 否则，直接插入
		else {
			return insertData(data)
		}
	}
	return newEditor
}
