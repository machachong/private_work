<template>
	<boke-select
		v-model="customValue"
		clearable
		:options="customUserDict"
		isDesc
		itemDesc="department"
		customFilter
		:customFilterFun="handleFilter"
		@blur="getActiveCustomer"
		v-bind="$attrs"
	></boke-select>
</template>
<script setup>
import { getCustomerUserApi, getDepartmentUserApi } from '@/api/publicApi'

const customValue = defineModel()

// 存储客户用户列表
const customUserDict = ref([])
// 存储部门用户列表
const departmentUserDict = ref([])

/**
 * 根据搜索值获取所有匹配的客户用户
 * @param {string} value - 搜索关键词
 */
const getAll = async (value) => {
	const res = await getCustomerUserApi({ filter_info: value })
	customUserDict.value = res?.options?.map((item) => {
		return {
			...item,
			label: item?.user_name,
			value: item?.feishu_user_id,
			department: item?.department_full_path
		}
	})
}

/**
 * 获取部门用户列表
 * 如果已有缓存则直接使用缓存数据
 */
const getDepartment = async () => {
	if (departmentUserDict.value?.length > 0) {
		customUserDict.value = departmentUserDict.value
		return
	}
	const res = await getDepartmentUserApi({ user_type: 5 })
	const arrs = res?.options?.map((item) => {
		return {
			...item,
			label: item?.user_name,
			value: item?.feishu_user_id,
			department: item?.department_full_path
		}
	})
	customUserDict.value = arrs
	departmentUserDict.value = arrs
}

/**
 * 获取当前选中用户的信息
 * 如果在部门用户中存在则使用部门用户列表
 * 否则重新获取所有用户
 */
const getActiveCustomer = async () => {
	console.log(customValue.value)
	if (customValue.value) {
		if (Array.isArray(customValue.value) && customValue.value.length == 0) {
			return
		}
		const that = departmentUserDict.value?.filter((item) => item.value == customValue.value)
		if (that?.length > 0) {
			customUserDict.value = departmentUserDict.value
		} else {
			await getAll()
		}
	}
}

/**
 * 处理搜索过滤
 * @param {string} value - 搜索关键词
 * 有搜索值时获取匹配的用户列表
 * 无搜索值时:
 * - 有选中值则获取选中用户信息
 * - 无选中值则获取部门用户列表
 */
const handleFilter = async (value) => {
	console.log(!value)
	if (value) {
		if (Array.isArray(value) && value?.length == 0) {
			return
		}
		await getAll(value)
	} else {
		if (customValue.value) {
			getActiveCustomer()
			return
		}
		await getDepartment()
	}
}

// 组件挂载时获取部门用户列表
onMounted(() => {
	getDepartment()
})
</script>
<style scoped></style>
