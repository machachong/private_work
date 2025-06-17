import { getMilestoneListApi, addMilestoneApi, updateMilestoneApi, addNodeApi, updateNodeApi } from './index'
export const useMilestone = () => {
	const milestoneNodeList = ref([])
	const cascaderProps = {
		emitPath: false
	}
	const milestoneLoading = ref(false)
	const getMilestoneNodeList = async () => {
		try {
			if (milestoneNodeList.value?.length == 0) {
				const res = await getMilestoneListApi({
					page: 1,
					size: 10000
				})
				console.log(res)
				milestoneNodeList.value = res?.items?.map((item) => ({
					label: item?.milestone_name,
					value: item?.id,
					// disabled: true,
					children: item?.node_info?.map((node) => ({
						label: node?.node_name,
						value: node?.id
					}))
				}))
			}
		} catch (error) {
			console.log(error)
		}
	}
	const getMilestoneList = async (value) => {
		try {
			milestoneLoading.value = true
			const res = await getMilestoneListApi(value)
			milestoneLoading.value = false
			return res
		} catch (error) {
			milestoneLoading.value = false
			console.log(error)
		}
	}
	const addMilestone = async (value) => {
		try {
			const res = await addMilestoneApi(value)
			return res
		} catch (error) {
			console.log(error)
		}
	}
	const updateMilestone = async (value) => {
		try {
			const res = await updateMilestoneApi(value)
			return res
		} catch (error) {
			console.log(error)
		}
	}
	const addNode = async (value) => {
		try {
			const res = await addNodeApi(value)
			return res
		} catch (error) {
			console.log(error)
		}
	}
	const updateNode = async (value) => {
		try {
			const res = await updateNodeApi(value)
			return res
		} catch (error) {
			console.log(error)
		}
	}

	return {
		getMilestoneList,
		addMilestone,
		updateMilestone,
		addNode,
		updateNode,
		getMilestoneNodeList,
		milestoneNodeList,
		cascaderProps,
		milestoneLoading
	}
}
