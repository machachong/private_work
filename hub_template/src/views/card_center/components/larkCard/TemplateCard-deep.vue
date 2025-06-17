<template>
	<div class="lark-card" v-loading="loading">
		<header class="lark-card__head" :class="`lark-card--${titleInfo.template}`">
			<el-space>
				{{ titleInfo.title }}
				<el-tag v-for="item in titleInfo.text_tag_list" :key="item?.text?.content" size="small">
					{{ item?.text?.content }}
				</el-tag>
			</el-space>
			<p class="lark-card__head__subtitle" :title="titleInfo.subtitle">
				{{ titleInfo.subtitle }}
			</p>
		</header>
		<div class="lark-card__content" v-if="cardBody?.length > 0">
			<LarkComponents :info="cardBody" :row="row"></LarkComponents>
		</div>
		<div v-else>
			<el-empty description="暂无信息" />
		</div>
		<footer></footer>
	</div>
</template>

<script>
import { computed, defineComponent, ref, watch, provide } from 'vue'
import { getCardTemplateApi } from './service/card_template_api'
import { getEmail, getId, message } from '@/utils/tools'
import { getUserApi, getFeishuUserApi } from '@/api/publicApi'
import LarkComponents from './components_new/LarkComponents.vue'
export default defineComponent({
	name: 'TemplateCard',
	components: {
		LarkComponents
	},
	props: {
		row: {
			type: Object,
			default: () => ({})
		},
		showHeader: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update:visible'],
	setup(props, ctx) {
		provide('listRow', props.row)
		const cardTemplate = ref({})
		const loading = ref(false)
		const titleInfo = ref({})
		const cardCon = computed(() => {
			console.log('props.row', JSON.parse(props.row?.card_body))
			const newRow = JSON.parse(props.row?.card_body)?.data
			console.log('value', newRow)
			return newRow || {}
		})
		//将模板变量转换位变量的值
		const transferProps = (str, values) => {
			// eslint-disable-next-line no-useless-escape
			let regex = /\$\{([^\}]+)\}/g
			if (!str || Array.isArray(str)) return str
			console.log(61, str)
			return str?.replaceAll(regex, function (value, props) {
				let val = props

				for (let i of Object.keys(values)) {
					if (i == props) {
						val = values[i]
					}
				}
				if (Array.isArray(val)) {
					return JSON.stringify(val)
				}
				return val
			})
		}
		const formatContent = (item) => {
			if (['markdown'].includes(item.tag)) {
				item.content = transferProps(item.content, cardVars.value)
			}
			if (['table'].includes(item.tag)) {
				item.rows = transferProps(item.rows, cardVars.value)
			}
			if (['table'].includes(item.tag)) {
				item.rows = transferProps(item.rows, cardVars.value)
			}
		}
		// const cardBody = computed(() => {
		// 	let newRow = cardTemplate.value?.i18n_elements?.zh_cn
		// 	newRow = newRow?.map((item) => {
		// 		formatContent(item)
		// 		// 特殊处理row组件的渲染
		// 		if (item.tag == "column_set" && item.columns?.length > 0) {
		// 			item.columns.forEach((el) => {
		// 				if (el?.elements?.length > 0) {
		// 					el.elements.forEach((list) => formatContent(list))
		// 				}
		// 			})
		// 		}
		// 		// 特殊处理循环组件的渲染
		// 		if (item.tag == "repeat") {
		// 			console.log("90", item)
		// 			for (let i of Object.keys(cardVars.value)) {
		// 				if (i == item.variable) {
		// 					item.value = cardVars.value[i]
		// 				}
		// 			}
		// 			console.log("repeat", item)
		// 		}
		// 		// 特殊处理action组件中form元素的渲染
		// 		if (item.tag == "action") {
		// 			console.log("90", item)
		// 			for (let i in item.actions) {
		// 				// 时间选择
		// 				if (item.actions[i]?.initial_time) {
		// 					item.actions[i].initial_time = transferProps(
		// 						item.actions[i]?.initial_time,
		// 						cardVars.value
		// 					)
		// 				}
		// 				// 输入框
		// 				if (item.actions[i]?.default_value) {
		// 					item.actions[i].default_value = transferProps(
		// 						item.actions[i]?.default_value,
		// 						cardVars.value
		// 					)
		// 				}
		// 				// 下拉
		// 				if (item.actions[i]?.initial_index) {
		// 					item.actions[i].initial_index = transferProps(
		// 						item.actions[i]?.initial_index,
		// 						cardVars.value
		// 					)
		// 				}
		// 				// 日期选择
		// 				if (item.actions[i]?.initial_date) {
		// 					item.actions[i].initial_date = transferProps(
		// 						item.actions[i]?.initial_date,
		// 						cardVars.value
		// 					)
		// 				}
		// 			}
		// 		}
		// 		return item
		// 	})
		// 	console.log("模版", newRow)
		//   deepFind(newRow)
		// 	return newRow
		// })
		const cardBody = ref()
		watch(
			() => cardTemplate.value?.i18n_elements?.zh_cn,
			async () => {
				// console.log(47, newRow);
				// return newRow|| {};
				let newRow = cardTemplate.value?.i18n_elements?.zh_cn
				newRow = newRow?.map((item) => {
					formatContent(item)
					// 特殊处理row组件的渲染
					if (item.tag == 'column_set' && item.columns?.length > 0) {
						item.columns.forEach((el) => {
							if (el?.elements?.length > 0) {
								el.elements.forEach((list) => formatContent(list))
							}
						})
					}
					// 特殊处理循环组件的渲染
					if (item.tag == 'repeat') {
						console.log('90', item)
						for (let i of Object.keys(cardVars.value)) {
							if (i == item.variable) {
								item.value = cardVars.value[i]
							}
						}
						console.log('repeat', item)
					}
					// 特殊处理action组件中form元素的渲染
					if (item.tag == 'action') {
						console.log('90', item)
						for (let i in item.actions) {
							// 时间选择
							if (item.actions[i]?.initial_time) {
								item.actions[i].initial_time = transferProps(item.actions[i]?.initial_time, cardVars.value)
							}
							// 输入框
							if (item.actions[i]?.default_value) {
								item.actions[i].default_value = transferProps(item.actions[i]?.default_value, cardVars.value)
							}
							// 下拉
							if (item.actions[i]?.initial_index) {
								item.actions[i].initial_index = transferProps(item.actions[i]?.initial_index, cardVars.value)
							}
							// 日期选择
							if (item.actions[i]?.initial_date) {
								item.actions[i].initial_date = transferProps(item.actions[i]?.initial_date, cardVars.value)
							}
						}
					}
					return item
				})
				console.log('模版', newRow)
				await deepFind(newRow)
				cardBody.value = newRow
			},
			{
				deep: true
			}
		)
		const cardVars = computed(() => {
			return cardCon.value?.template_variable
		})
		const cardHead = computed(() => {
			const newRow = cardTemplate.value?.i18n_header?.zh_cn
			return newRow || '飞书卡片'
		})
		watch(
			() => cardHead.value,
			(val) => {
				titleInfo.value.title = transferProps(val?.title?.content, cardVars.value)
				titleInfo.value.subtitle = val?.subtitle?.content
				titleInfo.value.text_tag_list = val?.text_tag_list
				titleInfo.value.template = val?.template
			},
			{ deep: true, immediate: true }
		)
		const transferUser = async (str) => {
			// let newValue =str?.replace(/\*\*(.*?)\*\*/g, function (match, offset) {
			// 	return `**${offset.trim()}** `
			// })
			let newValue = str
			const email = getEmail(newValue)
			const id = getId(newValue)
			if (email) {
				const res = await getUserApi({ email })
				const items = res?.items || []
				const regex = /<at\s+[^>]*>\s*<\/at>/g
				newValue = newValue.replace(
					regex,
					`<span style="color:#2970ff">@${items.length && items[0]?.department}-${
						items.length && items[0]?.user_name
					}</span>`
				)
			}
			if (id && props.row?.robot_open_id) {
				const res = await getFeishuUserApi({
					user_open_id: id,
					robot_open_id: props.row?.robot_open_id
				})
				console.log(1123, res)
				if (res.items) {
					const { items = {} } = res
					const regex = /<at\s+[^>]*>\s*<\/at>/g
					newValue = newValue.replace(
						regex,
						`<span style="color:#2970ff">@${items?.department_full_path}-${items?.real_name}</span>`
					)
				} else {
					message.error('获取用户信息失败')
				}
			}
			return newValue
		}
		const deepFind = async (tmp) => {
			try {
				console.log(169, tmp)
				for (let i = 0; i < tmp?.length; i++) {
					console.log(171, tmp[i])
					if (tmp[i]?.columns && tmp[i]?.columns.length > 0) {
						await deepFind(tmp[i]?.columns)
					} else if (tmp[i]?.elements && tmp[i]?.elements?.length > 0) {
						await deepFind(tmp[i]?.elements)
					} else if (tmp[i]?.tag == 'markdown') {
						tmp[i].content = await transferUser(tmp[i].content)
					}
				}
			} catch (error) {
				console.log(error)
			}
		}
		const getCardTemplate = async (template_id) => {
			try {
				loading.value = true
				const res = await getCardTemplateApi({
					template_id
				})
				console.log(999, res)
				cardTemplate.value = res?.items[0]?.code_info ? JSON.parse(res?.items[0]?.code_info) : {}
				console.log(121, cardTemplate.value)
				loading.value = false
			} catch (error) {
				console.log(error)
				loading.value = false
			}
		}

		const close = () => {
			cardTemplate.value = ''
			ctx.emit('update:visible', false)
		}
		watch(
			() => props.row,
			() => {
				if (props.row) {
					console.log('card_id', cardCon.value?.template_id)
					getCardTemplate(cardCon.value?.template_id)
				}
			},
			{
				immediate: true,
				deep: true
			}
		)
		return {
			close,
			cardHead,
			cardCon,
			titleInfo,
			cardBody,
			loading
		}
	}
})
</script>
<style lang="scss" scoped>
.lark-card {
	border: none;
	border-radius: 10px;
	background-color: var(--boke-color-fff);
	box-sizing: border-box;
	width: 605px;
	margin: 0 auto;
	border: 1px solid #dee0e3;
	&__head {
		background-color: #e1eaff;
		background-size: 605px 140px;
		border-bottom: none;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		padding: 12px;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		display: -webkit-box;
		overflow: hidden;
		white-space: pre-wrap;
		color: #245bdb;
		font-size: 16px;
		font-weight: 600;
		&__subtitle {
			font-size: 14px;
			line-height: 22px;
			font-weight: 500;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	&--blue {
		background-color: #e0e9ff;
		color: #1456f0;
	}
	&--wathet {
		background-color: #caeffc;
		color: #076a94;
	}
	&--turquoise {
		background-color: #c4f2ec;
		color: #067062;
	}
	&--green {
		background-color: #d0f5ce;
		color: #1a7526;
	}
	&--yellow {
		background-color: #faedc2;
		color: #ad7a03;
	}
	&--orange {
		background-color: #fee7cd;
		color: #c25705;
	}
	&--red {
		background-color: #fee3e2;
		color: #c02a26;
	}
	&--carmine {
		background-color: #fee2f2;
		color: #b82879;
	}
	&--violet {
		background-color: #f9e2f9;
		color: #a630a6;
	}
	&--purple {
		background-color: #efe6fe;
		color: #7a35f0;
	}
	&--indigo {
		background-color: #e9eafb;
		color: #4752e6;
	}
	&--grey {
		background-color: #8f959e;
		color: #fff;
	}
	&--default {
		background-color: #fff;
		color: initial;
	}

	&__content {
		padding: 0 12px 12px;
	}
}
</style>
