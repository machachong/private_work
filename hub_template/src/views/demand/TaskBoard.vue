<template>
	<DashboardBase>
		<template #default>
			<boke-card>
				<div class="date-right">
					<span>
						<el-date-picker
							v-model="form.date"
							type="daterange"
							value-format="YYYY-MM-DD"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:shortcuts="weekShortcuts"
							@change="init"
							:clearable="false"
						/>
					</span>
				</div>
				<!-- <boke-title mode="list" h2 style="padding: 0 12px 0 28px" class="m-t-12">需求总览</boke-title> -->
				<section class="top-num">
					<div v-for="(item, index) in overviewList" :key="index" class="num-item">
						<span class="num-icon"><BokeSvg class="icon" :name="item.icon"></BokeSvg></span>
						<p>
							<span class="num-title">{{ item.title }}</span>
							<span class="num-count">{{ item.num }}</span>
						</p>
					</div>
				</section>
				<section class="chart-part">
					<div class="chart-item chart-bar">
						<div class="chart-title">开发需求统计</div>
						<BokeChart :datas="chartData.list1" type="bar"></BokeChart>
					</div>
					<div class="chart-item chart-pie">
						<div class="chart-title">需求类型分布</div>
						<BokeChart :datas="chartData.list2" :options="pieOptions"></BokeChart>
					</div>
					<div class="chart-item chart-loop">
						<div class="chart-title">平台需求分布</div>
						<BokeChart :datas="chartData.list3"></BokeChart>
					</div>
				</section>
			</boke-card>
			<boke-card class="m-t-16 card-part">
				<boke-title mode="list" h2>
					<el-space>
						<span>需求任务看板</span>
						<boke-select
							v-model="form.demandType"
							:options="demandTypeDict"
							@change="changType"
							clearable
							:filterable="false"
							placeholder="请选择需求类型"
						></boke-select>
					</el-space>
				</boke-title>
				<section class="demand-card" v-loading="form.listLoading">
					<template v-if="overviewData?.length > 0">
						<boke-card class="card-item" v-for="(item, itemIndex) in overviewData" :key="item.title">
							<!-- <el-affix target=".card-item" :offset="10"> -->
							<div class="p-l-12">
								<boke-title
									h2
									:class="{
										color1: itemIndex == 0,
										color2: itemIndex == 1,
										color3: itemIndex == 2,
										color4: itemIndex == 3
									}"
									>{{ item.title }}（{{ item.count }}）</boke-title
								>
							</div>
							<!-- </el-affix> -->
							<el-scrollbar :max-height="800">
								<div class="px-16" v-for="sysItem in item?.data" :key="sysItem.system_id">
									<p class="m-t-12">
										<el-space spacer="|">
											<span v-if="itemIndex == 2" class="f-s-16 color-title">
												{{ getLabel(demandProcessDict, sysItem?.demand_process) }}
											</span>
											<span v-else class="f-s-16 color-title">{{ getLabel(systemOptions, sysItem?.system_id) }}</span>
											<span class="f-s-16 color-title">{{
												itemIndex == 2 ? sysItem?.process_count : sysItem?.system_count
											}}</span>
										</el-space>
									</p>
									<div
										v-for="(demand, index) in itemIndex == 2 ? sysItem?.process_data : sysItem?.system_data"
										:key="index"
										class="item-block"
									>
										<p class="item-title" :title="demand.demand_name">
											<DemandDetail isDemand :demand_id="demand.id" title="需求详情" :readonly="true">
												{{ demand.demand_name }}
											</DemandDetail>
										</p>
										<p class="item-content three-line color-describe" :title="demand.demand_content">{{
											demand.demand_content
										}}</p>
										<div
											class="item-jindu"
											:title="demand.demandProcess"
											v-if="itemIndex != 2 && demand?.task_process_detail?.process_content"
										>
											<span>需求进度:</span>
											<p class="item-jindu-content">
												<span class="color-describe" style="margin-right: 6px">{{
													demand?.task_process_detail?.create_time
												}}</span>
												<span class="two-line" v-html="demand?.task_process_detail?.process_content"></span>
											</p>
										</div>
										<div>
											<el-space class="item-user" v-if="itemIndex != 2">
												<span>开始时间:</span>
												<span>{{ formatDate(demand?.start_time) }}</span>
											</el-space>
										</div>
										<div v-if="itemIndex == 0">
											<el-space class="item-user" v-if="itemIndex != 2">
												<span>完成时间:</span>
												<span :class="{ 'color-fail': isOverTime(demand?.end_time, demand?.deadline_time) }"
													>{{ formatDate(demand?.end_time) }}
												</span>
											</el-space>
										</div>
										<div>
											<el-space class="item-user" v-if="itemIndex != 2">
												<span>预期时间:</span>
												<span>{{ formatDate(demand?.deadline_time) }}</span>
											</el-space>
										</div>
										<el-space class="item-user" wrap v-if="itemIndex != 2">
											<span>责任人:</span>
											<!-- uniqueArray(demand?.task_user_detail, 'task_user_id') -->
											<el-tag
												size="small"
												:type="userItem?.task_status == 1 ? 'primary' : 'info'"
												v-for="userItem in uniqueArray(demand?.task_user_detail, 'task_user_id')"
												:key="userItem.task_user_id"
												><span>{{ getLabel(userOptionsNopart, userItem.task_user_id) }}</span></el-tag
											>
										</el-space>
										<p class="item-process" v-if="itemIndex != 2">
											<el-tag
												size="small"
												effect="dark"
												style="border: none"
												class="font-medium"
												:color="getLabel(demandTypeDict, demand.demand_type, 'color')"
												>{{ getLabel(demandTypeDict, demand.demand_type) }}</el-tag
											>
										</p>
									</div>
								</div>
							</el-scrollbar>
						</boke-card>
					</template>
				</section>
			</boke-card>
		</template>
	</DashboardBase>
