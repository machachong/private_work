<template>
	<div class="flex-around">
		<div style="width: 400px; height: 100%"></div>
		<div style="flex: 1; overflow-y: auto">
			<div style="height: 250px; background-color: #eee; width: 100%"></div>
			<div @click="toggle"> 全屏 </div>
			<div class="demo-container" v-no-right-menu ref="docRef">
				<el-table
					:data="tableData"
					size="small"
					class="boke-table small-table"
					style="width: 100%"
					highlight-current-row
					:max-height="isFullscreen ? '100vh' : '720px'"
					@row-contextmenu="handleRowContextmenu"
					@cell-click="handleCellDblclick"
				>
					<el-table-column
						v-for="item in columns"
						:key="item.prop"
						:prop="item.prop"
						:label="item.label"
						:width="item.width"
					>
						<template #default="scope">
							<!-- {{ item.prop }} -->
							<el-input
								:ref="(el) => setInputRef(el, scope.row.id, item.prop)"
								v-show="activeEdit.cell?.prop == item.prop && activeEdit?.cell?.id == scope.row.id"
								v-model="scope.row[item.prop]"
								placeholder="请输入"
								size="small"
								@keyup.enter="handleEnter"
								@blur="handleEnter"
							/>
							<div v-show="!(activeEdit.cell?.prop == item.prop && activeEdit?.cell?.id == scope.row.id)">
								{{ scope.row[item.prop] }}
							</div>
						</template>
					</el-table-column>
				</el-table>
				<div
					class="right-key-container"
					ref="rightKeyContainer"
					v-click-outside="handleClickOutside"
					v-if="showRightMenu"
				>
					<div>
						<boke-text-button type="primary">向下添加一条</boke-text-button>
					</div>
					<div>
						<boke-text-button type="primary">向上添加一条</boke-text-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ClickOutside as vClickOutside } from 'element-plus'
import { useFullscreen } from '@vueuse/core'
import { useTemplateRef } from 'vue'
const columns = [
	{
		prop: 'id',
		label: 'id',
		width: '180'
	},
	{
		prop: 'date',
		label: 'Date',
		width: '180'
	},
	{
		prop: 'name',
		label: 'Name',
		width: '180'
	},
	{
		prop: 'address',
		label: 'Address'
	}
]
const tableData = ref([])
for (let index = 1; index < 100; index++) {
	tableData.value.push({
		date: '2016-05-03',
		name: 'Tom',
		address: 'No. 189, Grove St, Los Angeles',
		id: index
	})
}
const el = useTemplateRef('docRef')

const { toggle, isFullscreen } = useFullscreen(el)
const inputRef = ref([])
const showRightMenu = ref(false)
const rightKeyContainer = ref(null)
const activeEdit = ref({
	cell: null,
	row: null
})
const handleRowContextmenu = (row, column, event) => {
	console.log(row, column, event)
	showRightMenu.value = true
	nextTick(() => {
		rightKeyContainer.value.style.left = event.clientX + 'px'
		rightKeyContainer.value.style.top = event.clientY + 'px'
	})
}
const handleClickOutside = () => {
	showRightMenu.value = false
}
const setInputRef = (el, id, prop) => {
	// 确保对应的对象已初始化
	if (!inputRef.value[Number(id)]) {
		inputRef.value[Number(id)] = {}
	}

	inputRef.value[Number(id)][prop] = el
}
const handleCellDblclick = (row, column) => {
	activeEdit.value.cell = {
		id: row.id,
		prop: column.property
	}
	console.log(inputRef.value)

	inputRef.value[Number(row.id)][column.property]?.focus()
}
const handleEnter = () => {
	activeEdit.value.cell = null
}
</script>
<style lang="scss" scoped>
.demo-container {
	// position: relative;
	width: 100%;
	height: auto;
	.small-table {
		height: auto;
	}
	.right-key-container {
		box-shadow: 1px 1px 5px #eee;
		border: 1px solid #eee;
		position: absolute;
		right: 0;
		top: 0;
		background-color: #fff;
		z-index: 999;
		width: 100px;
		padding: 10px;
		height: auto;
	}
}
</style>
