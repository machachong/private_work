<template>
	<div class="boke-detail">
		<div class="detail-header">
			<el-space>
				<i class="iconfont icon-return cursor" @click="backUp"></i>
				<span class="font-medium">{{ title }}</span>
			</el-space>
		</div>
		<div class="detail-content">
			<slot></slot>
		</div>
	</div>
</template>
<script>
export default defineComponent({
	name: "BokeTitle",
	props: {
		title: {
			type: String,
			default: ""
		},
		back: {
			type: String,
			default: ""
		}
	},
	setup(props, contexts) {
		const router = useRouter()
    const backUp = () => {
      if (props.back) {
        router.push({
					path: props.back
				})
      }
			contexts.emit("back")
		}
		return { props, backUp }
	}
})
</script>

<style scoped lang="scss">
.boke-detail {
	background: var(--boke-card-bg);
	border-radius: 10px;
	.detail-header {
		background: var(--boke-title-bg);
		height: 50px;
		line-height: 50px;
		padding: 0 16px;
		border-radius: 10px 10px 0 0;
		color: var(--boke-color-text-title);
		font-size: 18px;
		letter-spacing: 0.3px;
		i {
			font-size: 18px;
		}
	}
	.detail-content {
		padding: 20px 16px;
	}
}
</style>