</template>

<script setup>
import dayjs from 'dayjs'
import { weekShortcuts, getLabel, formatDate } from '@/utils/tools'
import { useOptionsStore } from '@/stores'
import { demandTypeDict, demandProcessDict } from '@/views/demand/service/config'
import { getTaskOverviewApi, getTaskCountApi, getTaskCategoryApi } from '@/views/demand/service/demand_api'
import DemandDetail from './components/demand_list/DemandDetail.vue'
import DashboardBase from '@/components/demand/DashboardBase.vue'
const optionsStore = useOptionsStore()
const { userOptionsNopart, systemOptions } = storeToRefs(optionsStore)
const form = reactive({
	date: [
		dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD'),
		dayjs().endOf('week').add(1, 'day').format('YYYY-MM-DD')
	],
	demandType: null,
	listLoading: false
})
const overviewList = ref([
	{
		title: '已完成',
		icon: 'yiwancheng',
		num: 0
	},
	{
		title: '开发中',
		icon: 'jingxingzhong',
		num: 0
	},
	{
		title: '未排期',
		icon: 'weipaiqi',
		num: 0
	},
	{
		title: '已延期',
		icon: 'yanqi',
		num: 0
	}
])
// 图标数据
const chartData = reactive({
	list1: [],
	list2: [],
	list3: []
})
const overviewData = ref()
const pieOptions = ref({
	chart_type_id: '2'
})
const changType = () => {
	getTaskOverview()
}
const getTaskOverview = async () => {
	try {
		form.listLoading = true
		const { items } = await getTaskOverviewApi({
			begin_time: form.date[0],
			end_time: form.date[1],
			demand_type: form.demandType
		})
		const newList = Object.values(items)
		overviewData.value = newList.map((item, index) => {
			let title = ''
			switch (index) {
				case 0:
					title = '已完成'
					break
				case 1:
					title = '开发中'
					break
				case 2:
					title = '未排期'
					break
				case 3:
					title = '已延期'
					break
				default:
					break
			}
			return {
				...item,
				title
			}
		})
		newList?.forEach((item, index) => {
			overviewList.value[index].num = item.count
		})
		form.listLoading = false
	} catch (error) {
		form.listLoading = false
		console.log(error)
	}
}
const getTaskCount = async () => {
	try {
		const { items } = await getTaskCountApi({
			begin_time: form.date[0],
			end_time: form.date[1]
		})
		const newItems = items.map((item) => {
			return {
				task_user_name: getLabel(userOptionsNopart.value, item.task_user_id),
				...item
			}
		})
		chartData.list1 = [
			['姓名', ...newItems.map((item) => item.task_user_name)],
			['新增功能', ...newItems.map((item) => item?.demand_type1 || 0)],
			['功能优化', ...newItems.map((item) => item?.demand_type2 || 0)],
			['Bug修复', ...newItems.map((item) => item?.demand_type3 || 0)]
		]
	} catch (error) {
		console.log(error)
	}
}
const getTaskCategory = async () => {
	try {
		const { items } = await getTaskCategoryApi({
			begin_time: form.date[0],
			end_time: form.date[1]
		})
		const newDemand = items.demand_type
		chartData.list2 = [
			['需求类型', ...newDemand.map((item) => getLabel(demandTypeDict, item.demand_type))],
			['数量', ...newDemand.map((item) => item?.type_count || 0)]
		]
		const newSystem = items.system
		chartData.list3 = [
			['系统', ...newSystem.map((item) => getLabel(systemOptions.value, item.system_id))],
			['数量', ...newSystem.map((item) => item?.system_count || 0)]
		]
	} catch (error) {
		console.log(error)
	}
}
const uniqueArray = (array, key) => {
	return array.reduce((accumulator, currentValue) => {
		const existing = accumulator.find((obj) => obj[key] === currentValue[key])
		if (!existing) {
			accumulator.push(currentValue)
		}
		return accumulator
	}, [])
}
// 是否超时
const isOverTime = (finish, deadline) => {
	if (dayjs(formatDate(finish)).isSame(formatDate(deadline))) {
		return false
	}
	return dayjs(formatDate(finish)).isAfter(formatDate(deadline))
}
const init = () => {
	console.log('init')

	getTaskOverview()
	getTaskCount()
	getTaskCategory()
}
onMounted(() => {
	optionsStore.getUserOptions()
	optionsStore.getSystemOptions()
})
onActivated(() => {
	console.log('onActivated')
	init()
})
</script>

