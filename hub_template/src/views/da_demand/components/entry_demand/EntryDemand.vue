<template>
	<div>
		<boke-button type="primary" v-if="mode == 'claim' && isMobile" @click="visible = true">需求认领</boke-button>
		<boke-text-button v-else-if="mode == 'claim'" @click="handleOpen">需求认领</boke-text-button>
		<boke-button v-else type="primary" @click="handleOpen">
			<el-space>
				<el-icon><Plus /></el-icon>新增需求
			</el-space>
		</boke-button>
		<boke-dialog
			v-model="visible"
			:title="getTitle()"
			width="700px"
			top="10px"
			destroy-on-close
			align-center
			@open="handleOpen"
			@close="handleClose"
		>
			<!-- <section class="detail-title">
				<p class="h1">开发组需求收集表</p>
				<p class="h6 color-describe m-t-20">数据平台相关的开发需求请按照下方内容录入</p>
			</section> -->
			<div class="detail-content">
				<EntryForm
					ref="entryFormRef"
					@ok="entryOk"
					:isMobile="isMobile"
					:mode="newMode"
					:demandRow="newDemandRow"
				></EntryForm>
			</div>
		</boke-dialog>
	</div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import EntryForm from '@/views/da_demand/components/entry_demand/EntryForm.vue'
import { getPoolListApi } from '../../service/demand_api'
import { computed } from 'vue'
import { useDemand } from '../../hook/useDemand'
import { useUserStore } from '@/stores'
import { message } from '@/utils/tools'
const props = defineProps({
	mode: {
		type: String,
		default: ''
	},
	demandRow: {
		type: Object,
		default: () => {
			return undefined
		}
	},
	isMobile: {
		type: Boolean,
		default: false
	},
	cliamStatus: {
		type: Boolean,
		default: false
	}
})
const emits = defineEmits(['reSearch'])
const entryFormRef = ref()
const userStore = useUserStore()
const { getCliamStatus } = useDemand()
const { mode, demandRow } = toRefs(props)
const newDemandRow = computed(() => {
	if (mobileDemand.value) {
		return mobileDemand.value
	} else {
		return demandRow.value
	}
})
const newMode = computed(() => {
	if (mobileDemand.value) {
		return 'claim'
	} else {
		return props.mode == 'claim' ? 'claim' : 'add'
	}
})
const getTitle = () => {
	switch (newMode.value) {
		case 'claim':
			return '需求认领'
		case 'edit':
			return '需求详情'
		default:
			return '新增需求'
	}
}
const entryOk = () => {
	handleClose()
	emits('reSearch')
}
const visible = ref()
const handleOpen = () => {
	visible.value = true
	if (mode.value == 'claim') {
		entryFormRef.value?.init()
	}
}
const mobileDemand = ref()
const handleClaimOpen = async (demand_id) => {
	console.log('打开', props.cliamStatus)

	if (!props.cliamStatus) {
		return false
	}
	try {
		const { items } = await getPoolListApi({
			id: demand_id
		})
		if (items?.length == 0) return message.warning('当前需求不存在')
		if (!getCliamStatus(items[0], userStore.userInfo)) {
			return
		}
		visible.value = true
		mobileDemand.value = items[0]
		entryFormRef.value?.init()
	} catch (error) {
		console.log(error)
	}
}
const handleClose = () => {
	visible.value = false
}
defineExpose({
	handleClaimOpen,
	handleOpen
})
</script>

<style scoped lang="scss">
.detail-title {
	text-align: center;
}
.detail-content {
	// width: 640px;
	margin: 0 auto;
}
.show-more {
	text-align: center;
}
</style>
