export const backApiLogColumns = [
	{
		label: "接口地址",
		prop: "ex_url_path",
		align: "center",
		minWidth: 160,
		showOverflowTooltip: true
	},
	{
		label: "接口名称",
		prop: "path_name",
		align: "center",
		minWidth: 100,
		showOverflowTooltip: true
	},
	{
		label: "系统平台",
		prop: "system_name",
		align: "center",
		minWidth: 140
	},
	{
		label: "请求方式",
		prop: "method",
		align: "center"
	},
	{
		label: "请求接口IP",
		prop: "ip",
		align: "center",
		minWidth: 120
	},
	{
		label: "请求来源",
		prop: "source_name",
		align: "center"
	},
	{
		label: "请求用户",
		prop: "user_id",
		align: "center",
		minWidth: 150,
		showOverflowTooltip: true
	},
	{
		label: "接口执行",
		prop: "cost_time",
		align: "center",
		width: 120,
		sortable: "custom"
	},
	{
		label: "状态码",
		prop: "resp_code",
		align: "center",
		width: 80
	},
	{
		label: "请求参数",
		prop: "body",
		align: "center",
		minWidth: 90
	},
	{
		label: "接口返回",
		prop: "response",
		align: "center",
		minWidth: 90
	},
	{
		label: "请求时间",
		prop: "start_time",
		align: "center",
		width: 170,
		sortable: "custom"
	},
	{
		label: "返回时间",
		prop: "end_time",
		align: "center",
		width: 170,
		sortable: "custom"
	}
]

export const fetchTypeDict = [
	{
		label: "GET",
		value: "GET"
	},
	{
		label: "POST",
		value: "POST"
	},
	{
		label: "PUT",
		value: "PUT"
	},
	{
		label: "DELETE",
		value: "DELETE"
	}
]
// 2xx – 成功
// 200 OK：请求成功。一般用于GET与POST请求
// 201 Created：已创建。成功请求并创建了新的资源
// 202 Accepted：已接受。已经接受请求，但未处理完成
// 204 No Content：无内容。服务器成功处理，但未返回内容
// 3xx – 重定向
// 301 Moved Permanently：永久移动。请求的页面已永久移至新位置
// 302 Found：临时移动。请求的页面临时从其他位置的不同URI响应请求
// 304 Not Modified：未修改。自从上次请求后，请求的资源未修改过
// 4xx – 客户端错误
// 400 Bad Request：错误请求。服务器不理解请求的语法
// 401 Unauthorized：未授权。请求要求用户的身份验证
// 403 Forbidden：禁止。服务器理解请求客户端的请求，但是拒绝执行此请求
// 404 Not Found：未找到。服务器找不到请求的网页
// 408 Request Timeout：请求超时。服务器等候请求时发生超时
// 5xx – 服务器错误
// 500 Internal Server Error：内部服务器错误。服务器遇到错误，无法完成请求
// 502 Bad Gateway：错误网关。服务器作为网关或代理，从上游服务器收到无效响应
// 503 Service Unavailable：服务不可用。服务器目前无法使用（超载或停机维护）
// 504 Gateway Timeout：网关超时。服务器作为网关或代理，但是没有及时从上游服务
export const statusCodeDict = {
	200: "请求成功",
	201: "请求已创建",
	202: "请求已接受",
	204: "请求无内容",
	301: "请求的页面已永久移至新位置",
	302: "请求的页面临时从其他位置的不同URI响应请求",
	304: "自从上次请求后，请求的资源未修改过",
	400: "错误请求。服务器不理解请求的语法",
	401: "未授权。请求要求用户的身份验证",
	403: "禁止。服务器理解请求客户端的请求，但是拒绝执行此请求",
	404: "未找到。服务器找不到请求的网页",
	408: "请求超时。服务器等候请求时发生超时",
	500: "内部服务器错误。服务器遇到错误，无法完成请求",
	502: "错误网关。服务器作为网关或代理，从上游服务器收到无效响应",
	503: "服务不可用。服务器目前无法使用（超载或停机维护",
	504: "网关超时。服务器作为网关或代理，但是没有及时从上游服务"
}
export const useCodeDict = [
	{
		label: "200",
		value: "200",
		des: "请求成功"
	},
	{
		label: "400",
		value: "400",
		des: "错误请求"
	},
	{
		label: "401",
		value: "401",
		des: "未授权"
	},
	{
		label: "405",
		value: "405",
		des: "资源被禁止"
	},
	{
		label: "500",
		value: "500",
		des: "内部服务器错误"
	}
]
export const columnsRank = [
	{ prop: "name1", label: "堡垒机用户", width: 7, align: "right" },
	{ prop: "name2", label: "会话时长", width: 7, align: "right" },
	{ prop: "name3", label: "执行命令数", width: 7, align: "right" }
]
// 堡垒机会话监控下拉
export const qizhiOptions = [
	{ label: "堡垒机配置日志", value: "dev_qizhi_config_log" },
	{ label: "堡垒机文件传输日志", value: "dev_qizhi_file_session_log" },
	{ label: "堡垒机图形会话日志", value: "dev_qizhi_gui_session_log" },
	{ label: "堡垒机登录日志", value: "dev_qizhi_login_log" },
	{ label: "堡垒机会话日志", value: "dev_qizhi_tui_session_log" }
]
export const anomalyColumns = [
	{ prop: "policy_name", label: "接口名称", width: 9, align: "left" },
	{ prop: "policy_type", label: "接口地址", width: 7, align: "left" },
	{ prop: "log_count", label: "执行次数", width: 3, align: "left" },
	{ prop: "log_count", label: "平均执行时间", width: 5, align: "left" }
]
// 接口访问次数排行
export const rank_count_columns = [
	{ prop: "ex_url_path", label: "接口地址", width: 8, align: "left" },
	{ prop: "path_name", label: "接口名称", width: 7, align: "left" },
	{ prop: "system_name", label: "所属系统", width: 5, align: "left" },
	{ prop: "log_num", label: "访问次数", width: 3, align: "left" }
]
// 接口访问时长排行
export const rank_time_columns = [
	{ prop: "ex_url_path", label: "接口地址", width: 9, align: "left" },
	{ prop: "path_name", label: "接口名称", width: 7, align: "left" },
	{ prop: "system_name", label: "所属系统", width: 5, align: "left" },
	{ prop: "cost_time", label: "执行时间", width: 3, align: "left" },
]