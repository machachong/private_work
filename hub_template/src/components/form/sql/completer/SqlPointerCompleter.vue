<template>
  <div
    class="extra-completer"
    :style="{ top: top + 'px', left: left + 'px' }"
    v-show="modelValue"
    ref="completer"
  >
    <div class="extra-completer-content">
      <div
        class="completer-content-line"
        :class="{ 'is-active': nowActive == index }"
        v-for="(word, index) in words"
        :key="index"
      >
        {{ word }}
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, nextTick, ref, watch } from "vue"

export default defineComponent({
	name: "SqlPointerCompleter",
	props: {
		modelValue: {
			type: Boolean,
			default() {
				return false
			},
		},
		top: {
			type: Number,
			default() {
				return 0
			},
		},
		left: {
			type: Number,
			default() {
				return 0
			},
		},
		words: {
			type: Array,
			default() {
				return []
			},
		},
	},
	emits: ["update:modelValue"],
	setup(props) {
		const completer = ref(null)

		const nowActive = ref(0)

		function addKeyListener() {
			document.addEventListener("keyup", (e) => {
				console.log("向下")
				console.log(e)
			})
		}

		watch(
			() => props.modelValue,
			() => {
				if (props.modelValue) {
					nextTick(() => {
						console.log(completer.value)
						completer.value.focus()
						addKeyListener()
					})
				}
			}
		)

		return { completer, nowActive }
	},
})
</script>

<style scoped>
.extra-completer {
  position: absolute;
  width: 300px;
  min-height: 18px;
  max-height: 150px;
  background-color: #fff;
  border: 1px lightgray solid;
  box-shadow: 2px 3px 5px rgb(0 0 0 / 20%);
  overflow: auto;
}

.extra-completer-content {
  margin-left: 4px;
}

.completer-content-line {
  line-height: 18px;
  height: 18px;
  /* box-sizing: border-box; */
  font-size: 13px;
  padding: 1px;
}

.completer-content-line.is-active {
  background-color: #cad6fa !important;
}

.completer-content-line:hover {
  border: 1px solid #abbffe;
  background-color: rgba(233, 233, 253, 0.4);
  padding: 0;
}
</style>