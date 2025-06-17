<template>
	<div v-html="markText" class="markdown-text language-p"></div>
</template>
<script setup>
import MarkdownIt from 'markdown-it'
import { toRefs, ref, watch, inject } from 'vue'
import { getUserApi, getFeishuUserApi } from '@/api/publicApi'
import { useMessageCenter } from '@/stores'
import { message } from '@/utils/tools'
import { getImageApi } from '@/api/publicApi'
const props = defineProps({
	text: {
		type: String,
		default: null
	}
})
const messageStore = useMessageCenter()
const { text } = toRefs(props)
const markText = ref('')
const listRow = inject('listRow', {})
// 获取at标签中的邮箱
const getEmail = (str) => {
	const reg = /<at\s+email=([^>]+)/gi
	const b = str.match(reg)
	const arrs = b?.map((item) => {
		const mailItem = item.match(/<at\s+email=([^>]+)/i)
		return mailItem[1]
	})
	return arrs
}
const formatMD = (html) => {
	const text_tag_regex = /<text_tag[^>]*>(.*?)<\/text_tag>/g
	let newHtml = html.replace(text_tag_regex, ($0, $1) => {
		return `<span>${$1}</span>`
	})
	return newHtml
}
const formatHtml = (html) => {
	const td_regex = /<td[^>]*>(.*?)<\/td>/g
	const newHtml = html.replace(td_regex, ($0, $1) => {
		// return `<a href="${url}" target="_blank" onclick="window.open('${url}', '_blank')">${$2}</a>`
		return `<td><div style="max-height: 148px;overflow-y:auto">${$1}</div></td>`
	})
	return newHtml
}
// 获取at标签中的id
const getId = (str) => {
	// const reg = /<at\s+id=([^>]+)/i
	// const b = str.match(reg)
	// return b && b[1]
	if (str?.includes('ids')) {
		const reg = /<at\s+ids=([^>]+)/gi
		const b = str.match(reg)
		const arrs = b?.map((item) => {
			const mailItem = item.match(/<at\s+ids=([^>]+)/i)
			return mailItem[1]
		})
		return arrs
	}
	const reg = /<at\s+id=([^>]+)/gi
	const b = str.match(reg)
	const arrs = b?.map((item) => {
		const mailItem = item.match(/<at\s+id=([^>]+)/i)
		return mailItem[1]
	})
	return arrs
}
// function isUrl(str) {
// 	// 使用正则表达式来匹配 URL 的模式
// 	let pattern = new RegExp(
// 		'^(https?:\\/\\/)?' + // 协议部分，可选 http 或 https
// 			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // 域名部分
// 			'((\\d{1,3}\\.){3}\\d{1,3}))' + // IP 地址部分
// 			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // 端口和路径部分
// 			'(\\?[;&a-z\\d%_.~+=-]*)?' + // 查询字符串部分
// 			'(\\#[-a-z\\d_]*)?$',
// 		'i'
// 	) // 哈希部分
// 	return pattern.test(str)
// }
// 提取图片
const getImgkey = (str) => {
	const reg = /!\[([^\]]+)\]\(([^)]+)(?:\s*["']([^"']*)["'])?\)/g
	const b = str.match(reg)
	const arrs = b?.map((item) => {
		const mailItem = item.match(/\(([^)]+)\)/)
		return mailItem[1]
	})
	return arrs
}
// 匹配A链接中的href
const getAHref = (htmlString) => {
	const regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/i
	const match = htmlString.match(regex)
	console.log(match)

	if (match && match[2]) {
		console.log(match[2])
		return match[2]
	}
	return undefined
}
watch(
	() => text.value,
	async () => {
		if (!text.value) return ''
		// markdown加粗 **加粗** 之间不可以包含空格，如果字符以符号结尾，那么末尾的双星号后面需要有空格
		// 匹配所有双星号之间的字符，去除空格，并在星号后增加看空格，
		let newValue = text.value.trim()?.replace(/\*\*(.*?)\*\*/g, function (match, offset) {
			return `**${offset.trim()}** `
		})
		const emails = getEmail(newValue)
		let ids = getId(newValue)
		const imgkeys = getImgkey(newValue)
		// 解析图片
		if (imgkeys?.length > 0) {
			for (let i in imgkeys) {
				const res = await getImageApi({
					image_key: imgkeys[i]
				})
				const items = res?.image_path || imgkeys[i]
				newValue = newValue.replace(/!\[([^\]]+)\]\(([^)]+)(?:\s*["']([^"']*)["'])?\)/g, (rs, $1) => {
					// console.log($1, $2)
					return `<img src="${items}" style="max-width: 100%" alt="${$1}" >`
				})
			}
		}
		// 解析邮件地址
		if (emails?.length > 0) {
			for (let i in emails) {
				const res = await getUserApi({ email: emails[i] })
				const items = res?.items || []
				const regex = /<at\s+[^>]*>\s*<\/at>/g
				newValue = newValue?.replace(regex, (val) => {
					if (val.indexOf(emails[i]) != -1) {
						return `<span style="color:#2970ff">@${items.length && items[0]?.user_name}</span>`
					} else {
						return val
					}
				})
			}
		}
		const robot_open_id = messageStore?.activeRoubotOpenId || listRow?.robot_open_id
		// 解析人员列表组件，多个@人
		if (newValue?.includes('ids')) {
			if (ids?.length > 0 && robot_open_id) {
				const newids = ids
					.map((item) => {
						return item?.split(',')
					})
					?.flat(2)
				let newName = ''
				for (let i in newids) {
					const res = await getFeishuUserApi({
						user_open_id: newids[i],
						robot_open_id: robot_open_id
					})
					if (res.items) {
						const { items = {} } = res
						newName += `<span style="color:#2970ff">@${items?.user_name}</span>`
					} else {
						message.error('获取用户信息失败')
					}
				}
				const regex = /<at\s+[^>]*>\s*<\/at>/g
				newValue = newValue.replace(regex, (val) => {
					if (val.indexOf(ids) != -1) {
						return newName
					} else {
						return val
					}
				})
			}
		}
		// 解析单个人
		if (ids?.length > 0 && robot_open_id) {
			for (let i in ids) {
				const res = await getFeishuUserApi({
					user_open_id: ids[i],
					robot_open_id: robot_open_id
				})
				if (res.items) {
					const { items = {} } = res
					const regex = /<at\s+[^>]*>\s*<\/at>/g
					newValue = newValue.replace(regex, (val) => {
						if (val.indexOf(ids[i]) != -1) {
							return `<span style="color:#2970ff">@${items?.user_name}</span>`
						} else {
							return val
						}
					})
				} else {
					message.error('获取用户信息失败')
				}
			}
		}
		// 判断是否包含A标签，有的话转换为markdown文本
		const regex = /<a href=([^]+)>([^<]+)<\/a>/g
		// 使用正则表达式替换HTML中的<a>标签
		// newValue = newValue.replace(regex, "[$2]($1)")
		newValue = newValue.replace(regex, ($0, $1, $2) => {
			let url = getAHref($0) || $1
			return `<a href="${url}" target="_blank" onclick="window.open('${url}', '_blank')">${$2}</a>`
		})
		// 解决markdown中的a链接点击不能跳转的问题
		/*eslint-disable-next-line */
		const regex2 = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g
		newValue = newValue.replace(regex2, ($0, $1, $2) => {
			return `<a href="${$2}" target="_blank" onclick="window.open('${$2}', '_blank')">${$1}</a>`
		})
		newValue = formatMD(newValue)
		try {
			const md = new MarkdownIt({
				html: true,
				breaks: true,
				linkify: true,
				langPrefix: 'language-'
			})
			let newHtml = md.render(newValue)
			newHtml = formatHtml(newHtml)
			markText.value = newHtml
		} catch (error) {
			console.log(error)
		}
	},
	{
		deep: true,
		immediate: true
	}
)
</script>
<style lang="scss" scoped>
.markdown-text {
	margin: 6px 0;
	padding: 0px;
	color: rgb(31, 35, 41);
	font-size: 14px;
	line-height: 1.6;
	inset: unset;
	white-space: pre-wrap;
	text-align: left;
	overflow: visible;
	white-space: normal;
	word-break: keep-all;
	word-wrap: break-word;
	p {
		padding: 0;
		margin: 0;
	}
	a {
		color: var(--boke-color-main);
	}
	:deep(table) {
		border-spacing: 0;
		border-top: 1px solid var(--boke-color-border-divider);
		border-right: 1px solid var(--boke-color-border-divider);
		table-layout: fixed;
		td,
		th {
			border-bottom: 1px solid var(--boke-color-border-divider);
			border-left: 1px solid var(--boke-color-border-divider);
			white-space: normal;
			word-break: break-all;
			max-width: 128px;
			width: 128px;
			padding: 5px 8px;
			// overflow: hidden;
			// text-overflow: ellipsis;
			// white-space: nowrap;
			font-size: 12px;
		}
	}
	:deep(a) {
		color: var(--boke-color-main);
	}
	:deep(ol) {
		li {
			margin-left: 20px;
		}
	}
	:deep(h2) {
		font-size: 14px;
		font-weight: 500;
	}
	// :deep(p) {
	// 	word-break: break-all;
	// }
}
</style>
