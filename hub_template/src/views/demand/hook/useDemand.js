import { storeToRefs } from "pinia"
import { ref } from "vue"
import { getCurrentWorkflowApi } from "@/views/demand/service/demand_api"
import { getLabel } from "@/utils/tools"
import { useOptionsStore } from "@/stores"
import { developerType } from "@/views/demand/service/config"
export const useDemand = (props) => {
	const optionsStore = useOptionsStore()
	const { userOptionsNopart } = storeToRefs(optionsStore)
	const currentTodo = ref()
	const getCurrentWorkflow = async (params) => {
		if (!params) {
			return
		}
		currentTodo.value = ""
		try {
			const { items = [] } = await getCurrentWorkflowApi(params)
			let newName = ""
			if (items.length == 0) return
			items.forEach((item, index) => {
				newName = `${newName}${getLabel(developerType, item.task_type)}${getLabel(
					userOptionsNopart.value,
					item.task_user_id
				)}`
				if (index != items?.length - 1) newName += ","
			})
			currentTodo.value = `请等待${newName}更新`
			console.log(currentTodo)
		} catch (error) {
			console.log(error)
		}
	}
	const getNodeProcess = (item) => {
		return props.developProcess?.filter((itemp) => {
			return itemp.workflow_detail == item.id
		})
	}
	return { currentTodo, getCurrentWorkflow, getNodeProcess }
}
