<template>
	<div class="lark-note">
		<template v-for="(item, index) in notes" :key="index">
			<el-image
				class="lark-note__img"
				v-if="item?.tag === 'img'"
				:src="item?.img_key"
				:alt="item?.alt?.content"
			></el-image>
			<span class="lark-note__text" v-if="item?.tag === 'plain_text'">{{ item?.content }}</span>
			<!-- standard_icon为字体表情类型，由于没有飞书的表情库所以没办法展示 -->
			<!-- <span class="lark-note__text" v-if="item?.tag === 'standard_icon'">{{ item?.token }}</span> -->
		</template>
	</div>
</template>
<script setup>
import { toRefs, computed } from 'vue'
const props = defineProps({
	info: {
		type: Object,
		default: () => ({})
	}
})
const { info } = toRefs(props)
const notes = computed(() => {
	return info.value?.elements || []
})
</script>
<style lang="scss" scoped>
.lark-note {
	margin: 6px 0;
	display: flex;
	align-items: center;
	&__img {
		width: 16px;
		height: 16px;
	}
	&__text {
		overflow: hidden;
		text-overflow: ellipsis;
		display: inline-block;
		word-break: break-word;
		color: rgb(100, 106, 115);
		font-size: 12px;
		margin-left: 4px;
		padding-right: 2px;
	}
}
.lark-note {
	white-space: pre-line;
	line-height: 1.5;
}
</style>
