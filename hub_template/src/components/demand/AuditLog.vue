<template>
	<div :class="{ 'not-side': !isSide }">
		<el-timeline>
			<el-timeline-item
				v-for="log in logs"
				:key="log.id"
				:type="getItemType(log)"
				:hollow="true"
				:timestamp="log.create_time"
				:class="{ 'active-line': log.create_time }"
			>
				<!-- <div>
          <template v-if="!isWaitingNode(log)">
            <span>{{ log.user_name }}</span>
          </template>
          <template v-if="isWaitingNode(log)">
            <span>
              {{ nodeName(log) }}:
              {{ auditUserNames(log) }}
            </span>
          </template>
          【
          <span :class="'my-' + getItemType(log)">
            {{ getItemName(log) }}
          </span>
          】

          <span v-if="log.redirect_user_name">
            至 {{ log.redirect_user_name }}
          </span>
        </div> -->
				<div :class="{ 'my-info': !log.create_time }">
					<div v-if="log.code === 100">
						发起:
						<BokeUserProfile placement="bottom" :user-name="log.user_name" :user-id="log.user_id" />
					</div>
					<div v-else-if="log.code === 102">流程结束</div>
					<div v-else>
						{{ nodeName(log) }}:
						<template v-for="user in auditUserList(log)" :key="user.user_id">
							<span class="user-item">
								<BokeUserProfile placement="bottom" :user-name="user.user_name" :user-id="user.user_id" />
							</span>
						</template>
					</div>
					<div
						class="subtitle my-info"
						v-if="isWaitingNode(log) && auditUserNames(log).indexOf(',') > -1 && log.node_func !== 2"
					>
						一人通过即可
					</div>
					<div class="subtitle" v-if="log.code !== 102 && log.code !== 100">
						<template v-if="!isWaitingNode(log)">
							<span>{{ log.user_name }}</span>
							<!-- <BokeUserProfile
              :user-name="log.user_name"
              :user-id="log.user_id"
            /> -->
						</template>
						<template v-if="isWaitingNode(log)">
							<span>
								{{ auditUserNames(log) }}
							</span>
							<!-- <span>
              <template v-for="user in auditUserList(log)" :key="user.user_id">
                <span class="user-item">
                  <BokeUserProfile
                    :user-name="user.user_name"
                    :user-id="user.user_id"
                  />
                </span>
              </template>
            </span> -->
						</template>
						【
						<span :class="'my-' + getItemType(log)">
							{{ getItemName(log) }}
						</span>
						】
						<!-- 显示当前节点是否是代审批的 -->
						<span v-if="auditUserNames(log).indexOf(log.user_name) === -1"> (代为审批) </span>
						<span v-if="log.redirect_user_name"> 至 {{ log.redirect_user_name }} </span>
					</div>
					<div class="subtitle" v-if="log.audit_remark">
						<span>{{ log.code === 10400 ? '驳回理由' : '备注' }}</span
						>: {{ log.audit_remark }}
					</div>
					<div class="subtitle" v-if="log.call && log.call.length > 0">
						<span>抄送:</span>
						{{ log.call.map((item) => item.user_name).join(', ') }}
					</div>
					<!-- <div class="subtitle" v-if="log.description">
          需求内容:
          <div
            style="
              display: inline-block;
              white-space: pre-wrap;
              word-break: break-all;
              width: 100%;
            "
            v-html="log.description"
          ></div>
        </div> -->
				</div>
			</el-timeline-item>
		</el-timeline>
	</div>
</template>

<script>
import { getLabelOrderLogApi } from './service/demand_api'
import { useRoute } from 'vue-router'

export default defineComponent({
	name: 'AuditLog',
	props: {
		hashId: {
			type: String,
			default: ''
		}
	},
	setup(props) {
		const route = useRoute()
		const isSide = computed(() => {
			return route.path.includes('/side/')
		})

		const logs = ref([])

		function getLogs() {
			if (!props.hashId) return
			console.log(111, props.hashId)
			getLabelOrderLogApi(props.hashId).then((response) => {
				const data = response
				logs.value = data.items
			})
		}

		function getItemType(item) {
			if (!item.create_time) {
				return ''
			}
			if ([10200, 10201, 30200, 20200, 40200].indexOf(item.code) > -1) {
				return 'success'
			} else if ([10400, 10300].indexOf(item.code) > -1) {
				return 'warning'
			} else if ([500, 40400].indexOf(item.code) > -1) {
				return 'danger'
			} else if (item.code == 300) {
				return 'info'
			} else if ([10100, 30100, 20100, 40100].indexOf(item.code) > -1) {
				return 'primary'
			}
			return ''
		}

		function getItemName(item) {
			const dict = {
				10100: '待审批',
				10200: '通过',
				10201: '自动通过',
				10400: '驳回',
				10300: '转交审批',
				30100: '待操作',
				30200: item.node_operate_content ? `已完成${item.node_operate_content}` : '操作完成',
				20100: '待抄送',
				20200: '抄送成功',
				40100: '待系统执行',
				40200: item.node_operate_content || '自动执行成功',
				40400: '自动执行失败',
				100: '发起审批',
				101: '重新发起审批',
				300: '撤销工单',
				500: '关闭工单',
				102: '流程结束'
			}

			return dict[item.code]
		}

		/*
      2022-12-01新增 增加待审批节点的相关逻辑
    */
		// 判断当前节点是否是等待节点(待审批、待操作)
		const isWaitingNode = (item) => {
			return getItemType(item) === 'primary'
		}

		// 获取当前节点的类型文本
		const nodeFuncName = (item) => {
			return item.node_func_name || ''
		}

		// 当前节点的待审批人
		const auditUserNames = (item) => {
			return item.user_names || ''
		}

		// 当前节点的审批人列表
		const auditUserList = (log) => {
			return log.user_names.split(',').map((item, index) => {
				return {
					user_id: log.user_ids[index],
					user_name: item
				}
			})
		}

		// 获取当前节点的节点名称
		const nodeName = (item) => {
			return item.node_name || item.code_name || ''
		}

		watch(
			() => props.hashId,
			() => {
				if (props.hashId) {
					getLogs()
				}
			},
			{
				immediate: true
			}
		)

		return {
			isSide,
			logs,
			getItemType,
			getItemName,
			isWaitingNode,
			nodeFuncName,
			auditUserNames,
			auditUserList,
			nodeName
		}
	}
})
</script>

<style scoped lang="scss">
/* :deep(.el-timeline .el-timeline-item.active-line) {
  --el-timeline-node-color: var(--my-success);
} */

.user-item:not(:last-of-type)::after {
	content: ', ';
}
.el-timeline {
	.el-timeline-item:first-child {
		padding-top: 6px;
	}
}
.not-side :deep(.el-timeline-item__wrapper) {
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	top: 0;
}

.subtitle {
	font-size: 12px;
	margin-top: 8px;
}

:deep(.el-timeline-item__tail) {
	left: 5px;
}
:deep(.el-timeline-item__node--normal) {
	left: 0;
}
</style>
