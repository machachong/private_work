<template>
	<boke-card class="overview-container">
		<div class="flex-around">
			<div>
				<boke-button @click="exportScreen">
					<el-space :size="2">
						<el-icon><Download /></el-icon>
						导出截图
					</el-space>
				</boke-button>
			</div>
			<el-space>
				<el-radio-group v-model="form.type" @change="getTaskOverview">
					<el-radio-button label="周" value="week" />
					<el-radio-button label="月" value="month" />
				</el-radio-group>
				<BokeWeekPicker
					v-if="form.type == 'week'"
					v-model="form.date"
					v-model:weeks="form.weeks"
					:week="5"
					style="width: 250px"
					type="week"
					placeholder="请选择时间"
					@change="getTaskOverview"
				/>
				<el-date-picker
					v-if="form.type == 'month'"
					v-model="form.month"
					type="months"
					value-format="YYYY-MM"
					placeholder="请选择时间"
					@change="getTaskOverview"
				/>
				<boke-select
					class="m-l-16"
					placeholder="请选择用户"
					multiple
					style="width: 250px"
					clearable
					:item-value="userType == 4 ? 'user_id' : 'feishu_user_id'"
					:options="userOptions"
					v-model="form.user_id"
					@change="getTaskOverview"
				></boke-select>
			</el-space>
		</div>
		<!-- <div class="m-t-20">
			<boke-button @click="exportScreen">
				<el-space :size="2">
					<el-icon><Download /></el-icon>
					导出截图
				</el-space>
			</boke-button>
		</div> -->
		<div class="m-t-20" ref="screenRef">
			<p class="titme-title">
				<el-space>
					<template v-if="form.type == 'week'">
						<span>{{ dayjs(form.weeks[0]).format('MM-DD') }}</span>
						<span>~</span>
						<span>{{ dayjs(form.weeks[form.weeks.length - 1]).format('MM-DD') }}</span>
						<!-- 判断当前处于第几月的第几周按照周五来计算 -->
					</template>
					<span class="m-l-10 color-content">
						{{ getListTitle() }}
					</span>
				</el-space>
			</p>
			<div class="task-table">
				<el-table :data="taskData" v-loading="loading" border resizable>
					<el-table-column
						v-for="item in getDemandListColumn(props.type)"
						:key="item.label"
						:label="item.label"
						:prop="item.prop"
						:align="item.align"
						:width="item.width"
					>
						<template #default="{ row }">
							<template v-if="item.prop == '人员'">
								<el-space>
									<el-avatar
										:size="28"
										:src="
											getLabel(userOptions, row['人员'], 'header_img_url', userType == 4 ? 'user_id' : 'feishu_user_id')
										"
									/>
									<BokeUserProfile
										:userId="row['人员']"
										:userName="
											getLabel(userOptions, row['人员'], 'label', userType == 4 ? 'user_id' : 'feishu_user_id')
										"
									></BokeUserProfile>
								</el-space>
							</template>
							<template v-else>
								<div>
									<p>
										本周已完成任务 <span class="color-main">{{ row[item.prop]['已完成']?.length }}</span>
									</p>
									<ol class="demand-list">
										<li class="demand-item" v-for="(task, tIndex) in row[item.prop]['已完成']" :key="tIndex">
											<span>{{ tIndex + 1 }}.</span>
											<a @click="handleGOTask(task)">{{ task.demand_name }}</a>
										</li>
									</ol>
									<p class="m-t-10">
										本周进行中任务 <span class="color-main">{{ row[item.prop]['进行中']?.length }}</span>
									</p>
									<ol class="demand-list">
										<li class="demand-item" v-for="(task, tIndex) in row[item.prop]['进行中']" :key="tIndex">
											<span>{{ tIndex + 1 }}.</span>
											<a @click="handleGOTask(task)">{{ task.demand_name }}</a>
										</li>
									</ol>
								</div>
							</template>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</boke-card>
</template>

<script setup>
import { Download } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import html2canvas from 'html2canvas'
import { getFridayOfMonth, getWeekRange, urlDownFile, confirm, getLabel } from '@/utils/tools'
import { useOptionsStore } from '@/stores/modules/common/options'
import { getDemandListColumn } from '@/components/demand/config/column'
import { useUserStore } from '@/stores'
import { getTaskProcessApi } from '@/components/demand/service/task_board_api'
import router from '@/router'

const props = defineProps({
	type: {
		type: String,
		default: 'dev'
	}
})
const userStore = useUserStore()
const optionsStore = useOptionsStore()
const { devUserOptions, dwUserOptions, daUserOptions, dbUserOptions, departmentUserOptions } = storeToRefs(optionsStore)

