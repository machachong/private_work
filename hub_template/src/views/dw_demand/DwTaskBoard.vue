<template>
	<DashboardBase :type="getDemandType">
		<template #default>
			<boke-card>
				<div class="overview-title">
					<div> </div>
					<!-- <boke-title mode="list">{{ getDemandType == 'dw' ? '数仓需求总览' : 'DBA需求总览' }}</boke-title> -->
					<el-space>
						<div class="w-250">
							<boke-select
								placeholder="请选择统计人员，默认为所有人"
								v-model="form.feishu_user_id"
								:options="dwUserList"
								clearable
								@change="init"
							></boke-select>
						</div>
						<el-date-picker
							v-model="form.date"
							type="daterange"
							value-format="YYYY-MM-DD"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:shortcuts="weekShortcuts"
							@change="init"
							clearable
						/>
					</el-space>
				</div>
				<boke-title mode="list" h3 class="m-t-12 m-l-20">需求状态统计</boke-title>
				<section class="status_acount">
					<div class="top-num">
						<div v-for="(item, index) in overviewList" :key="index" class="num-item">
							<p>
								<span class="num-title">{{ item.title }}</span>
								<span class="num-count">{{ chartData.list1[item.prop] }}</span>
							</p>
							<span class="num-icon"><i class="iconfont icon" :class="item.icon"></i></span>
						</div>
					</div>
					<div class="top-num">
						<div v-for="(item, index) in overview2List" :key="index" class="num-item">
							<p>
								<span class="num-title">{{ item.title }}</span>
								<span class="num-count">{{ chartData.list1[item.prop] }}</span>
							</p>
							<span class="num-icon"><i class="iconfont icon" :class="item.icon"></i></span>
						</div>
					</div>
				</section>
				<section class="chart-part">
					<div class="chart-item chart-pie">
						<boke-title mode="list" h3 class="chart-title">需求来源统计</boke-title>
						<BokeChart :datas="chartData.list2" :options="pieOptions"></BokeChart>
					</div>
					<div class="chart-item chart-bar">
						<boke-title mode="list" h3 class="chart-title">执行人需求统计</boke-title>
						<BokeChart :datas="chartData.list3" type="bar" :options="barOptionsThree"></BokeChart>
					</div>
					<div class="chart-item chart-bar-2">
						<boke-title mode="list" h3 class="chart-title">项目需求分布</boke-title>
						<BokeChart :datas="chartData.list4" type="bar" :options="barOptions"></BokeChart>
					</div>
				</section>
			</boke-card>
		</template>
	</DashboardBase>
</template>

<script setup>
// import dayjs from "dayjs"
import { weekShortcuts } from '@/utils/tools'
import { useOptionsStore } from '@/stores'
import { getDsOverviewApi } from '@/views/dw_demand/service/task_api'
import { useDemand } from '@/views/dw_demand/hook/useDemand'
import DashboardBase from '@/components/demand/DashboardBase.vue'
const { getDemandType } = useDemand()
const { dwUserList, getDwUser } = useDemand()
const optionsStore = useOptionsStore()
const form = reactive({
	date: [],
	demandType: null,
	listLoading: false,
	feishu_user_id: undefined
})
const overviewList = ref([
	{
		title: '需求总数',
		prop: 'total_num',
		icon: 'icon-xiangmujiexiang',
		num: 0
	},
	{
		title: '已完成',
		prop: 'count1_num',
		icon: 'icon-yiwancheng1',
		num: 0
	},
	{
		title: '未完成',
		prop: 'count2_num',
		icon: 'icon-jinhangzhong',
		num: 0
	},
	{
		title: '待认领',
		prop: 'count3_num',
		icon: 'icon-weikaishi',
		num: 0
	}
])
const overview2List = ref([
	{
		title: '今日到期',
		prop: 'count4_num',
		icon: 'icon-renwutiaozheng',
		num: 0
	},
	{
		title: '逾期完成',
		prop: 'count5_num',
		icon: 'icon-jindutibao',
		num: 0
	},
	{
		title: '已逾期',
		prop: 'count6_num',
		icon: 'icon-yanqirenwu',
		num: 0
	}
])
// 数据
const chartData = reactive({
	list1: [],
	list2: [],
	list3: [],
	list4: []
})
const barOptions = computed(() => {
	return {
		xAxis: {
			axisLabel: {
				interval: 0
			}
		},
		legend: {
			position: 'top'
		},
		color: ['#6395FA', '#63DAAB', '#bbb', '#2A9A99', '#FF9EC6', '#859E66'],
		grid: {
			top: '15%',
			left: '5%',
			bottom: '15%',
			right: '5%',
			containLabel: true
		},
		dataZoom: {
			id: 'dataZoomX',
			show: true,
			type: 'slider',
			startValue: 0,
			endValue: 11,
			bottom: 5
		},
		series: {
			barWidth: 20,
			stack: 'total',
			labelPosition: 'inside',
			label: {
				formatter: (params) => {
					const value = params.value[params?.seriesIndex + 1]
					return value == 0 ? '' : value
				}
			}
		}
	}
})
const barOptionsThree = computed(() => {
	return {
		series: {
			barWidth: 14,
			label: {
				formatter: (params) => {
					const value = params.value[params?.seriesIndex + 1]
					return value == 0 ? '' : value
				}
			}
		}
	}
})

