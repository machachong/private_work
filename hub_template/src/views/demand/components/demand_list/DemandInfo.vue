<template>
	<section>
		<boke-title h3 style="margin-bottom: 10px">需求信息</boke-title>
		<boke-list label-position="top" label="需求名称">{{ demandInfo.demand_name }}</boke-list>
		<boke-list label-position="top" label="系统平台">{{
			getLabel(optionsStore.systemOptions, demandInfo.system)
		}}</boke-list>
		<boke-list label-position="top" label="功能菜单">
			<el-tree-select
				check-strictly
				style="width: 100%"
				disabled
				:render-after-expand="false"
				:modelValue="demandInfo.menu_source"
				:data="options.menuSource"
			/>
		</boke-list>
		<boke-list label-position="top" label="需求类型">{{ getLabel(demandTypeDict, demandInfo.demand_type) }}</boke-list>
		<boke-list label-position="top" label="需求规模" v-if="demandInfo.demand_type == 1">{{
			getLabel(demandScaleDict, demandInfo.demand_scale)
		}}</boke-list>
		<boke-list label-position="top" label="需求内容">
			<el-input
				ref="textarearef"
				type="textarea"
				readonly
				:autosize="{ minRows: 4 }"
				:value="taskInfo?.task_content || taskInfo?.demand_detail?.demand_content || demandInfo.demand_content"
			></el-input>
		</boke-list>
		<boke-list label-position="top" label="需求文档地址">
			<a :href="demandInfo.doc_url" class="link-text" title="doc_url_name" target="_blank">{{ doc_url_name }}</a>
		</boke-list>
		<boke-list label-position="top" label="备注">
			<el-input
				ref="textarearef"
				type="textarea"
				readonly
				:autosize="{ minRows: 4 }"
				:value="demandInfo?.demand_description || taskInfo?.demand_detail?.demand_description"
			></el-input>
		</boke-list>
		<boke-list label-position="top" label="附件">
			<el-image
				style="max-width: 100px; max-height: 80px"
				v-if="resolveImg(demandInfo.attach_img).length"
				:src="resolveImg(demandInfo?.attach_img)[0]"
				preview-teleported
				:preview-src-list="resolveImg(demandInfo?.attach_img)"
			></el-image>
		</boke-list>
		<boke-list label-position="top" label="需求状态">{{
			getLabel(demandStatusDict, demandInfo.demand_status)
		}}</boke-list>
		<boke-list label-position="top" label="需求人">{{
			getLabel(optionsStore.userOptions, demandInfo.demand_assignee_uid)
		}}</boke-list>
		<boke-list label-position="top" label="预期时间">{{
			taskInfo?.deadline_time || demandInfo?.deadline_time
		}}</boke-list>
	</section>
</template>

<script setup>
import { getLabel } from "@/utils/tools"
import { demandTypeDict, demandStatusDict, demandScaleDict } from "../../service/config"
import { useDemandList } from "../../hook/useDemandList.js"
import { reactive } from "vue"
const { resolveImg, getFeishuDocument, getMenuSource } = useDemandList()

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
		default: ""
	},
	optionsStore: {
		type: Object,
		default: () => {
			return {}
		}
	}
})
const textarearef = ref()
const doc_url_name = ref("")
const options = reactive({
	menuSource: []
})
const demandInfo = computed(() => {
	return props.demandRow
})
const taskInfo = computed(() => {
	return props.taskRow
})
watch(
	() => demandInfo.value,
	() => {
		if (demandInfo.value?.doc_url) {
			getFeishuDoc(demandInfo.value?.doc_url)
		}
		if (demandInfo.value.system) {
			getMenuSource(demandInfo.value.system).then((res) => {
				options.menuSource = res
			})
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
const getFeishuDoc = async (url) => {
	const { title = "" } = await getFeishuDocument({ url })
	doc_url_name.value = title || url
}
</script>

<style scoped lang="scss">
.link-text {
	color: var(--boke-color-main);
}
</style>
