import { defineComponent, onBeforeMount, resolveComponent, shallowRef } from 'vue'

/**
 * 两个路由使用同一个组件时，需要设置不同的name
 * 将指定组件设置自定义名称
 *
 * @param {String} name 组件自定义名称
 * @param {Component | Promise<Component>} component
 * @return {Component}
 */
export default function createCustomComponent(name, component) {
	return defineComponent({
		name,
		setup() {
			const resolvedComponent = shallowRef(null)
			const loadComponent = async () => {
				try {
					// console.log(66, component instanceof Promise)
					let mod
					if (component instanceof Promise) {
						mod = await component
					} else {
						mod = component
					}
					// console.log(mod)
					resolvedComponent.value = resolveComponent(mod?.default || mod)
				} catch (error) {
					console.error(`查不到组件${name}, error:`, error)
				}
			}

			onBeforeMount(loadComponent)

			return () => {
				return resolvedComponent.value ? h(resolvedComponent.value) : null
			}
		}
	})
}