<style scoped lang="scss">
.top-num {
	padding: 20px;
	display: flex;
	align-items: center;
	gap: 2%;
	.num-item {
		width: 23%;
		border-right: 1px solid var(--boke-search-divider-color);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 20px;
		&:last-child {
			border: none;
		}
		.num-icon {
			width: 50px;
			height: 50px;
			border-radius: 10px;
			background-color: var(--boke-bg-color);
			.icon {
				width: 30px !important;
				height: 30px !important;
				margin: 10px;
			}
		}
		.num-title {
			display: block;
			color: var(--boke-color-text-content);
			margin-bottom: 20px;
		}
		.num-count {
			display: block;
			color: var(--boke-color-text-title);
			font-size: 24px;
		}
	}
}
.chart-part {
	padding: 10px 20px;
	display: flex;
	gap: 1%;
	.chart-item {
		background-color: var(--boke-table-th-bg);
		width: 30%;
		height: 300px;
		position: relative;
	}
	.chart-bar {
		width: 40%;
	}
	.chart-title {
		position: absolute;
		top: 10px;
		left: 10px;
		color: var(--boke-color-text-title);
	}
}
// .card-part {
// background-color: var(--boke-table-th-bg);
// padding: 16px;
// }
.demand-card {
	display: flex;
	gap: 16px;
	min-height: 500px;
	.card-item {
		width: 25%;
		// max-height: 800px;
		:deep(.el-card__body) {
			padding: 20px 0;
		}
		.item-block {
			border: 1px solid var(--boke-search-divider-color);
			border-radius: 4px;
			padding: 6px;
			margin: 10px 0;
			position: relative;
			.item-process {
				position: absolute;
				right: 4px;
				top: 8px;
			}
			.item-title {
				color: var(--boke-color-text-title);
				padding: 5px 0;
				width: calc(100% - 110px);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: var(--boke-color-main);
				cursor: pointer;
			}
			.item-content {
				font-size: 13px;
				margin: 2px 0;
				height: 44px;
			}
			.item-jindu {
				color: var(--boke-color-text-content);
				font-size: 13px;
				margin: 6px 0 2px 0;
				display: flex;
				gap: 6px;
				.item-jindu-content {
					display: block;
					white-space: normal;
					word-break: break-all;
					width: calc(100% - 70px);
					:deep(img) {
						width: 100%;
						height: auto;
					}
				}
			}
			.item-user {
				font-size: 13px;
				margin-top: 6px;
				color: var(--boke-color-text-content);
			}
		}
	}
}
.three-line {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	line-clamp: 3;
	-webkit-line-clamp: 3;
	overflow: hidden;
	/*! autoprefixer: off */
	-webkit-box-orient: vertical;
	white-space: pre-wrap;
}
.date-right {
	display: flex;
	width: 100%;
	justify-content: flex-end;
}
:deep(.color1.boke-title) {
	border-color: #3dd5bb;
}
:deep(.color2.boke-title) {
	border-color: #fca315;
}
:deep(.color3.boke-title) {
	border-color: #8a8a8a;
}
:deep(.color4.boke-title) {
	border-color: #f66462;
}
</style>
