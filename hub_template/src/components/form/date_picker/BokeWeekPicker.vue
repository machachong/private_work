<template>
	<div class="el-input week-picker__wrapper" :class="{ 'is-disabled': disabled }">
		<el-date-picker
			ref="datePickerRef"
			v-model="date"
			type="week"
			:disabled="disabled"
			@update:modelValue="onDateChange"
		/>
		<div class="el-input__wrapper" @click="onDatePick">
			<span class="el-input__prefix">
				<span class="el-input__prefix-inner">
					<el-icon><Calendar /></el-icon>
				</span>
			</span>
			<div class="el-input__inner">
				{{ dateString }}
			</div>
			<span class="el-input__suffix" v-if="!disabled" @mouseenter="showClear = true" @mouseleave="showClear = false">
				<span class="el-input__suffix-inner">
					<template v-if="showClear && clearable && date">
						<el-icon @click.stop="onClear"><CircleClose /></el-icon>
					</template>
					<template v-else>
						<el-icon><ArrowDown /></el-icon>
					</template>
				</span>
			</span>
		</div>
	</div>
</template>

<script>
import { ArrowDown, CircleClose, Calendar } from '@element-plus/icons-vue'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { dateFormat, dateParse } from '@/utils/tools'

export default defineComponent({
	name: 'BokeWeekPicker',
	components: {
		ArrowDown,
		CircleClose,
		Calendar
	},
	props: {
		modelValue: {
			type: String,
			default() {
				return ''
			}
		},
		// 返回周几，默认返回周一
		week: {
			type: Number,
			default() {
				return 1
			}
		},
		weeks: {
			type: Array,
			default() {
				return []
			}
		},
		disabled: Boolean,
		clearable: Boolean
	},
	emits: ['update:modelValue', 'update:weeks', 'change'],
	setup(props, ctx) {
		const datePickerRef = ref(null)

		// const date = computed(() => {
		//   if (props.modelValue && props.modelValue.length > 0) {
		//     return dateParse(props.modelValue[0]);
		//   }
		//   return "";
		// });

		const date = computed({
			get() {
				if (props.modelValue) {
					return dateParse(props.modelValue)
				} else if (props.weeks && props.weeks.length >= props.week) {
					return dateParse(props.weeks[props.week - 1])
				}
				return ''
			},
			set(val) {
				let weeks = []
				if (val) {
					weeks = getWeeks(val)
					ctx.emit('update:modelValue', weeks[props.week - 1])
				} else {
					ctx.emit('update:modelValue', '')
				}
				ctx.emit('update:weeks', weeks)
			}
		})

		function getMonthWeek(a, b, c) {
			/**
			 * a = d = 当前日期
			 * b = 6 - w = 当前周的还有几天过完(不算今天)
			 * a + b 的和在除以7 就是当天是当前月份的第几周
			 */
			var date = new Date(a, parseInt(b) - 1, c),
				w = date.getDay(),
				d = date.getDate()
			// if (w == 0) {
			//   w = 7;
			// }
			var config = {
				getMonth: date.getMonth() + 1,
				getYear: date.getFullYear(),
				getWeek: Math.ceil((d + 6 - w) / 7)
			}
			return config
		}

		const dateString = computed(() => {
			const getDate = getMonthWeek(
				dateFormat('YYYY', date.value),
				dateFormat('mm', date.value),
				dateFormat('dd', date.value)
			)
			const _weeks = date.value ? getWeeks(date.value, 'm-d') : []
			return date.value
				? `${_weeks[0]}~${_weeks[_weeks.length - 1]} ${dateFormat('m月', date.value)}第${getDate.getWeek}周`
				: ''
		})

		function getWeeks(date = new Date(), format = 'YYYY-mm-dd') {
			const weeks = []

			const day = date.getDay()
			// 此处周一为第一天，所以index从1开始
			for (let index = 1; index < day; index++) {
				const newDate = new Date()
				newDate.setTime(date.getTime() - 24 * 3600 * 1000 * (day - index))
				weeks.push(dateFormat(format, newDate))
			}
			for (let index = day; index <= 7; index++) {
				const newDate = new Date()
				newDate.setTime(date.getTime() + 24 * 3600 * 1000 * (index - day))
				weeks.push(dateFormat(format, newDate))
			}
			return weeks
		}

		const onDatePick = () => {
			if (props.disabled) {
				return
			}
			datePickerRef.value?.handleOpen?.()
		}

		const onDateChange = (val) => {
			ctx.emit('change', val)
		}

		const showClear = ref(false)

		const onClear = () => {
			date.value = ''
		}

		onMounted(() => {
			if (props.modelValue) {
				const weeks = getWeeks(dateParse(props.modelValue))
				ctx.emit('update:weeks', weeks)
			}
		})

		return {
			datePickerRef,
			date,
			dateString,
			onDatePick,
			onDateChange,
			showClear,
			onClear
		}
	}
})
</script>

<style scoped lang="scss">
.week-picker__wrapper {
	:deep(.el-date-editor) {
		position: absolute;
		top: var(--el-input-height);
		left: 30%;
	}
	:deep(.el-date-editor.el-input) {
		width: 0;
		height: 0;
	}

	:deep(.el-date-editor.el-input .el-input__wrapper) {
		display: none;
	}
}
.week-picker__wrapper {
	/* width: 100%;
  line-height: 32px;
  height: 32px; */
}
</style>
