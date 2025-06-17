<template>
	<!-- <boke-drawer
		:model-value="visible"
		title="邮件预览"
		size="75%"
		destroy-on-close
		@close="handleClose"
	> -->
	<section>
		<div class="email-template" v-html="EmailTemplate"></div>
	</section>
	<!-- </boke-drawer> -->
</template>

<script setup>
const props = defineProps({
	visible: {
		type: Boolean,
		default: false
	},
	row: {
		type: Object,
		default: () => {
			return {}
		}
	}
})
const EmailTemplate = computed(() => {
	if (!props.row?.mail_body) {
		return ''
	}
	const row = props.row?.mail_body.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
	return row
})
</script>

<style scoped lang="scss">
:deep(.email-template) {
	.title {
		margin-bottom: 16px;
	}
	table,
	tr,
	td {
		font:
			11pt verdana,
			arial,
			sans-serif;
		white-space: nowrap;
		color: Black;
		background: #ffffff;
		border: 1px solid #b8b8b8;
		padding: 4px 6px;
	}
	th {
		font:
			bold 10pt 'Microsoft YaHei',
			微软雅黑;
		color: #fff;
		background: #324960;
		font-weight: normal;
		border: 1px solid #b8b8b8;
		padding: 5px 6px;
	}
	a {
		color: var(--boke-color-main);
		text-decoration: underline;
	}
}
</style>