const taskData = ref([])
const loading = ref(false)
const screenRef = ref(null)
const form = reactive({
	user_id: [],
	date: '',
	weeks: getWeekRange(),
	month: [dayjs().format('YYYY-MM')],
	type: 'week'
})

// 根据type获取用户类型 数仓1 数分2  DB 3 开发4 部门5
const userType = computed(() => {
	if (props.type == 'dev') {
		return 4
	} else if (props.type == 'dw') {
		return 1
	} else if (props.type == 'da') {
		return 2
	} else if (props.type == 'db') {
		return 3
	} else {
		return 5
	}
})
const userOptions = computed(() => {
	if (props.type == 'dev') {
		return devUserOptions.value
	} else if (props.type == 'dw') {
		return dwUserOptions.value
	} else if (props.type == 'da') {
		return daUserOptions.value
	} else if (props.type == 'db') {
		return dbUserOptions.value
	} else {
		return departmentUserOptions.value
	}
})
const getListTitle = () => {
	if (form.type == 'week') {
		return `${dayjs(form.weeks[0]).add(4, 'day').format('MM')}月第${getFridayOfMonth(dayjs(form.weeks[0]).add(4, 'day'))}周`
	} else {
		return `${dayjs(form.month[0]).format('YYYY-MM')}月`
	}
}
const createScreen = () => {
	return new Promise((resolve) => {
		html2canvas(screenRef.value, {
			scale: 2, //按比例增加分辨率 (2=双倍).
			dpi: window.devicePixelRatio * 2, //设备像素比
			useCORS: true, // 开启跨域设置，需要后台设置cors //
			allowTaint: true
			// ignoreElements
		})
			.then((canvas) => {
				// toDataURL函数生成img标签的可用数据  图片格式转成 base64
				const dataURL = canvas.toDataURL('image/jpeg', 1.0)
				// shareVisible.value = true;
				loading.value = false
				resolve({
					dataURL
				})
			})
			.catch((err) => {
				console.log(err)
			})
	})
}
const exportScreen = async () => {
	try {
		await confirm('确定导出吗截图吗？')
		const { dataURL } = await createScreen()
		urlDownFile(dataURL, `任务_${dayjs().format('YYYY-MM-DD')}.png`, true)
	} catch (error) {
		console.log(error)
	}
}
const getTaskOverview = async () => {
	try {
		loading.value = true
		const params = {}
		if (userType.value == 4) {
			params.user_id = form.user_id?.join(',')
		} else {
			params.feishu_user_id = form.user_id?.join(',')
		}
		if (form.type == 'week') {
			params.start_operation_date = form.weeks[0]
			params.end_operation_date = form.weeks[form.weeks.length - 1]
		}
		const res = await getTaskProcessApi(params, userType.value)
		const users = Object.keys(res?.items)
		taskData.value = users.map((user) => {
			return {
				人员: user,
				...res?.items[user]
			}
		})
		console.log(res?.items)
	} catch (error) {
		console.log(error)
	} finally {
		loading.value = false
	}
}
const handleGOTask = (task) => {
	console.log(task)
	let url = ''
	if (userType.value == 4) {
		url = `/demand/tasklist`
	} else if (userType.value == 1) {
		url = `/dw_demand/dw_tasklist`
	} else if (userType.value == 2) {
		url = `/da_demand/da_tasklist`
	} else if (userType.value == 3) {
		url = `/db_demand/db_tasklist`
	}
	router.push({
		path: url,
		query: {
			demand_id: task.demand_id,
			task_id: task.task_id
		}
	})
}
onMounted(() => {
	console.log(userType.value)

	if (userType.value == 4) {
		form.user_id = [userStore.userInfo.id]
	} else {
		form.user_id = [userStore.userInfo.union_id]
	}
	optionsStore.getDepartmentUser(userType.value)
	getTaskOverview()
})
</script>

<style scoped lang="scss">
.overview-container {
	.titme-title {
		font-size: 14px;
		font-weight: 600;
		background-color: var(--boke-bg-color);
		padding: 12px;
	}
	.demand-list {
		padding-left: 1em;
		.demand-item {
			list-style: none;
			a {
				color: var(--boke-color-main);
				cursor: pointer;
				font-size: 13px;
				margin-left: 4px;
				&:hover {
					text-decoration: underline;
				}
			}
		}
	}
	:deep(.el-table) {
		.el-table__inner-wrapper tr .el-table__cell {
			vertical-align: baseline;
		}
	}
}
</style>
