<template>
	<boke-card>
		<div class="homeview">
			<img class="homeview" v-show="isDark" src="@/assets/img/home/home-welcome-dark.png" alt="" />

			<img
				class="homeview"
				v-show="!isDark"
				src="@/assets/img/home/home-welcome-light.png"
				alt=""
			/>

			<section class="homeview-text">
				<p class="homeview-title">欢迎来到</p>

				<p class="homeview-title">开发后台系统</p>

				<p class="homeview-describee">数据部内部的需求管理，任务管理，机器人管理，系统平台等 </p>

				<p class="homeview-describe"> 您可以在此处查看各类需求，任务，内部流程及相关信息。 </p>
			</section>
		</div>
	</boke-card>
</template>
<script setup>
import { isDark } from "@/composables"
</script>

<style scoped lang="scss">
.homeview {
	margin: 0;
	text-align: right;
	height: calc(100vh - 120px);
	width: auto;
	position: relative;
	.homeview-text {
		position: absolute;
		left: 150px;
		top: 200px;
		text-align: left;
		.homeview-title {
			font-size: 30px;
			margin-bottom: 20px;
		}
		.homeview-describee {
			font-size: 16px;
			line-height: 30px;
		}
	}
}
</style>
