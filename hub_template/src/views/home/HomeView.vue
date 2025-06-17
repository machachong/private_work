<template>
	<boke-card>
		<div class="homeview">
			<img class="homeview-bg" v-show="isDark" src="@/assets/img/home/home-welcome-dark.png" alt="" />
			<img class="homeview-bg" v-show="!isDark" src="@/assets/img/home/home-welcome-light.png" alt="" />
			<div class="color-title">欢迎来到开发后台</div>
			<section class="homeview-search" :class="{ focus: listInfo.visible }" v-click-outside="handleClickOutside">
				<div class="search-input">
					<el-input
						class="input-area"
						v-model="listInfo.searchText"
						placeholder="请输入搜索内容的关键字"
						:prefix-icon="Search"
						clearable
						@input="handleInputChange"
						@focus="handleInputFocus"
						@keyup.enter="handleSearch"
					>
					</el-input>
				</div>
				<div
					class="search-history"
					:class="{ active: listInfo.visible }"
					v-if="listInfo.visible"
					v-loading="listInfo.loading"
				>
					<div class="history-list" v-if="listInfo.list?.length > 0">
						<ul>
							<li v-for="(item, index) in listInfo.list" :key="index" @click="handleHistoryClick(item)">
								<span class="content" v-html="resolveContent(item)"> </span>
								<span></span>
								<span class="des">{{ item?.table }}</span>
							</li>
						</ul>
					</div>
					<div class="history-list" v-if="listInfo.emptyVisible">
						<el-empty></el-empty>
					</div>
				</div>
			</section>
		</div>
	</boke-card>
</template>
<script setup>
import { debounce } from 'lodash'
import { Search } from '@element-plus/icons-vue'
import { isDark } from '@/composables'
import { ClickOutside as VClickOutside } from 'element-plus'
import { getGlobalSearchApi } from './service'

const router = useRouter()
const searchText = ref('')
const listInfo = reactive({
	visible: false,
	loading: false,
	searchText: '',
	emptyVisible: false,
	list: []
})

/**
 * 处理搜索事件
 * 当用户点击搜索按钮或按下回车键时触发
 */
const handleSearch = () => {
	console.log(searchText.value)
}

/**
 * 处理输入框获得焦点事件
 * 显示搜索历史记录面板
 * 如果有搜索文本则触发搜索,否则清空列表
 */
const handleInputFocus = (value) => {
	listInfo.visible = true
	console.log(value)
	listInfo.list = []
	handleInputChange()
}

/**
 * 处理需求跳转逻辑
 * 根据不同的需求类型跳转到对应的页面
 * @param {string} name - 需求类型名称
 * @param {string|number} id - 需求或任务ID
 */
const handleDemandJump = (name, id) => {
	switch (name) {
		case '数分需求池':
			router.push({
				path: 'da_demand/da_demandlist',
				query: {
					demand_id: id
				}
			})
			break
		case '数分任务':
			router.push({
				path: 'da_demand/da_tasklist',
				query: {
					task_id: id
				}
			})
			break
		case '数仓需求池':
			router.push({
				path: 'dw_demand/dw_demandlist',
				query: {
					demand_id: id
				}
			})
			break
		case '数仓任务':
			router.push({
				path: 'dw_demand/dw_tasklist',
				query: {
					task_id: id
				}
			})
			break
		case '开发需求池':
			router.push({
				path: 'demand/demandlist',
				query: {
					demand_id: id
				}
			})
			break
		case '开发任务':
			router.push({
				path: 'demand/demandlist',
				query: {
					demand_id: id
				}
			})
			break
		default:
			break
	}
}

/**
 * 处理历史记录点击事件
 * 当用户点击历史记录项时触发跳转
 * @param {Object} item - 历史记录项数据
 */
const handleHistoryClick = (item) => {
	handleDemandJump(item?.table, item?.id)
}

/**
 * 处理点击外部事件
 * 当用户点击搜索框外部区域时隐藏历史记录面板
 */
const handleClickOutside = () => {
	listInfo.visible = false
}

/**
 * 解析并高亮显示搜索结果内容
 * @param {Object} item - 搜索结果项
 * @returns {string} 包含高亮HTML标记的文本
 */
const resolveContent = (item) => {
	const text = `${item.matched_field}：${item?.matched_content}  `
	// 将匹配的关键词高亮显示为蓝色
	const highlightText = text.replace(
		new RegExp(listInfo.searchText, 'gi'),
		(match) => `<span style="color: #2970ff">${match}</span>`
	)
	return highlightText
}

/**
 * 处理输入变化的防抖函数
 * 当用户输入时触发搜索请求
 * 使用200ms的防抖来优化性能
 */
const handleInputChange = debounce(async () => {
	try {
		listInfo.emptyVisible = false
		listInfo.loading = true
		const res = await getGlobalSearchApi({
			keyword: listInfo.searchText.trim()
		})
		listInfo.loading = false
		listInfo.list = res?.items
		listInfo.emptyVisible = res?.items?.length === 0
	} catch (error) {
		listInfo.loading = false
		console.log(error)
	}
}, 200)
</script>

<style scoped lang="scss">
.homeview {
	margin: 0;
	text-align: right;
	height: calc(100vh - 120px);
	width: auto;
	position: relative;
	.homeview-bg {
		position: absolute;
		top: 20px;
		right: -20px;
		width: auto;
		height: 100%;
	}
	.color-title {
		position: absolute;
		left: 50%;
		top: 100px;
		transform: translateX(-50%);
		font-weight: 500;
		font-size: 38px;
		letter-spacing: 4px;
	}
	.homeview-search {
		position: absolute;
		left: 50%;
		top: 190px;
		transform: translateX(-50%);
		text-align: left;
		// box-shadow: 0 1px 6px 0 var(--boke-color-shadow);
		border: 1px solid var(--boke-color-border-divider);
		background-color: var(--boke-card-bg);
		border-radius: 24px;
		width: 50%;
		min-width: 400px;
		min-height: 48px;
		overflow: hidden;
		&.focus {
			box-shadow: 0 0px 10px 0 var(--boke-color-shadow-focus);
			border: 1px solid var(--boke-color-shadow-focus);
		}
		// background-color: var(--boke-table-th-bg);
		.search-input {
			width: 100%;
		}
		.input-area {
			height: 48px;
			font-size: 14px;
			outline: none;
		}
		:deep(.el-input__wrapper) {
			background: none;
			&.is-focus,
			&:hover {
				box-shadow: none;
			}
		}
		.search-history {
			min-height: 0;
			max-height: 412px;
			overflow-y: auto;
			width: 100%;
			transition: height 0.3s ease-in-out;
			// &.active {
			// 	min-height: 200px;
			// }
		}
		.history-list {
			padding: 0px 20px 10px 20px;
			li {
				list-style: none;
				font-size: 14px;
				padding: 12px 10px;
				border-radius: 0 6px 6px 0;
				color: var(--boke-color-text-content);
				display: flex;
				justify-content: space-between;
				align-items: center;
				white-space: nowrap;
				border-left: 4px solid var(--boke-card-bg);
				.content {
					// width: calc(100% - 100px);
					flex: 1;
					display: flex;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					:deep(p) {
						flex: 1;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
				.des {
					width: 100px;
					text-align: right;
					color: var(--boke-color-text-describe);
				}
				&:hover {
					cursor: pointer;
					border-left: 4px solid var(--boke-color-main);
					background-color: var(--boke-table-current-row-bg-color);
				}
			}
		}
	}
}
</style>
