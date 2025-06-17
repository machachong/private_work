<template>
	<section>
		<boke-title h3 style="margin-bottom: 10px">需求信息</boke-title>
		<boke-list label-position="top" label="需求名称">{{ demandInfo.demand_name }}</boke-list>
		<boke-list label-position="top" label="项目名称">{{ getLabel(projectList, demandInfo.project_id) }}</boke-list>
		<boke-list label-position="top" label="需求进度">{{
			getLabel(demandProcessDict, demandInfo.demand_process)
		}}</boke-list>
		<!-- <boke-list label-position="top" label="需求类型" v-if="demandInfo.demand_process < 9">{{
			getLabel(demandTypeDict, taskInfo.task_type)
		}}</boke-list> -->
		<boke-list label-position="top" label="执行人">{{ getUser(demandInfo.accept_executors) }}</boke-list>
		<boke-list label-position="top" label="截止时间">{{
			taskInfo?.deadline_time || demandInfo?.deadline_time
		}}</boke-list>
		<boke-list label-position="top" label="需求人">{{
			getLabel(customUserDict, demandInfo.assignee_feishu_user_id)
		}}</boke-list>
		<boke-list label-position="top" label="需求内容">
			<!-- <BokeMd
				:style="{ width: '250px', padding: '0 10px' }"
				:text="taskInfo?.task_content || taskInfo?.demand_detail?.demand_content || demandInfo.demand_content"
			></BokeMd> -->
			<BokeMdEditor
				:modelValue="taskInfo?.demand_detail?.demand_content || demandInfo.demand_content"
				readonly
				:height="'300px'"
				:width="isMobile ? '100%' : '625px'"
			></BokeMdEditor>
		</boke-list>
		<!-- <boke-list label-position="top" label="需求文档地址">
			<a :href="demandInfo.doc_url" class="link-text" title="doc_url_name" target="_blank">{{
				doc_url_name
			}}</a>
		</boke-list> -->
		<boke-list label-position="top" label="附件">
			<el-image
				style="max-width: 100px; max-height: 80px"
				v-if="resolveImg(demandInfo.attach_img).length"
				:src="resolveImg(demandInfo?.attach_img)[0]"
				preview-teleported
				:preview-src-list="resolveImg(demandInfo?.attach_img)"
			></el-image>
		</boke-list>
		<boke-list label-position="top" label="TB链接" v-if="demandInfo.demand_source == 2"
			><span
				style="display: inline-block; width: auto"
				class="table-link"
				:title="demandInfo?.tb_task_url"
				@click="goUrl(demandInfo?.tb_task_url)"
				>点击跳转</span
			></boke-list
		>
		<!-- <boke-list label-position="top" label="需求描述"><span v-html="demandInfo.demand_description"></span></boke-list> -->
		<boke-list label-position="top" label="交付内容" v-if="demandRow?.demand_process >= 5">
			<PayContent :taskData="demandRow.task_data" :customUserDict="customUserDict"></PayContent>
		</boke-list>
	</section>
</template>

<script setup>
import { getLabel } from '@/utils/tools'
import { demandProcessDict } from '../../service/config'
import { useDemand } from '@/views/dw_demand/hook/useDemand'
import PayContent from '@/views/dw_demand/components/task/PayContent.vue'
const props = defineProps({
	demandRow: {
		type: Object,
		default: () => {
			return {}
		}
	},
	taskRow: {
		type: Object,
		default: () => {
			return {}
		}
	},
	title: {
		type: String,
		default: ''
	},
	optionsStore: {
		type: Object,
		default: () => {
			return {}
		}
	},
	customUserDict: {
		type: Array,
		default: () => []
	},
	projectList: {
		type: Array,
		default: () => []
	},
	isMobile: {
		type: Boolean,
		default: false
	}
})
const { getFeishuDocument, resolveImg, goUrl } = useDemand()
const textarearef = ref()
const doc_url_name = ref('')

const demandInfo = computed(() => {
	return props.demandRow
})
const taskInfo = computed(() => {
	return props.taskRow
})
const getUser = (users) => {
	return users
		?.split(',')
		?.map((item) => {
			return getLabel(props.customUserDict, item)
		})
		?.join(',')
}
const getFeishuDoc = async (url) => {
	const { title = '' } = await getFeishuDocument({ url })
	doc_url_name.value = title || url
}
watch(
	() => demandInfo.value,
	() => {
		if (demandInfo.value?.doc_url) {
			getFeishuDoc(demandInfo.value?.doc_url)
		}
		nextTick(() => {
			textarearef.value?.resizeTextarea()
		})
	},
	{ deep: true, immediate: true }
)
watch(
	() => taskInfo.value,
	() => {
		nextTick(() => {
			textarearef.value?.resizeTextarea()
		})
	},
	{ deep: true, immediate: true }
)
</script>

<style scoped lang="scss">
.link-text {
	color: var(--boke-color-main);
}
</style>
