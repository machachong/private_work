import request from '@/api/service/request'
import settings, { trackConfig, systemId, msgSystemId, trackingIdCookieName, systemPre } from '@/utils/config/settings'
import router from '@/router'
import { dateFormat } from '@/utils/tools'
import navigatorInfo from '@/utils/tracking/browser'

function uuid() {
	var s = []
	var hexDigits = '0123456789abcdef'
	for (var i = 0; i < 32; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
	}
	s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23]
	s.unshift(Math.round(new Date().getTime() / 1000) + '')
	var uuid = s.join('')
	return uuid
}

class Tracker {
	constructor() {
		this.prefix = systemPre
		this.storageKey = systemPre + 'key'
		// 埋点默认全局配置参数
		this.defaultConfig = {
			version: trackConfig.version
		}
		this.userAgent = navigator.userAgent
		this.userAgentInfo = navigatorInfo()
		this.systemId = systemId
		// 事件池
		this.pool = []
		// 池大小
		this.poolSize = trackConfig.poolSize
		// 事件追踪的hashId
		this.trackingId = uuid()
		this.poolInit()
	}

	// 更新追踪cookie
	trackingIdChange() {
		this.trackingId = uuid()
		console.log(this.trackingId)
		document.cookie = `${trackingIdCookieName}=${this.trackingId};path=/`
	}

	poolInit() {
		if (localStorage.getItem(this.storageKey)) {
			this.pool = JSON.parse(localStorage.getItem(this.storageKey))
		}
	}

	// 事件池持久化，防止因浏览器刷新而造成事件丢失
	poolSave() {
		localStorage.setItem(this.storageKey, JSON.stringify(this.pool))
	}

	push(
		event = {
			permission_id: '',
			name: '',
			description: '',
			behavior: '', // visit | click | add | edit | delete
			content: '',
			obj: ''
		},
		immediate = false,
		isMsgCenter = false
	) {
		// 在事件添加之前刷新cookie，然后再进行接口请求，保证和提交给后端的一致
		this.trackingIdChange()

		event = {
			...event,
			...this.defaultConfig,
			name: this.prefix + event.name
		}
		if (isMsgCenter) {
			this.systemId = msgSystemId
		}
		this.pool.push(
			Object.assign(
				{
					timestamp: dateFormat('YYYY-mm-dd HH:MM:SS', new Date()),
					url: document.location.href,
					user_agent: this.userAgent,
					user_agent_info: JSON.stringify(this.userAgentInfo),
					module: router.currentRoute.value.meta?.title || '',
					system_id: this.systemId,
					tracking_id: this.trackingId
				},
				event
			)
		)
		if (['add', 'edit', 'delete'].includes(event.behavior) || immediate || this.pool.length >= this.poolSize) {
			this.send()
		}
		// 在事件添加完成之后刷新cookie
		// this.trackingIdChange();
		this.poolSave()
	}

	send() {
		const postData = new FormData()
		postData.append('batch', JSON.stringify(this.pool))
		request({
			baseURL: settings.API_BOKE_URL,
			url: '/public/event/',
			data: postData,
			method: 'POST'
		})
			.then(() => {})
			.catch((err) => {
				console.log(err)
			})
		this.pool = []
	}
}

export default new Tracker()
