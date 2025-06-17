<template>
	<boke-card>
		<div class="flex-around">
			<boke-title>里程碑计划</boke-title>
			<el-space>
				<el-icon class="f-s-18 pointer color-main" @click="init" v-permission="120604"><Refresh /></el-icon>
				<div class="w-250">
					<boke-select v-model="form.year_num" :options="yearsDict" clearable placeholder="请选择年份" @change="init">
					</boke-select>
				</div>
				<boke-button type="primary" :icon="Plus" @click="visible.add = true" v-permission="120601"
					>新建里程碑</boke-button
				>
			</el-space>
		</div>
		<!-- <div class="flex-around m-t-16">
			<div class="w-250">
				<boke-select
					v-model="form.year"
					:options="yearsDict"
					clearable
					placeholder="请选择年份"
					@change="handleYearChange"
				>
				</boke-select>
			</div>
			<boke-button type="primary" :icon="Plus" @click="visible.add = true">新建里程碑</boke-button>
		</div> -->
		<section class="milestone-list" v-loading="milestoneLoading">
			<VueDraggable
				ref="dragRef"
				:animation="150"
				v-model="timelineItems"
				handle=".item-move"
				ghostClass="ghost"
				@start="onStart"
				@end="onEnd"
			>
				<div
					v-for="lineItem in timelineItems"
					:key="lineItem.i"
					class="milestone-item"
					:class="{
						start: lineItem.status == 0,
						pendding: lineItem.status == 1,
						end: lineItem.status == 2
					}"
				>
					<div class="flex-around item-head">
						<boke-title mode="list" style="padding: 10px 0">
							<MilestoneInfo :title="lineItem.milestone_name" :row="lineItem" @ok="handleFresh"></MilestoneInfo>
						</boke-title>
						<el-space :size="12" class="item-handle">
							<el-icon class="f-s-18 item-move"><Rank /></el-icon>
							<el-icon class="f-s-18 pointer item-delete" v-permission="120602" @click="handleDelete(lineItem)"
								><Delete
							/></el-icon>
						</el-space>
					</div>
					<el-scrollbar>
						<BokeTimeLine mode="horizontal" :list="lineItem.node_info" direction="row">
							<template #content="{ item }">
								<div class="timeline-title">
									<el-tag type="success" v-if="item.status == -1"> 开始 </el-tag>
									<el-tag v-else effect="light" :type="getLabel(statusDict, item.status, 'type')">
										<NodeInfo
											ref="nodeInfoRef"
											:milestoneId="lineItem.id"
											:item="item"
											:milestone_id="routeParams.milestone_id"
											:node_id="routeParams.node_id"
											@ok="init"
										></NodeInfo>
									</el-tag>
								</div>
								<p class="color-content" v-if="item.status >= 0">状态：{{ getLabel(statusDict, item.status) }}</p>
								<p class="color-describe m-t-8">
									<span v-if="item.status == 2">完成时间：{{ item.deadline_time }}</span>
									<span v-else>预计时间：{{ item.deadline_time }}</span>
								</p>
							</template>
						</BokeTimeLine>
					</el-scrollbar>
				</div>
				<el-empty v-if="timelineItems?.length == 0"></el-empty>
			</VueDraggable>
		</section>
		<AddMilestone v-model="visible.add" @ok="init"></AddMilestone>
		<NodeInfo
			style="display: none"
			v-if="routeParams.visible"
			ref="nodeInfoRef"
			:milestone_id="routeParams.milestone_id"
			:node_id="routeParams.node_id"
			@ok="init"
		></NodeInfo>
	</boke-card>
</template>

