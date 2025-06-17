<template>
	<BokeCard>
		<section class="flex-around">
			<div class="h5 p-b-22">接口日志概览</div>
			<div>
				<el-space>
					<el-radio-group v-model="form.shotActive" @change="changeShot">
						<el-radio-button v-for="item in timeShortcutsWeek" :key="item.text" :label="item.text" :value="item.text" />
					</el-radio-group>
					<el-date-picker
						v-model="form.date"
						class="boke-date-range"
						type="daterange"
						start-placeholder="开始时间"
						end-placeholder="结束时间"
						:clearable="false"
						value-format="YYYY-MM-DD"
						@change="changeShot(false)"
					/>
				</el-space>
			</div>
		</section>
		<section class="board-chart m-t-20">
			<boke-card class="chart-item col-10">
				<div class="flex-around">
					<boke-title>系统平台接口执行次数统计</boke-title>
				</div>
				<div class="chart-height">
					<boke-chart type="ring" :datas="boardData.system_data" :options="systemOptions" v-loading="boardData.system_loading"></boke-chart>
				</div>
			</boke-card>
			<boke-card class="chart-item col-14">
				<div class="flex-around">
					<boke-title>状态码统计（总数300）</boke-title>
				</div>
				<div class="chart-status" v-loading="boardData.system_loading">
					<div class="chart-height left">
						<boke-chart type="ring" :datas="boardData.code_data" :options="codeOptions"></boke-chart>
					</div>
					<div class="right">
						<div class="title1">接口执行总数</div>
						<div class="title2"
							><span class="count">{{ boardData.total }}</span
							>条</div
						>
						<div class="code-status">
							<p class="code-left">
								<span class="code-percent color-fail">{{ boardData.fail }}%</span>
								<span class="code-title">异常状态码占比</span>
								<el-progress class="code-progress" :percentage="boardData.fail * 100" :show-text="false" :stroke-width="8" status="exception" />
							</p>
							<p class="code-right">
								<span class="code-percent color-success">{{ boardData.success }}%</span>
								<span class="code-title">200状态码占比</span>
								<el-progress class="code-progress" :show-text="false" :percentage="boardData.success * 100" :stroke-width="8" status="success" />
							</p>
						</div>
					</div>
				</div>
			</boke-card>
			<boke-card class="chart-item col-12">
				<el-space class="flex-around">
					<boke-title>接口执行时间段分布</boke-title>
					<boke-select
						v-model="overviewDateData.active"
						:options="overviewDateData.dict"
						placeholder="请选择"
						@change="changeDate(overviewDateData.detail)"
						style="width: 250px"
					></boke-select>
				</el-space>
				<div class="chart-height" style="height: 350px">
					<boke-chart type="line" :datas="boardData.time_data" v-loading="boardData.time_data_loading" :options="timeOptions"></boke-chart>
				</div>
			</boke-card>
			<boke-card class="chart-item col-12" v-loading="boardData.rank_loading">
				<div class="flex-around">
					<boke-tabs size="small" v-model:active="form.tab" :tabs="tabs" noUrlChange></boke-tabs>
				</div>
				<div class="chart-height">
					<BokeRankList v-if="form.tab == 1" :columns="rank_count_columns" :lists="boardData.rank_count" scroll>
						<template #ex_url_path="scope">
							<el-tooltip :content="scope?.row?.ex_url_path" placement="top">
								<span class="table-link" @click="handleGoUrl(scope, 1)">{{ scope?.row?.ex_url_path }}</span>
							</el-tooltip>
						</template>
					</BokeRankList>
					<BokeRankList v-if="form.tab == 2" :columns="rank_time_columns" :lists="boardData.rank_max_time" scroll>
						<template #cost_time="{ row }"> {{ row.cost_time }}s </template>
						<template #ex_url_path="scope">
							<el-tooltip :content="scope?.row?.ex_url_path" placement="top">
								<span class="table-link" @click="handleGoUrl(scope, 2)">{{ scope?.row?.ex_url_path }}</span>
							</el-tooltip>
						</template>
					</BokeRankList>
					<BokeRankList v-if="form.tab == 3" :columns="rank_time_columns" :lists="boardData.rank_avg_time" scroll>
						<template #cost_time="{ row }">{{ row.cost_time }}s </template>
						<template #ex_url_path="scope">
							<el-tooltip :content="scope?.row?.ex_url_path" placement="top">
								<span class="table-link" @click="handleGoUrl(scope, 2)">{{ scope?.row?.ex_url_path }}</span>
							</el-tooltip>
						</template>
					</BokeRankList>
				</div>
			</boke-card>
		</section>
	</BokeCard>
</template>

