<template>
	<div class="workflow-right-container">
		<!-- <boke-tabs v-model:active="active" :tabs="tabs" query-key="rightActive"></boke-tabs> -->
		<!-- <p class="f-s-16">审批流程</p> -->
		<div style="margin-top: 20px"></div>
		<div class="workflow-right-content">
			<audit-log :hashId="hashId"></audit-log>
		</div>
	</div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import AuditLog from './AuditLog.vue'

export default defineComponent({
	name: 'WorkflowRightContainer',
	components: {
		AuditLog
		// OperationLog,
	},
	props: {
		hashId: {
			type: String,
			default: ''
		}
	},
	setup() {
		const active = ref('auditLog')

		const tabs = ref([
			{
				label: '审批流程',
				name: 'auditLog'
			}
			// {
			//   label: "执行日志",
			//   name: "operationLog",
			// },
		])
		return { active, tabs }
	}
})
</script>

<style scoped>
.workflow-right-container {
	width: 100%;
	/* height: 100%; */
	min-height: 300px;
	box-sizing: border-box;
	padding: 0 20px 10px 20px;
	display: flex;
	flex-flow: column;
	overflow: hidden;
}

.workflow-right-content {
	flex: 1;
	overflow-y: auto;
}
</style>
