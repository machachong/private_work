<template>
	<el-popover placement="bottom" :width="400" trigger="click" ref="popoverRef" :visible="visible">
		<template #reference>
			<boke-button @click="visible = true" class="filter-btn">
				<el-space>
					<i v-if="hasValue" class="iconfont icon-shaixuan1 color-main"></i>
					<i v-else class="iconfont icon-shaixuan2"></i>
					<span>筛选</span>
					<span class="no-read" v-if="hasFilterNum > 0"> {{ hasFilterNum }} </span>
				</el-space>
			</boke-button>
		</template>
		<template #default>
			<section v-click-outside="handleClose">
				<div class="flex-around read-title">
					<span>筛选</span>
					<div class="read-fixed" title="固钉">
						<i class="iconfont icon-relieve color-main" v-if="!isFixed" @click="handleFixed(true)"></i>
						<i class="iconfont icon-relieve-full color-main" v-else @click="handleFixed(false)"></i>
					</div>
				</div>
				<div class="robot-list" v-if="!activeStatus?.robot">
					<div class="color-describe">机器人</div>
					<ul>
						<li
							v-for="item in roubotList"
							:key="item.app_name"
							:class="{ active: form.robot_open_id?.includes(item.open_id) }"
							@click="handleSelect(item, 2)"
						>
							<el-space>
								<el-image style="width: 30px; height: 30px" :src="item.avatar_url"></el-image>
								<span>{{ item.app_name }}</span>
							</el-space>
						</li>
					</ul>
				</div>
				<div class="status-list" v-else>
					<div class="color-describe">状态</div>
					<el-radio-group v-model="form.value" type="vertical" style="width: 100%">
						<span class="status-item" v-for="item in statusDict" :key="item.value" @click="handleSelect(item, 1)">
							<el-radio :value="item.value" size="large">{{ item.label }}</el-radio>
						</span>
					</el-radio-group>
				</div>
				<div class="status-list">
					<div class="color-describe">类型</div>
					<el-checkbox-group v-model="form.send_type">
						<span class="status-item" v-for="item in sendTypeDict" :key="item.value">
							<el-checkbox :label="item.label" :value="item.value"> </el-checkbox>
						</span>
					</el-checkbox-group>
				</div>
				<div class="status-list">
					<div class="color-describe">告警等级</div>
					<el-checkbox-group v-model="form.warn_lv">
						<span class="status-item" v-for="item in warnLevelDict" :key="item.value">
							<el-checkbox :label="item.label" :value="item.value"> </el-checkbox>
						</span>
					</el-checkbox-group>
				</div>
				<div style="text-align: right">
					<el-space>
						<boke-button @click="handleReset">重置</boke-button>
						<boke-button type="primary" @click="handleSubmit">确定</boke-button>
					</el-space>
				</div>
			</section>
		</template>
	</el-popover>
</template>

<script setup>
import { ClickOutside as vClickOutside } from 'element-plus'
import { ref } from 'vue'
import { statusDict, sendTypeDict, warnLevelDict } from '@/views/card_center/config/config.js'
const props = defineProps({
	roubotList: {
		type: Array,
		default: () => []
	},
	activeStatus: {
		type: Object,
		default: () => {
			return {}
		}
	}
})
const emits = defineEmits(['updateStatus'])
const popoverRef = ref()
const form = ref({
	robot_open_id: [],
	value: 1,
	send_type: [],
	warn_lv: []
})
const visible = ref(false)
const isFixed = ref(false) // 是否固定
const hasFilterNum = computed(() => {
	let num = 0
	for (let i in form.value) {
		if (form.value[i]?.length > 0) {
			num += form.value[i]?.length
		}
	}
	return num
})
const hasValue = computed(() => {
	if (
		form.value.robot_open_id?.length > 0 ||
		form.value.send_type?.length > 0 ||
		form.value.warn_lv?.length > 0 ||
		form.value.value != 1
	) {
		return true
	} else {
		return false
	}
})
const handleResetValue = () => {
	form.value.robot_open_id = []
	form.value.value = 1
	form.value.send_type = []
	form.value.warn_lv = []
}
const handleReset = () => {
	form.value.robot_open_id = []
	form.value.value = 1
	form.value.send_type = []
	form.value.warn_lv = []
	handleSubmit()
}
const handleSelect = (value, type) => {
	if (type == 1) {
		form.value.value = value?.value
		form.value.robot_open_id = []
	} else if (type == 2) {
		form.value.value = 1
		if (form.value.robot_open_id?.includes(value?.open_id)) {
			form.value.robot_open_id?.splice(form.value.robot_open_id?.indexOf(value?.open_id), 1)
		} else {
			form.value.robot_open_id.push(value?.open_id)
		}
		// form.value.robot_open_id = value?.open_id
	}
}
const handleClose = () => {
	if (!isFixed.value) {
		visible.value = false
	}
}
const handleSubmit = () => {
	// popoverRef.value?.hide()
	handleClose()
	form.value.type = !!props.activeStatus?.robot
	emits('ok', form.value)
}
const handleFixed = (value) => {
	isFixed.value = value
	if (value) {
		visible.value = true
		// popoverRef.value?.doShow()
	} else {
		visible.value = false
	}
}
watch(
	() => props.activeStatus,
	() => {
		form.value = {
			robot_open_id: [],
			value: 1
		}
	},
	{
		deep: true
	}
)
defineExpose({
	handleReset,
	handleSubmit,
	handleResetValue,
	form
})
</script>

<style scoped lang="scss">
.robot-list {
	ul {
		width: 100%;
		padding: 10px;
		display: flex;
		flex-wrap: wrap;
		box-sizing: border-box;
		gap: 4px;
	}
	li {
		list-style: none;
		width: calc(50% - 8px);
		margin-bottom: 10px;
		padding: 4px 0;
		&:hover {
			background: #ecf0fc;
			cursor: pointer;
		}
		&.active {
			background: #ecf0fc;
		}
	}
}
.status-list {
	padding: 10px;
	.status-item {
		display: inline-block;
		width: 50%;
	}
}
.filter-btn {
	position: relative;
	.no-read {
		position: absolute;
		right: -4px;
		top: -6px;
		background: var(--boke-color-main);
		color: var(--boke-color-fff);
		display: inline-block;
		width: 20px;
		height: 20px;
		border-radius: 20px;
		line-height: 20px;
		font-size: 12px;
		text-align: center;
	}
}
.read-title {
	font-size: 16px;
	line-height: 18px;
	margin-bottom: 8px;
	.read-fixed {
		cursor: pointer;
		font-size: 18px;
		i {
			font-size: 20px;
		}
	}
}
</style>
