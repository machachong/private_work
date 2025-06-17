<template>
	<div class="mobile-entry">
		<section class="content">
			<template v-if="!entryStatus">
				<div class="title">{{ getDemandType == 'dw' ? '数仓需求收集表' : 'DBA需求收集表' }}</div>
				<div class="des">{{ getDemandType == 'dw' ? '数据仓库' : 'DBA' }}相关的需求请按照下方内容录入</div>
				<EntryForm isMobile @ok="entryStatus = true"></EntryForm>
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
import { useDemand } from '@/views/dw_demand/hook/useDemand'
import EntryForm from '@/views/dw_demand/components/entry_demand/EntryForm.vue'

const { getDemandType } = useDemand()
const entryStatus = ref(false)
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
