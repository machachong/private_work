/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
import { getFeishuAuth } from '@/api/feishuOpenApi'
// 表格请求 hook
export const useFeishuOpen = () => {
	// 飞书鉴权
	const larkConfigReady = (res) => {
		const { appid, noncestr, signature, timestamp } = res
		return new Promise((resolve, reject) => {
			window.h5sdk?.config({
				appId: appid,
				timestamp: timestamp,
				nonceStr: noncestr,
				signature: signature,
				jsApiList: [],
				//鉴权成功回调
				onSuccess: (res) => {
					console.log(`config success: ${JSON.stringify(res)}`)
					// 完成鉴权后，便可在 window.h5sdk.ready 里调用 JSAPI
					window.h5sdk.ready(() => {
						// window.h5sdk.ready回调函数在环境准备就绪时触发
						// 调用 getUserInfo API 获取已登录用户的基本信息，详细文档参见https://open.feishu.cn/document/uYjL24iN/ucjMx4yNyEjL3ITM
						resolve()
					})
				},
				//鉴权失败回调
				onFail: (err) => {
					console.log('fail', JSON.stringify(err))
					reject(JSON.stringify(err))
					// throw `config failed: ${JSON.stringify(err)}`
				}
			})
		})
	}
	// 更新角标
	const larkUpdateBadge = (badgeNum) => {
		console.log(111, badgeNum)
		const SCOPE_BADGE = 'scope.appBadge'
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this
		// 第一步：获取用户当前授权状态
		tt.getSetting({
			success: (res) => {
				console.log('get setting success setting=', res)
				if (!res || !res.authSetting || !res.authSetting?.hasOwnProperty(SCOPE_BADGE)) {
					// 第二步，首次授权，则请求授权
					tt.authorize({
						scope: SCOPE_BADGE,
						success(res) {
							console.log('auth appBadge success res=', res)
							that.setData({
								badgeAuthed: true
							})
						},
						fail(res) {
							console.error('auth badge fail res=', res)
							that.setData({
								badgeAuthed: false
							})
						}
					})
					return
				}
				that.setData({
					badgeAuthed: res.authSetting[SCOPE_BADGE]
				})
				if (!res.authSetting[SCOPE_BADGE]) {
					// 第三步，用户拒绝授权后，调用openSetting打开权限列表，引导用户授权；
					tt.openSetting({
						success(res) {
							console.log('open setting success res=', res)
							if (!res || !res.authSetting) {
								return
							}
							that.setData({
								badgeAuthed: res.authSetting[SCOPE_BADGE]
							})
						},
						fail(res) {
							console.error('open setting fail res=', res)
						}
					})
				}
				if (badgeNum || badgeNum == 0) {
					tt.updateBadge({
						badgeNum,
						success(res) {
							console.log('api update badge success res=', res)
						},
						fail(res) {
							console.error('api update badge fail res=', res)
						}
					})
				}
			},
			fail(res) {
				console.error('get setting fail res=', res)
			}
		})
	}
	// 获取鉴权参数信息
	const getAuth = async () => {
		const url = encodeURIComponent(location.href.split('#')[0])
		console.log(location.href.split('#')[0])
		const res = await getFeishuAuth({
			url
		})
		return res
	}
	// 提示用户打开角标设置
	const larkSetAuthorize = async () => {
		const res = await getAuth()
		console.log(res)
		await larkConfigReady(res)
		larkUpdateBadge()
	}
	// 关闭侧边栏应用
	const closeSildeBar = async () => {
		tt.closeWindow({
			success(res) {
				console.log('窗口已关闭', res)
			},
			fail(err) {
				console.log('关闭窗口失败', err)
			}
		})
	}
	return {
		closeSildeBar,
		getAuth,
		larkSetAuthorize,
		larkUpdateBadge
	}
}
