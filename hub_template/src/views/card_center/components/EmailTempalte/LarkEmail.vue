<template>
	<section>
		<div v-if="EmailTemplate" class="email-template" v-html="EmailTemplate"></div>
		<div v-else>
			<el-empty description="暂无信息" />
		</div>
	</section>
</template>

<script setup>
const emailInfo = ref()
const EmailTemplate = computed(() => {
	if (!emailInfo.value) {
		return ''
	}
	const row = emailInfo.value.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
	return row
})
onMounted(() => {
	window.parent.postMessage(JSON.stringify({ done: true }), '*')
	window.addEventListener('message', function (e) {
		try {
			if (!e.data) {
				return (emailInfo.value = '')
			} else {
				let data = JSON.parse(e.data)
				emailInfo.value = data?.mail_body
			}
		} catch (error) {
			console.log(222, error)
		}
	})
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
