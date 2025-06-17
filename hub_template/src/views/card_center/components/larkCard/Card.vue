<template>
	<div class="lark-card">
		<header class="lark-card__head" :class="`lark-card--${cardHead?.template}`">{{ cardHead?.title?.content }}</header>
		<div class="lark-card__content" v-if="cardCon?.length > 0">
			<LarkComponents :info="cardCon" :row="row"></LarkComponents>
		</div>
		<div v-else>
			<el-empty description="暂无信息" />
		</div>
		<footer></footer>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import LarkComponents from './components/LarkComponents.vue'
const props = defineProps({
	visible: {
		type: Boolean,
		default: false
	},
	row: {
		type: Object,
		default: () => ({})
	},
	showHeader: {
		type: Boolean,
		default: false
	}
})
provide('listRow', props.row)
const cardCon = computed(() => {
	const newRow = JSON.parse(props.row?.card_body || '{}')
	let newCon
	if (newRow?.content) {
		newCon = JSON.parse(newRow?.content)
	} else if (newRow?.card) {
		newCon = newRow?.card
	} else if (newRow?.elements) {
		newCon = newRow
	} else {
		return []
	}

	return newCon?.elements || []
})
const cardHead = computed(() => {
	const newRow = JSON.parse(props.row?.card_body || '{}')
	let newCon
	if (newRow?.content) {
		newCon = JSON.parse(newRow?.content)
	} else if (newRow?.card) {
		newCon = newRow?.card
	} else if (newRow?.header) {
		return newRow?.header
	} else {
		return ''
	}
	console.log(666, newCon)
	return newCon?.header || '飞书卡片'
})
</script>
<style lang="scss" scoped>
.lark-card {
	border: none;
	border-radius: 10px;
	background-color: var(--boke-color-fff);
	box-sizing: border-box;
	width: 605px;
	margin: 0 auto;
	border: 1px solid #dee0e3;
	&__head {
		background-color: #e1eaff;
		background-size: 605px 140px;
		border-bottom: none;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		padding: 12px;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		display: -webkit-box;
		overflow: hidden;
		white-space: pre-wrap;
		color: #245bdb;
		font-size: 16px;
		font-weight: 600;
	}
	&--blue {
		background-color: #e0e9ff;
		color: #1456f0;
	}
	&--wathet {
		background-color: #caeffc;
		color: #076a94;
	}
	&--turquoise {
		background-color: #c4f2ec;
		color: #067062;
	}
	&--green {
		background-color: #d0f5ce;
		color: #1a7526;
	}
	&--yellow {
		background-color: #faedc2;
		color: #ad7a03;
	}
	&--orange {
		background-color: #fee7cd;
		color: #c25705;
	}
	&--red {
		background-color: #fee3e2;
		color: #c02a26;
	}
	&--carmine {
		background-color: #fee2f2;
		color: #b82879;
	}
	&--violet {
		background-color: #f9e2f9;
		color: #a630a6;
	}
	&--purple {
		background-color: #efe6fe;
		color: #7a35f0;
	}
	&--indigo {
		background-color: #e9eafb;
		color: #4752e6;
	}
	&--grey {
		background-color: #8f959e;
		color: #fff;
	}
	&--default {
		background-color: #fff;
		color: initial;
	}
	&__content {
		padding: 0 12px 12px;
	}
}
</style>