const pieOptions = computed(() => {
	return {
		chart_type_id: '2'
	}
})
const setChartValue = (arr, value, key) => {
	arr?.forEach((item) => {
		value[key][0].push(item.user_name || item.project_name)
		value[key][1].push(item?.count1_num || 0)
		value[key][2].push(item?.count2_num || 0)
		value[key][3].push(item?.count3_num || 0)
	})
}
const getTaskOverview = async () => {
	try {
		form.listLoading = true
		const { items } = await getDsOverviewApi(
			{
				begin_time: form.date?.[0] || '',
				end_time: form.date?.[1] || '',
				feishu_user_id: form.feishu_user_id
			},
			getDemandType.value
		)
		chartData.list1 = items?.demand_count
		chartData.list2 = [
			['需求类型', 'TB需求', '内部需求', '标签工单'],
			['需求数量', items?.demand_count?.count8_num, items?.demand_count?.count7_num, items?.demand_count.count9_num]
		]
		// db来源统计判断
		if (getDemandType.value === 'db') {
			chartData.list2 = [
				['需求类型', '内部需求', 'TB需求', '业务工单', '维护工单'],
				[
					'需求数量',
					items?.demand_count?.count7_num,
					items?.demand_count?.count8_num,
					items?.demand_count.count9_num,
					items?.demand_count.count10_num
				]
			]
		}
		chartData.list3 = [['姓名'], ['未认领'], ['进行中'], ['已完成']]
		chartData.list4 = [['项目名称'], ['未认领'], ['进行中'], ['已完成']]
		setChartValue(items?.user_count, chartData, 'list3')
		setChartValue(items?.project_count, chartData, 'list4')
		form.listLoading = false
	} catch (error) {
		form.listLoading = false
		console.log(error)
	}
}
const init = () => {
	getTaskOverview()
}
onMounted(() => {
	getDwUser()
	optionsStore.getUserOptions()
	init()
})
</script>

<style scoped lang="scss">
.status_acount {
	display: flex;
	padding: 0 20px;
	.top-num {
		display: flex;
		align-items: center;
		padding-left: 44px;
		gap: 24px;
		width: 40%;
		.num-item {
			width: 30%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 24px;
			background: #eaf3fe;
			border-radius: 10px;
			padding: 28px 30px 24px 24px;
			box-shadow: 3px 3px 6px 0px #f2f3f5;
			background-color: rgba(247, 207, 198, 0.3);
			&:last-child {
				border: none;
			}
			.num-icon {
				display: block;
				width: 36px;
				border-radius: 10px;
				margin-top: 34px;
				.icon {
					font-size: 36px;
					margin: 10px;
				}
			}
			.num-title {
				display: block;
				color: var(--boke-color-text-content);
				margin-bottom: 20px;
				font-size: 16px;
				font-weight: 600;
			}
			.num-count {
				display: block;
				color: var(--boke-color-text-title);
				font-size: 24px;
			}
		}
		&:first-child {
			width: 55%;
			padding-left: 0px;
			padding-right: 44px;
			border-right: 1px solid var(--boke-search-divider-color);
			.num-item {
				width: 22%;
				background-color: rgba(243, 233, 254, 0.5);
				&:first-child {
					background-color: rgba(234, 243, 254, 0.5);
				}
			}
		}
	}
}

.chart-part {
	padding: 30px 20px 0 20px;
	display: flex;
	gap: 2%;
	flex-wrap: wrap;
	.chart-item {
		background-color: var(--boke-table-th-bg);
		width: 30%;
		height: 300px;
		margin-bottom: 24px;
		padding-top: 16px;
		position: relative;
		border-radius: 6px;
	}
	.chart-bar {
		width: 68%;
	}
	.chart-bar-2 {
		width: 100%;
		height: 350px;
	}
	.chart-title {
		position: absolute;
		top: 10px;
		left: 16px;
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
.overview-title {
	display: flex;
	width: 100%;
	justify-content: space-between;
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