<script setup>
import dayjs from 'dayjs'
import { timeShortcutsWeek, getLabel } from '@/utils/tools'
import { getOverviewApi, getOverviewRankApi, getOverviewDateApi } from './service/back_log_report_api.js'
import { rank_time_columns, rank_count_columns, useCodeDict } from './service/config'
const router = useRouter()
// const options = reactive({
// 	system_list: []
// })
const boardData = ref({
	total: 0,
	fail: 0,
	success: 0,
	system_data: [],
	system_loading: false,
	rank_loading: false,
	rank_count: [],
	rank_max_time: [],
	rank_avg_time: [],
	time_data: [],
	time_data_loading: false
}) // 看板数据
const tabs = ref([
	{
		label: '接口执行次数top20',
		name: 1
	},
	{
		label: '接口执行时长top20',
		name: 2
	},
	{
		label: '接口平均执行时长top20',
		name: 3
	}
])
const form = ref({
	shotActive: '过去一周',
	date: [],
	tab: 1
})
const timeOptions = computed(() => {
	return {
		grid: {
			top: '12%',
			left: '5%',
			bottom: '15%',
			right: '5%',
			containLabel: true
		}, // 设置图表间距
		series: {
			smooth: 0.2,
			// maxmin: true,
			markLine: false,
			barWidth: 20, // 柱状图宽度
			barLine: null,
			barLineIndex: null,
			showBackground: false,
			labelShow: false,
			labelPosition: 'top',
			radius: 48,
			lineStyle: {
				width: 2,
				type: 'solid'
			},
			labelLine: {
				show: true
			},
			symbol: 'none',
			areaStyle: {
				color: null,
				shadowColor: null,
				opacity: null
			}
		}
	}
})
const systemOptions = computed(() => {
	return {
		tooltip: {
			confine: true,
			trigger: 'item',
			show: true
		}
	}
})
const codeOptions = computed(() => {
	return {
		tooltip: {
			confine: true,
			trigger: 'item',
			show: true,
			formatter: function (value) {
				console.log(2323, value)
				return `${value?.seriesName}: ${value?.value[0]}(${getLabel(useCodeDict, value?.value[0], 'des')})  ${value?.value[1]}`
			}
		},
		series: {
			smooth: 0.2,
			maxmin: false,
			markLine: false,
			barWidth: 20, // 柱状图宽度
			barLine: null,
			barLineIndex: null,
			showBackground: false,
			labelShow: true,
			labelPosition: 'top',
			radius: 56,
			lineStyle: {
				width: 2,
				type: 'solid'
			},
			labelLine: {
				show: true,
				length: 20
			},
			areaStyle: {
				color: null,
				shadowColor: null,
				opacity: null
			}
		}
	}
})
const getParams = () => {
	const [start_operation_date, end_operation_date] = form.value.date
	return {
		start_operation_date: dayjs(start_operation_date).format('YYYY-MM-DD HH:mm:ss'),
		end_operation_date: dayjs(end_operation_date).format('YYYY-MM-DD HH:mm:ss')
	}
}
const formatData = (value, keyArray) => {
	if (value.length == 0) return []
	const newValue = []
	const keys = Object.keys(value[0])
	keys.forEach((item) => {
		const keyValue = value.map((list) => list[item])
		const firstKey = keyArray?.find((list) => list.value == item)?.label
		newValue.push([firstKey, ...keyValue])
	})
	return newValue
}

