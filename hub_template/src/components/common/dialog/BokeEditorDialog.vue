<template>
  <boke-dialog
    :value="modelValue"
    append-to-body
    distroy-on-close
    :title="title"
    top="100px"
    :width="width"
    destroy-on-close
    @fullScreen="fullScreen"
    @close="handleClose"
  >
    <sql-editor
      v-if="mode == 'sql'"
      :height="contentH + 'px'"
      :id="'sql-editor-' + getUuid()"
      :disabled="disabled"
      :model-value="content"
      resizable
    ></sql-editor>
    <my-editor
      v-else
      id="json-content1"
      :model-value="content"
      :mode="mode"
      :height="contentH + 'px'"
      resizable
    />
  </boke-dialog>
</template>

<script setup>
import { getUuid } from "@/utils/tools"
import SqlEditor from "@/components/form/sql/SqlEditor.vue"
import MyEditor from "@/components/form/editor/MyEditor.vue"
const props = defineProps({
	disabled: {
		type: Boolean,
		default: true,
	},
	content: {
		type: String,
		default: "",
	},
	mode: {
		type: String,
		default: "sql",
	},
	title: {
		type: String,
		default: "",
	},
	modelValue: {
		type: Boolean,
		default: false,
	},
	width: {
		type: String,
		default: "850px",
	},
	defaultHeight: {
		type: Number,
		default: 600,
	},
})
const emits = defineEmits(["update:modelValue"])
const contentH = ref(props.defaultHeight)
const fullScreen = (val) => {
	const contentHeight = window.innerHeight ? window.innerHeight - 100 : 700
	if (val === false) {
		contentH.value = props.defaultHeight
	} else {
		contentH.value = contentHeight
	}
}
const handleClose = () => {
	emits("update:modelValue", false)
}
</script>

<style scoped lang="scss"></style>
