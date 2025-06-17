import { getRepositoryApi } from "../service/system_api"
export const useSystem = () => {
	const getRepository = async (system_id) => {
		try {
			const { items } = await getRepositoryApi({
				system_id
			})
			return items
		} catch (error) {
			console.log(error)
		}
	}
	return { getRepository }
}