// 获取看板数据
const getOverview = async () => {
	try {
		const params = getParams()
		boardData.value.system_loading = true
		const { items } = await getOverviewApi(params)
		boardData.value.system_loading = false
		if (items.resp_data) {
			const successData = items.resp_data?.find((list) => list.resp_code == '200')?.log_num
			boardData.value.total = items.resp_data?.reduce((a, b) => {
				console.log(a, b)
				return a + Number(b.log_num)
			}, 0)
			const failData = items.resp_data
				?.filter((list) => list.resp_code != '200')
				?.reduce((a, b) => {
					return a + Number(b.log_num)
				}, 0)
			console.log(successData, failData, boardData.value.total)
			boardData.value.success = ((successData / boardData.value.total) * 100)?.toFixed(2)
			boardData.value.fail = ((failData / boardData.value.total) * 100)?.toFixed(2)
			boardData.value.code_data = formatData(items.resp_data, [
				{
					label: '状态码',
					value: 'resp_code'
				},
				{
					label: '访问次数',
					value: 'log_num'
				}
			])
		} else {
			boardData.value.total = 0
			boardData.value.success = 0
			boardData.value.fail = 0
		}
		boardData.value.system_data = formatData(items.system_data, [
			{
				label: '系统',
				value: 'system_name'
			},
			{
				label: '请求次数',
				value: 'log_num'
			}
		])
	} catch (error) {
		boardData.value.system_loading = false
		console.log(error)
	}
}
const getOverviewRank = async () => {
	try {
		const params = getParams()
		boardData.value.rank_loading = true
		const { items } = await getOverviewRankApi(params)
		boardData.value.rank_loading = false
		boardData.value.rank_count = items?.rank_count
		boardData.value.rank_max_time = items?.rank_max_time
		boardData.value.rank_avg_time = items?.rank_avg_time
	} catch (error) {
		boardData.value.rank_loading = false
		console.log(error)
	}
}
const changeShot = (value) => {
	if (value) {
		form.value.date = timeShortcutsWeek.find((item) => item.text == value)?.value()
		console.log(111, form.value.date)
	} else {
		form.value.shotActive = ''
	}
	init()
}
const goUrl = (path) => {
	router.push(path)
}
const overviewDateData = ref({
	active: '全部',
	dict: [],
	detail: {}
})
const changeDate = (value) => {
	const items = value[overviewDateData.value?.active]
	console.log(8989, items)
	const dates = Array.from(new Set(items?.map((item) => item.date_flag)))
	const timeField = ['date_flag', ...dates]
	const types = Array.from(new Set(items?.map((item) => item.app_name)))
	console.log(dates, types)
	const newData = types.map((type) => {
		const news = [type]
		dates.forEach((date) => {
			const newItem = items?.find((item) => item.app_name == type && item.date_flag == date)
			if (newItem) {
				news.push(newItem.log_num)
			} else {
				news.push(null)
			}
		})
		return news
	})
	boardData.value.time_data = [timeField, ...newData]
}
// 获取异常数据
const getOverviewDate = async () => {
	try {
		const params = getParams()
		boardData.value.time_data_loading = true
		const { items } = await getOverviewDateApi(params)
		console.log(items)
		overviewDateData.value.dict = Object.keys(items)?.map((item) => {
			return {
				label: item,
				value: item
			}
		})
		overviewDateData.value.detail = items
		changeDate(overviewDateData.value.detail)
		boardData.value.time_data_loading = false
	} catch (error) {
		console.log(error)
		boardData.value.time_data_loadingg = false
	}
}
const handleGoUrl = (scope, type) => {
	const { start_operation_date, end_operation_date } = getParams()
	const params = {
		path: scope?.row?.ex_url_path,
		start_date: start_operation_date,
		end_date: end_operation_date,
		type
	}
	console.log(params)
	goUrl({
		path: '/log/backendapilog',
		query: params
	})
}
const init = () => {
	getOverview()
	getOverviewRank()
	getOverviewDate()
}
onMounted(() => {
	changeShot('过去一周')
})
</script>

<style scoped lang="scss">
.board-overview {
	width: 100%;
	height: auto;
	display: flex;
	gap: 20px;
	align-items: flex-start;
	.overview-item {
		width: 300px;
		height: auto;
		border: 1px solid var(--boke-color-border-divider);
		border-radius: 4px;
		.item-title {
			padding: 16px;
			display: flex;
			gap: 0 10px;
			align-items: center;
			.right {
				margin-left: 10px;
				.title-label {
					font-size: 15px;
					line-height: 20px;
				}
				.title-value {
					font-size: 22px;
					line-height: 28px;
					color: var(--boke-color-text-title);
					@extend .font-medium;
				}
			}
		}
		.item-child {
			padding: 0 16px;
			line-height: 44px;
			font-size: 14px;
			color: var(--boke-color-text-content);
			border-top: 1px solid var(--boke-color-border-divider);
			display: flex;
			gap: 4px;
			align-items: center;
			span {
				display: block;
				width: 33%;
			}
		}
	}
}
.board-chart {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	.chart-item {
		width: calc((100% - 16px) / 2);
		&.col-10 {
			width: calc((100% - 16px) / 24 * 10);
		}
		&.col-14 {
			width: calc((100% - 16px) / 24 * 14);
		}
	}
	.col-8 {
		width: calc((100% - 32px) / 3);
	}
	.chart-height {
		height: 320px;
	}
}
.chart-status {
	display: flex;
	.left {
		width: 50%;
	}
	.right {
		width: 50%;
		margin-top: 27px;
		border-left: 1px solid var(--boke-color-border-divider);
		box-sizing: border-box;
		.title1 {
			font-size: 20px;
			font-weight: 700;
			padding-left: 30px;
			color: var(--boke-color-text-content);
		}
		.title2 {
			font-size: 20px;
			font-weight: 700;
			padding-left: 30px;
			margin-top: 24px;
			color: var(--boke-color-text-content);
			.count {
				color: var(--boke-color-main);
				font-size: 36px;
				margin-right: 6px;
			}
		}
		.code-status {
			display: flex;
			margin-top: 28px;
			border-top: 1px solid var(--boke-color-border-divider);
			.code-left {
				width: 50%;
				padding: 20px 20px 0;
				border-right: 1px solid var(--boke-color-border-divider);
			}
			.code-right {
				width: 50%;
				padding: 20px 20px 0;
			}
			.code-percent {
				margin-top: 22px;
				font-size: 30px;
				display: block;
			}
			.code-title {
				font-size: 13px;
				color: var(--boke-color-text-content);
				display: block;
				margin-top: 16px;
			}
			.code-progress {
				margin-top: 16px;
			}
		}
	}
}
</style>
