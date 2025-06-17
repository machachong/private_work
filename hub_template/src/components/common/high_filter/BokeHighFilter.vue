<template>
	<el-popover
		ref="tooltipRef"
		placement="bottom-start"
		:visible="searchInstance.visible"
		:width="730"
		trigger="focus"
		:virtual-ref="buttonRef"
	>
		<template #reference>
			<el-input
				ref="buttonRef"
				v-click-outside:[popperPaneRef]="handleOutside"
				class="search-input"
				clearable
				readonly
				:value="searchString"
				:placeholder="placeholder"
				@click="handleOpen"
				:prefix-icon="Search"
				:style="{ width: width + 'px' }"
			>
				<template #suffix>
					<el-icon class="pointer" v-show="!!searchString" @click="handleClear"
						><CircleClose
					/></el-icon>
				</template>
			</el-input>
		</template>
		<div class="search-title">
			<!-- <span class="h5">设置查询条件</span> -->
			<!-- <span>
        <el-space :size="8">
          <el-checkbox
            :model-value="searchInstance.saveCache"
            @change="handleSaveCache"
            label="保存条件"
            size="large"
          />
          <el-tooltip
            class="box-item"
            effect="dark"
            content="保存条件后，下次进入该页面默认按照设置的条件查询"
            placement="top"
          >
            <el-icon><Warning /></el-icon>
          </el-tooltip>
        </el-space>
      </span> -->
		</div>
		<section class="search-tab">
			<div class="left">
				<el-tabs tab-position="left" class="demo-tabs" v-model="searchInstance.activeTab">
					<el-tab-pane
						v-for="item in asycTabs"
						:key="item.value"
						:label="item.label"
						:name="item.value"
					>
						<template #label>
							<el-label
								class="box-item"
								effect="dark"
								content="保存条件后，下次进入该页面默认按照设置的条件查询"
								placement="top"
							>
								<el-tooltip
									class="box-item"
									effect="dark"
									:content="item.label"
									placement="top"
									:show-after="500"
									>{{ item.label }}
								</el-tooltip>
							</el-label>
						</template>
						<ConditionArea
							:filedOptions="filedOptions"
							:conditionItem="item"
							@add="handleAdd"
							@delete="handleDelete"
						></ConditionArea>
					</el-tab-pane>
				</el-tabs>
			</div>
		</section>

		<el-row justify="end" class="filter-footer">
			<el-space>
				<SaveCondition
					ref="saveDialogRef"
					:check="checkCondition"
					v-if="activeTabItem.value == 'default'"
					:asycTabs="asycTabs"
					@ok="handleSaveCache"
				></SaveCondition>
				<boke-button v-else type="danger" @click="handleDeleteCon">删除</boke-button>
				<boke-button @click="handleCancle">取消</boke-button>
				<boke-button type="primary" @click="handleOK">确定</boke-button>
			</el-space>
		</el-row>
	</el-popover>
</template>

