<template>
	<section class="table-bg">
		<el-table
			class="lark-table"
			ref="tableRef"
			border
			style="width: auto"
			:max-height="500"
			element-loading-text="数据加载中..."
			:data="data"
		>
			<el-table-column
				v-for="col in columns"
				:key="col.name"
				:label="col.display_name"
				:prop="col.name"
				:align="col.horizontal_align ? col.horizontal_align : 'left'"
				:width="col.width == 'auto' ? '' : col.width"
				:show-overflow-tooltip="true"
			>
				<template #default="{ row }">
					<BokeMd v-if="['markdown', 'lark_md']?.includes(col.data_type)" :text="getCellContent(row, col)"></BokeMd>
					<LarkPerson v-else-if="col.data_type == 'persons'" :feishu_user_id="row[col.name]"></LarkPerson>
					<div v-else class="one-line fs-12"> {{ getCellContent(row, col) }}</div>
				</template>
			</el-table-column>
		</el-table>
	</section>
</template>

<script setup>
import { computed } from 'vue'
import LarkPerson from './LarkPerson.vue'
const props = defineProps({
	info: {
		type: Object,
		default: () => {
			return {}
		}
	}
})
const columns = computed(() => {
	return props?.info?.columns || []
})
const data = computed(() => {
	if (Array.isArray(props?.info?.rows)) {
		return props?.info?.rows
	}
	return props?.info?.rows ? JSON.parse(props?.info?.rows) : []
})
const getCellContent = (row, col) => {
	return typeof row[col.name] == 'object' ? row[col.name][0]?.text || row[col.name][0] : row[col.name]
}
</script>

<style scoped lang="scss">
.lark-table {
	margin: 6px 0;
	width: auto;
}
.table-bg {
	display: inline-block;
	width: 100%;
}
:deep(.el-table tr .el-table__cell) {
	padding: 5px 0;
	.markdown-text {
		margin: 0;
	}
	.cell {
		padding: 0 4px;
		white-space: nowrap;
	}
	a {
		color: var(--boke-color-main);
	}
}
</style>
