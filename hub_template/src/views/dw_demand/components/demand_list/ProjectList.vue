<template>
	<div class="project">
		<boke-title mode="list" h2 class="m-t-8">项目列表</boke-title>
		<div>
			<el-space :size="0">
				<el-input
					class="input-with-select"
					placeholder="请输入项目名称"
					style="width: 160px"
					clearable
					v-model="form.title"
					@keyup.enter="handleSearchTitle"
				>
				</el-input>
				<BokeButton @click="handleSearchTitle" type="primary"
					><el-icon style="margin-top: 5px"><Search /></el-icon
				></BokeButton>
			</el-space>
		</div>
		<section class="project-list" v-loading="projectLoading">
			<span class="list-title">全部项目（{{ newProjectList.length }}）</span>
			<el-scrollbar height="730px">
				<ul v-if="projectList?.length">
					<template v-for="item in newProjectList" :key="item.id">
						<el-tooltip effect="dark" :content="item.name" placement="top-start" :show-after="300">
							<li
								class="project-item"
								:class="{ active: form.project_id?.includes(item.id) }"
								@click="handleSelect(item)"
							>
								{{ item.name }}
							</li>
						</el-tooltip>
					</template>
				</ul>
				<el-empty v-else></el-empty>
			</el-scrollbar>
		</section>
	</div>
</template>

<script setup>
import { Search } from "@element-plus/icons-vue"
import { useDemand } from "../../hook/useDemand"

const emits = defineEmits(["search"])
const { getProjectList, projectList, projectLoading } = useDemand()
const form = reactive({
	title: "",
	project_id: []
})
const newProjectList = ref([])
const handleSearchTitle = () => {
	console.log(form.title)
	if (!form.title) {
		newProjectList.value = projectList.value
	} else {
		newProjectList.value = projectList.value?.filter((item) => {
			return item.name?.includes(form.title)
		})
	}
}
const handleSelect = (item) => {
	const index = form.project_id?.indexOf(item.id)
	if (index >= 0) {
		form.project_id?.splice(index, 1)
	} else {
		form.project_id.push(item.id)
	}
	emits("search", form.project_id)
}
onMounted(() => {
	getProjectList().then(() => {
		newProjectList.value = projectList.value
	})
})
</script>

<style scoped lang="scss">
.project {
	width: 100%;
	.project-list {
		ul {
			// display: block;
			// max-height: calc(720px);
			// overflow-y: auto;
			// overflow-x: hidden;
			padding-bottom: 10px;
			// box-sizing: content-box;
			li {
				list-style: none;
			}
		}
		.list-title {
			line-height: 44px;
			color: var(--boke-color-text-title);
		}
		.project-item {
			line-height: 40px;
			border-radius: 3px;
			font-size: 14px;
			font-family: "puhui-nomal";
			color: var(--boke-color-text-content);
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			padding: 0 10px 0 10px;
			&:hover {
				background: var(--boke-table-th-bg);
				cursor: pointer;
			}
			&.active {
				background: var(--boke-table-current-row-bg-color);
			}
		}
	}
}
</style>