<script setup>
import { Rank, Delete, Plus, Refresh } from '@element-plus/icons-vue'
import { statusDict, yearsDict } from './config/config'
import { getLabel } from '@/utils/tools'
import { VueDraggable } from 'vue-draggable-plus'
import { delMilestoneApi, updatePositionApi } from './service'
import { useMilestone } from './service/useMilestone'
import { deleteMiliestone, searchMiliestone } from './service/track'
import { message, confirm } from '@/utils/tools'
import AddMilestone from '@/views/milestone/components/AddMilestone.vue'
import MilestoneInfo from '@/views/milestone/components/MilestoneInfo.vue'
import NodeInfo from '@/views/milestone/components/NodeInfo.vue'

const route = useRoute()
const { getMilestoneList, milestoneLoading } = useMilestone()
const dragRef = ref()
const dragAnimatRef = ref(false)
const timelineItems = ref([])
const visible = ref({
	add: false
})
const nodeInfoRef = ref()
const routeParams = ref({
	milestone_id: '',
	node_id: '',
	visible: false
})
const form = reactive({
	year_num: 2025,
	page: 1,
	size: 1000
})
function onStart() {
	dragAnimatRef.value = true
}
function onEnd() {
	console.log('onEnd')
	nextTick(() => {
		dragAnimatRef.value = false
		handleUpdatePosition()
	})
}
const handleDelete = async ({ id, milestone_name }) => {
	try {
		await confirm('确定删除吗？')
		await delMilestoneApi({
			id
		})
		deleteMiliestone({
			params: {
				里程碑ID: id,
				里程碑名称: milestone_name
			}
		})
		init()
		message.success('删除成功')
	} catch (error) {
		console.log(error)
	}
}
const handleFresh = () => {
	init()
	searchMiliestone()
}
// 更新位置
const handleUpdatePosition = async () => {
	try {
		console.log(timelineItems.value)
		const position_data = timelineItems.value.map((item, index) => {
			return {
				id: item.id,
				position: index
			}
		})
		console.log(position_data)
		await updatePositionApi({
			position_data: JSON.stringify(position_data)
		})
		message.success('移动位置成功')
	} catch (error) {
		console.log(error)
	}
}
const init = async () => {
	const res = await getMilestoneList(form)
	timelineItems.value = res?.items || []
}
const getRouteParams = () => {
	routeParams.value.milestone_id = route.query?.milestone_id
	routeParams.value.node_id = route.query?.node_id
	console.log(routeParams.value.milestone_id, routeParams.value.node_id)

	if (routeParams.value.milestone_id && routeParams.value.node_id) {
		routeParams.value.visible = true
		nextTick(() => {
			console.log(nodeInfoRef)
			nodeInfoRef.value?.activlyOpen()
		})
	}
}
onMounted(() => {
	init()
	getRouteParams()
})
onActivated(() => {
	init()
	getRouteParams()
})
</script>

<style lang="scss" scoped>
.milestone-list {
	width: 100%;
	margin-top: 4px;
	padding: 20px 6px 0 6px;
	box-sizing: content-box;
	overflow: hidden;
	// max-height: calc(100vh - 230px);
	.milestone-item {
		padding: 44px 20px 0 20px;
		box-sizing: border-box;
		margin-bottom: 24px;
		border-radius: 0 6px 6px 0;
		border-left: 8px solid var(--boke-color-text-disable);
		height: 170px;
		overflow-x: auto;
		position: relative;
		&.start {
			border-color: var(--boke-color-text-disable);
		}
		&.pendding {
			border-color: var(--boke-color-main);
		}
		&.end {
			border-color: var(--boke-color-success);
		}
		&:hover {
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		}
		.item-head {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			padding: 0 20px;
			box-sizing: border-box;
		}
		.item-move {
			cursor: move;
			&:hover {
				color: var(--boke-color-main);
			}
		}
		.item-delete {
			&:hover {
				color: var(--boke-color-fail);
			}
		}
	}
	.timeline-title {
		position: absolute;
		top: -50px;
		left: 50%;
		transform: translateX(-50%);
	}
}
.ghost {
	opacity: 0.5;
	background: #c8ebfb;
}
</style>
