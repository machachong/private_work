import tracker from '@/utils/tracking'
export const searchTrack = (params) => {
	tracker.push(
		{
			name: 'feishuCardListsearch',
			description: '飞书卡片列表搜索',
			behavior: 'search',
			permission_id: 150101,
			obj: JSON.stringify({
				params
			})
		},
		false,
		true
	)
}
