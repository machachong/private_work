let settings = null
export const systemId = 12 // 开发后台
export const msgSystemId = 15 // 消息中心
export const systemTitle = import.meta.env.VITE_APP_NAME // 系统名称
export const systemPre = import.meta.env.VITE_APP_PRE // 系统缓存前缀
export const trackingIdCookieName = 'tracking-id' // 埋点时cookie中携带trackingId时的键
export const trackConfig = {
	version: '3.0', // 埋点版本号
	poolSize: 1 // 埋点池上报size
}
console.log(import.meta.env)

if (import.meta.env.DEV) {
	// 开发环境
	settings = {
		BOKE_APP_ID: '413',
		BOKE_feishu_APP_ID: 'cli_9ec255ae153c100d',
		BASE_URL: 'http://172.19.64.144:8083/devplat',
		API_BOKE_URL: 'http://172.19.64.144:8083/api',
		HOME_URL: 'http://172.19.64.144:8083',
		// API_URL: "http://172.18.14.193:8045",
		API_URL: 'http://172.19.64.144:8083/devplat/api',
		LOGIN_URL: 'http://172.19.64.144:8083/login',
		QIZHI_URL: 'https://172.18.5.50/shterm',
		REDIRECT_URL: 'http://bklivetest.pook.com.cn/index.do',
		BOKE_DB_URL: 'http://172.19.64.144:8083', // 老后台地址
		API_AUDIT: 'http://172.19.64.144:8083/audit/api',
		API_SYSTEM: 'http://172.19.64.144:8083/dbsystem/api',
		DQ_API_URL: 'http://172.18.14.208:8030', // boke-db-v2地址
		SYSTEM_URL: 'http://172.19.64.144:8083/dbsystem'
	}
} else {
	if (import.meta.env.VITE_APP_MODE == 'dev') {
		// 测试环境
		settings = {
			BOKE_APP_ID: '413',
			BOKE_feishu_APP_ID: 'cli_9ec255ae153c100d',
			BASE_URL: 'http://172.18.14.191:8080/devplat',
			API_BOKE_URL: 'http://172.18.14.191:8080/v2/api',
			HOME_URL: 'http://172.18.14.191:8080/v2',
			API_URL: 'http://172.18.14.191:8080/devplat/api',
			LOGIN_URL: 'http://172.18.14.191:8080/v2/login',
			QIZHI_URL: 'https://172.18.5.50/shterm',
			REDIRECT_URL: 'http://bklivetest.pook.com.cn/index.do',
			BOKE_DB_URL: 'http://172.18.14.191:8080',
			API_AUDIT: 'http://172.18.14.191:8080/audit/api',
			API_SYSTEM: 'http://172.18.14.191:8080/dbsystem/api',
			DQ_API_URL: 'http://172.18.14.191:8080/dbquery/api',
			SYSTEM_URL: 'http://172.18.14.191:8080/dbsystem'
		}
	} else if (import.meta.env.VITE_APP_MODE == 'prod') {
		// 正式环境
		settings = {
			BOKE_APP_ID: '413',
			BOKE_feishu_APP_ID: 'cli_9ec255ae153c100d',
			BASE_URL: 'https://dbmanage.987ht.net/devplat',
			API_BOKE_URL: 'https://dbmanage.987ht.net/v2/api',
			HOME_URL: 'https://dbmanage.987ht.net/v2',
			API_URL: 'https://dbmanage.987ht.net/devplat/api',
			LOGIN_URL: 'https://dbmanage.987ht.net/v2/login',
			QIZHI_URL: 'https://dbopm1.pocketcity.com/shterm',
			REDIRECT_URL: 'https://nbklive.987ht.net/index.do',
			BOKE_DB_URL: 'https://dbmanage.987ht.net',
			API_AUDIT: 'https://dbmanage.987ht.net/audit/api',
			API_SYSTEM: 'https://dbmanage.987ht.net/dbsystem/api',
			DQ_API_URL: 'https://dbmanage.987ht.net/dbquery/api',
			SYSTEM_URL: 'https://dbmanage.987ht.net/dbsystem'
		}
	}
}

export default settings
