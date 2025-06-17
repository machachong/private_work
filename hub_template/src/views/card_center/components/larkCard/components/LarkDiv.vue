<template>
	<div class="lark-div">
		<template v-if="infoData.fields">
			<el-row class="lark_row">
				<el-col :span="infoData?.fields?.length == 1 ? 24 : 12" v-for="(item, i) in infoData?.fields" :key="i">
					<BokeMd v-if="item?.text?.tag === 'lark_md'" :text="item?.text?.content"></BokeMd>
					<div v-else>{{ item?.text?.content }}</div>
				</el-col>
			</el-row>
		</template>
		<template v-else>
			<div class="lark-div-combination">
				<div class="combination-left">
					<BokeMd v-if="infoData?.text?.tag === 'lark_md'" :text="infoData?.text?.content"></BokeMd>
					<div v-else class="word-break">{{ infoData?.text?.content }}</div>
				</div>
				<div class="combination-right">
					<lark-button
						class="card-button"
						v-if="infoData?.extra?.tag === 'button'"
						:disabled="getDisabled(infoData?.extra)"
						:type="infoData?.extra?.type"
						@click="clickEvent(infoData?.extra)"
						>{{ infoData?.extra?.text?.content }}</lark-button
					>
					<LarkImg v-if="infoData?.extra?.tag === 'img'" :info="infoData?.extra" width="64px"></LarkImg>
					<template v-if="infoData?.extra?.tag === 'select_static'">
						<!-- 2024-9-23 因为下拉框不能操作，所以禁用下拉框 -->
						<el-select clearable :placeholder="infoData?.extra?.placeholder?.content" disabled>
							<el-option
								v-for="opt in infoData?.extra?.options"
								:key="opt?.value"
								:label="opt?.text?.content"
								:value="opt?.value"
							/>
						</el-select>
					</template>
					<template v-if="infoData?.extra?.tag === 'date_picker'">
						<el-date-picker
							:model-value="infoData?.extra?.initial_date"
							type="date"
							:placeholder="infoData?.extra?.placeholder?.content"
						/>
					</template>
					<template v-if="infoData?.extra?.tag === 'overflow'">
						<LarkMore :info="infoData?.extra?.options"></LarkMore>
					</template>
				</div>
			</div>
		</template>
	</div>
</template>
<script setup>
import LarkMore from './LarkMore.vue'
import LarkImg from './LarkImg.vue'
import LarkButton from './LarkButton.vue'
import { computed } from 'vue'
import { useLark } from '../hook/lark'
const { clickEvent, getDisabled } = useLark()
const props = defineProps({
	info: {
		type: Object,
		default: () => ({})
	}
})
const infoData = computed(() => {
	return props.info
})
// const formateB = (str) => {
// 	let newStr = str.replace(/\*/g, function(match) {
// 		return match.replace(/ /g, "")
// 	})
// 	return newStr
// }
</script>
<style lang="scss" scoped>
.lark-div {
	width: 100%;
	margin: 6px 0;
	display: flex;
	align-items: center;
	&__img {
		width: 16px;
		height: 16px;
	}
	&__text {
		overflow: hidden;
		text-overflow: ellipsis;
		display: inline-block;
		word-break: break-word;
		color: rgb(100, 106, 115);
		font-size: 12px;
		margin-right: 4px;
		padding-right: 2px;
	}
	.language-p,
	.markdown-text {
		white-space: normal;
		word-break: keep-all;
		word-wrap: break-word;
		inset: unset;
		width: 100%;
		p {
			padding: 0;
		}
	}
	.lark_row {
		width: 100%;
	}
	.lark-div-combination {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		width: 100%;
		.combination-left {
			flex: 1;
			width: 0;
		}
		.combination-right {
			width: auto;
		}
	}
}
.word-break {
	word-break: break-all;
}
</style>
