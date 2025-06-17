<template>
	<el-popover placement="bottom-start" title="" :width="280" trigger="click">
		<template #default>
			<div class="lark-more-content" v-for="(el, index) in info" :key="index" @click="clickEvent(el)">
				{{ el?.text?.content }}
			</div>
		</template>
		<template #reference>
			<el-button class="lark-more"
				><el-icon><More /></el-icon
			></el-button>
		</template>
	</el-popover>
</template>
<script setup>
import { More } from '@element-plus/icons-vue'
import { toRefs } from 'vue'
import { useLark } from '../hook/lark'
const { clickEvent } = useLark()
const props = defineProps({
	info: {
		type: Array,
		default: () => []
	}
})
const { info } = toRefs(props)
</script>
<style scoped lang="scss">
.lark-more {
	padding: 0 30px;
}
</style>
