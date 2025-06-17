<template>
	<BokeDetail title="新增需求" back="/demand/demandlist">
		<section class="detail-title">
			<p class="h1">开发组需求收集表</p>
			<p class="h6 color-describe m-t-20">数据平台相关的开发需求请按照下方内容录入</p>
		</section>
		<div class="detail-content">
			<EntryForm @ok="entryOk"></EntryForm>
		</div>
	</BokeDetail>
</template>

<script setup>
import EntryForm from "@/views/demand/components/entry_demand/EntryForm.vue"
const router = useRouter()
const entryOk = () => {
	router.push({
		path:"/demand/demandlist"
	})
}
</script>

<style scoped lang="scss">
.detail-title {
	text-align: center;
}
.detail-content {
	width: 640px;
	margin: 0 auto;
	margin-top: 24px;
}
.show-more {
	text-align: center;
}
</style>
