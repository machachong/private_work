<template>
	<div class="mobile-entry">
		<section class="content">
			<template v-if="!entryStatus">
				<div class="title">开发组需求收集表</div>
				<div class="des">数据平台相关的需求请按照下方内容录入</div>
				<EntryForm mobile @ok="entryStatus = true"></EntryForm>
			</template>
			<div v-else style="padding-top: 100px">
				<el-result icon="success" title="需求录入成功" sub-title="如需再次录入请点击下方按钮">
					<template #extra>
						<boke-button type="primary" @click="entryStatus = false">需求录入</boke-button>
					</template>
				</el-result>
			</div>
		</section>
	</div>
</template>

<script setup>
import { useUserStore } from '@/stores'
import EntryForm from '@/views/demand/components/entry_demand/EntryForm.vue'
const userStore = useUserStore()
const entryStatus = ref(false)
onMounted(() => {
	userStore.getUserInfo()
})
</script>

<style scoped lang="scss">
.mobile-entry {
	padding: 18px;
	background: var(--boke-table-th-bg);
	.content {
		width: 1000px;
		min-height: calc(100vh - 36px);
		height: auto;
		margin: 0 auto;
		background: var(--boke-card-bg);
		position: relative;
		.title {
			font-size: 24px;
			line-height: 32px;
			padding-top: 16px;
			text-align: center;
		}
		.des {
			font-size: 14px;
			line-height: 24px;
			margin-top: 8px;
			margin-bottom: 16px;
			text-align: center;
		}
	}
}
@media screen and (max-width: 1000px) {
	.mobile-entry {
		padding: 18px;
		background: var(--boke-table-th-bg);
		.content {
			width: calc(100vw - 46px);
			min-height: calc(100vh - 36px);
			height: auto;
			margin: 0 auto;
			background: var(--boke-card-bg);
			.title {
				font-size: 24px;
				line-height: 32px;
				padding-top: 16px;
				text-align: center;
			}
			.des {
				font-size: 14px;
				line-height: 24px;
				margin-top: 8px;
				margin-bottom: 16px;
				text-align: center;
			}
		}
	}
}
</style>
