<template>
  <boke-text-button @click="visible = true">查看详情</boke-text-button>
  <BokeEditorDialog v-model="visible" :title="title"  :content="jsonValue"  mode="json">
    <!-- <BokeEditor
      :id="`json-editor-${getUuid()}`"
      :model-value="jsonValue"
      mode="json"
      height="500px"
      resizable
      disabled
    > -->
    <!-- </BokeEditor> -->
  </BokeEditorDialog>
</template>

<script setup>
import { ref } from "vue"
// import { getUuid } from "@/utils/tools"
const props = defineProps({
	title: {
		type: String,
		default: ""
	},
	json: {
		type: String,
		default: ""
	}
})
const visible = ref()
const jsonValue = computed(() => {
	return JSON.stringify(props.json ? JSON.parse(props.json) : {},null, "\t")
})
</script>

<style scoped lang='scss'>
</style>
