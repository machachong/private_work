<template>
	<el-button link :type="type" @click="onClick" v-bind="$attrs">
		<span v-if="$slots.default"><slot></slot></span>
	</el-button>
</template>

<script>
import { defineComponent } from "vue"

export default defineComponent({
	name: "BokeTextButton",
	props: {
		type: {
			type: String,
			default: "primary"
		}
	},
	emits: ["click"],
	setup(props, ctx) {
		const onClick = (e) => {
			ctx.emit("click", e)
		}

		return { onClick, props }
	}
})
</script>

<style scoped>
/* .el-button.is-link {
	color: var(--boke-color-main);
} */
</style>