<script setup>
import { ClickOutside as vClickOutside } from "element-plus"
import { Search, CircleClose } from "@element-plus/icons-vue"
import { useRoute } from "vue-router"
import { conditionDict, defaultFilter, defaultCondition } from "./config.js"
import { confirm, getLabel, message, getLocalStorage, setLocalStorage } from "@/utils/tools"
import SaveCondition from "./SaveCondition.vue"
import ConditionArea from "./ConditionArea"
const emits = defineEmits(["update:modelValue", "update:searchText"])
const props = defineProps({
	modelValue: {
		type: Array,
		default: () => []
	},
	searchText: {
		type: String,
		default: ""
	}, // 返回显示内容翻译，用户埋点
	width: {
		type: Number,
		default: 400
	},
	filterColumns: {
		type: Array,
		default: () => [
			// {
			//   label: '操作类型', 字段名
			//   prop: 'behavior', 属性
			//   type:'select', 类型 input, select
			//   options: behaviorOptions, // 字典
			//   multiple: true, 默认为true, 值是否支持多选
			// },
		]
	},
	maxSize: {
		type: Number,
		default: 20
	},
	placeholder: {
		type: String,
		default: "请选择查询条件"
	},
	storageKey: {
		type: String,
		default: null
	}, // 缓存key,默认使用页面路由名,如果一个页面存在多个,需要自己手动设置唯一的key
	showDefault: {
		type: Boolean,
		default: false // 为true时则会使用主动设置的查询条件
	},
	clearAll: {
		type: Boolean,
		default: false
	} // // 为true时则会清空查询调节
})
const route = useRoute()
const searchInstance = ref({
	visible: false,
	saveCache: false,
	activeTab: "default",
	sureTab: null // 记录点击确定得item,如果切到其他Tab下,点击取消,打开时打开上一次点击确定得tab
})
const saveDialogRef = ref()
const asycTabs = ref([{ ...defaultCondition }]) // tab数组
const buttonRef = ref()
const searchString = ref()
const tooltipRef = ref()
const activeTabItem = computed(() => {
	return asycTabs.value?.find((item) => item.value == searchInstance.value.activeTab)
})
const popperPaneRef = computed(() => {
	return tooltipRef.value?.popperRef?.contentRef
})
// 本地缓存Key，为每个页面配置唯一的key
const cacheName = computed(() => {
	return props.storageKey || route.name + "_high_filter"
})
// 过滤筛选字段，每个字段仅可筛选一次
const filedOptions = computed(() => {
	const hasFiled = activeTabItem.value?.condition?.map((item) => item.prop)
	return props.filterColumns?.map((item) => {
		return {
			...item,
			disabled: hasFiled?.includes(item.prop)
		}
	})
})
const checkCondition = (cache = false) => {
	const list = activeTabItem.value.condition.filter((item) => {
		return !(!item.prop && !item.condition && (!item.value || item.value.length == 0))
	})
	if (cache && list.length == 0) {
		message.warning("请选择要查询的字段")
		return false
	}
	const noSelectField = list.filter((item) => !item.prop)
	const noSelectCondition = list.filter((item) => !item.condition)
	const noSelectValue = list.filter((item) => !item.value || item.value.length == 0)
	if (noSelectField.length > 0) {
		message.warning("请选择要查询的字段")
		return false
	}
	if (noSelectCondition.length > 0) {
		message.warning("请选择查询条件")
		return false
	}
	if (noSelectValue.length > 0) {
		message.warning("请选择查询内容")
		return false
	}
	return true
}
const setShowSearch = (list) => {
	return list
		?.map((item) => {
			const filed = item.prop ? props.filterColumns?.find((col) => col.prop == item.prop) : ""
			let value = item.value
			if (filed?.type == "select") {
				if (filed?.multiple !== false) {
					value = item.value
						?.map((va) => {
							return filed.options?.find((f) => f.value == va)?.label
						})
						?.join("或")
				} else {
					value = filed.options?.find((f) => f.value == item.value)?.label
				}
			}
			const condition = item.condition ? getLabel(conditionDict, item.condition) : ""
			return `${filed?.label || ""}${condition || ""}${value || ""}`
		})
		.join(",")
}
const handleOpen = () => {
	try {
		const has = asycTabs.value.map((item) => item.value)
		let cacheData = getLocalStorage(cacheName.value)
			? JSON.parse(getLocalStorage(cacheName.value))
			: []
		cacheData = cacheData.filter((item) => !has.includes(item.value))
		asycTabs.value.push(...cacheData)
		searchInstance.value.visible = true
		const tabsKeys = asycTabs.value.map((item) => item.value)
		// 判断记录得最后一个tab是否存在
		if (
			searchInstance.value?.sureTab &&
			tabsKeys.indexOf(searchInstance.value?.sureTab?.value) != -1
		) {
			searchInstance.value.activeTab = searchInstance.value?.sureTab?.value
		} else {
			searchInstance.value.activeTab = "default"
		}
	} catch (error) {
		console.log(error)
	}
}
const handleAdd = (val) => {
	for (let i in asycTabs.value) {
		const item = asycTabs.value[i]
		if (item.value == val.value) {
			if (item?.condition?.length >= props.maxSize) {
				return message.warning("最多添加20个条件！")
			} else {
				item.condition.push(JSON.parse(JSON.stringify(defaultFilter)))
			}
		}
	}
}
const handleDelete = (val, index) => {
	for (let i in asycTabs.value) {
		const item = asycTabs.value[i]
		if (item.value == val.value) {
			item.condition.splice(index, 1)
			return false
		}
	}
}
const resetDefault = () => {
	for (let i in asycTabs.value) {
		if (asycTabs.value[i].value == "default") {
			asycTabs.value[i].condition = [{ ...defaultFilter }]
		}
	}
}
// 设置保存条件
const handleSaveCache = async (value) => {
	try {
		const item = {
			condition: activeTabItem.value?.condition,
			label: value.name,
			value: value.index,
			isDefault: value.isDefault
		}
		asycTabs.value.push(item)
		// 判断当前缓存是否存在
		let cacheData = getLocalStorage(cacheName.value)
			? JSON.parse(getLocalStorage(cacheName.value))
			: []
		if (value.isDefault) {
			cacheData.forEach((item) => {
				item.isDefault = false
			})
		}

		searchInstance.value.activeTab = item.value
		setLocalStorage(cacheName.value, JSON.stringify([...cacheData, item]))
		resetDefault()
	} catch (error) {
		console.log(error)
	}
}
const transferValue = (value, searchText) => {
	//以数组对象json字符串传递给后端
	emits("update:modelValue", value)
	emits("update:searchText", searchText)
}
const handleCancle = () => {
	searchInstance.value.visible = false
}
// 更新缓存
const updateCache = (list) => {
	const active = activeTabItem.value
	active.condition = list
	// 判断当前条件是否存在
	const tabKeys = asycTabs.value.map((item) => item.value)
	if (tabKeys.includes(active.value)) {
		asycTabs.value.forEach((ai) => {
			if (ai.value == active.value) {
				ai = active
			} else {
				if (active.isDefault) {
					ai.isDefault = false
				}
			}
		})
	} else {
		asycTabs.value.push(active)
	}
	const cacheData = asycTabs.value.filter((item) => item.value != "default")
	searchInstance.value.activeTab = active.value
	setLocalStorage(cacheName.value, JSON.stringify(cacheData))
}
// 点击确定
const handleOK = () => {
	if (!checkCondition()) {
		return false
	}
	// 排除掉所有都为空得情况
	const list = activeTabItem.value.condition.filter((item) => {
		return !(!item.prop && !item.condition && (!item.value || item.value.length == 0))
	})
	if (activeTabItem.value?.value != "default") {
		// 保存条件点击确定需要去缓存更新条件
		updateCache(list)
	}
	searchString.value = setShowSearch(list)
	transferValue(list, searchString.value)
	searchInstance.value.sureTab = activeTabItem.value
	handleCancle()
}
// 删除自定义条件
const handleDeleteCon = async () => {
	try {
		await confirm("确定删除吗")
		if (activeTabItem.value.value == searchInstance.value.sureTab.value) {
			searchString.value = ""
			transferValue([], searchString.value)
		}
		for (let i in asycTabs.value) {
			if (asycTabs.value[i].value == activeTabItem.value.value) {
				asycTabs.value.splice(i, 1)
			}
		}
		const cacheData = asycTabs.value.filter((item) => item.value != "default")
		setLocalStorage(cacheName.value, JSON.stringify(cacheData))

		searchInstance.value.activeTab = "default"
	} catch (error) {
		console.log(error)
	}
}
// 点击清除输入框按钮
const handleClear = () => {
	resetDefault()
	searchInstance.value.activeTab = "default"
	searchString.value = ""
	searchInstance.value.sureTab = null
	transferValue([], searchString.value)
}
// 点击以外区域关闭
const handleOutside = (event) => {
	if (!searchInstance.value.visible) {
		return false
	}
	if (
		!event.target.className ||
		(event?.target?.className &&
			typeof event?.target?.className == "string" &&
			event?.target?.className?.includes("el-select-dropdown__item")) ||
		(event?.target?.className &&
			typeof event?.target?.className == "string" &&
			event?.target?.className?.includes("el-button"))
	) {
		return false
	} else {
		handleCancle()
	}
}
const setDefaultCondition = () => {
	if (props.modelValue && props.showDefault) {
		const res = props.modelValue
		for (let i in asycTabs.value) {
			if (asycTabs.value[i].value == "default") {
				asycTabs.value[i].condition = res
				searchInstance.value.activeTab = "default"
			}
		}
		searchString.value = setShowSearch(res)
		transferValue(res, searchString.value)
	}
}
watch(
	() => props.filterColumns,
	() => {
		if (props.clearAll) {
			return handleClear()
		}
		if (props.modelValue?.length > 0 && props.showDefault) {
			setDefaultCondition()
			return false
		}
		// 保证用到异步字典接口时能够翻译出来
		const res = JSON.parse(getLocalStorage(cacheName.value))
		// 保证用到异步字典接口时能够翻译出来
		const currentItem = res?.find((item) => item.isDefault)
		if (res && res.length > 0 && currentItem) {
			// searchInstance.value.activeTab = currentItem?.value
			searchString.value = setShowSearch(currentItem.condition)
			transferValue(currentItem.condition, searchString.value)
			searchInstance.value.sureTab = currentItem
		} else {
			// 如果有设置默认，那就自动切到默认tab
			searchInstance.value.sureTab = {
				value: "default"
			}
		}
	},
	{
		deep: true,
		immediate: true
	}
)
watch(
	() => props.clearAll,
	() => {
		if (props.clearAll) {
			handleClear()
		}
	}
)
onMounted(() => {
	asycTabs.value?.forEach((item) => {
		// !props.showDefault &&
		if (item.value == "default") {
			item.condition = [{ ...defaultFilter.value }]
		}
	})
})
defineExpose({
	handleClear
})
</script>

<style scoped lang="scss">
// .search-input{
// }
.search-title {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 8px;
}
.search-content {
	min-height: 250px;
	// padding-left: 8px;
}
.search-tab {
	width: 100%;
	height: auto;
	display: flex;
	.left {
		width: 100%;
		:deep(.el-tabs) {
			height: auto;
			max-height: 430px;
		}
		:deep(.el-tabs__item) {
			width: 100px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			text-align: center;
			padding: 0 4px;
			box-sizing: border-box;
			display: block;
			line-height: 40px;
		}
	}
	// .right {
	//   flex: 1;
	// }
}
.filter-footer {
	margin-top: 16px;
}
</style>
