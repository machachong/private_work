import Tracker from '@/utils/tracking/tracker.js'
export const routeChange = (eventName, title, permission_id) => {
	return Tracker.push(
		{
			permission_id,
			name: eventName,
			description: title,
			behavior: 'visit',
			obj: ''
		},
		false,
		permission_id == 1501
	)
}
export default Tracker
