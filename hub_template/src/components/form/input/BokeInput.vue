<template>
	<el-input v-model="value" :placeholder="placeholder"></el-input>
	{{ title }}
</template>

<script setup>
import { defineModel } from 'vue'
const placeholder = defineModel('placeholder', { required: true })
const value = defineModel('value', { required: true })

const { title } = defineProps({
	title: { type: String, default: '' }
})
console.log(title)
</script>

<style scoped lang="scss"></style>
