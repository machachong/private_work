<template>
	<boke-button class="card-button" :class="getClass()" :disabled="disabled" :type="getType()"
		><slot></slot
	></boke-button>
</template>

<script setup>
const props = defineProps({
	type: {
		type: String,
		default: 'primary_filled'
	},
	disabled: {
		type: Boolean,
		default: false
	}
})
const getType = () => {
	if (props.type == 'primary_filled') {
		return 'primary'
	}
	if (props.type == 'danger_filled') {
		return 'danger'
	}
	return 'primary'
}
const getClass = () => {
	if (props.type == 'default') {
		return 'default-border'
	}
	if (props.type == 'primary') {
		return 'primary-border'
	}
	if (props.type == 'danger') {
		return 'danger-border'
	}
	if (props.type == 'primary_text') {
		return 'primary-text'
	}
	if (props.type == 'danger_text') {
		return 'danger-text'
	}
}
</script>

<style scoped lang="scss">
.default-border {
	background: none;
	border: 1px solid #d0d3d6;
	border-radius: 6px;
	color: #1f2329;
	font-size: 14px;
	&:hover {
		background: #f2f3f5;
	}
}
.primary-border {
	background: none;
	border: 1px solid #3370ff;
	border-radius: 6px;
	color: #3370ff;
	font-size: 14px;
	&:hover {
		background: #e1eaff;
	}
	&:focus {
		background: #e1eaff !important;
	}
}
.danger-border {
	background: none;
	border: 1px solid #f54a45;
	border-radius: 6px;
	color: #f54a45;
	font-size: 14px;
	&:hover {
		background: #fde2e2;
	}
}
.primary-text {
	background: #e1eaff;
	border-radius: 6px;
	color: #3370ff;
	font-size: 14px;
	&:hover {
		background: #e1eaff;
	}
}
.danger-text {
	background: #fde2e2;
	border-radius: 6px;
	color: #f54a45;
	font-size: 14px;
	&:hover {
		background: #fde2e2;
	}
}
.is-disabled {
	border: none;
	background: #f6f6f6;
	color: var(--boke-color-text-describe);
}
</style>
