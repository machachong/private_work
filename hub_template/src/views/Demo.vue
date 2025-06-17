<template>
	<BokeResizeBox
		vertical
		:resizeConf="{
			size: 300,
			sizeRange: [100, 1000]
		}"
	>
		<div>
			<div
				><el-button
					type="primary"
					v-tracking="{
						auth_id: '10101',
						name: 'sql_format',
						description: '美化SQL',
						behavior: 'click',
						version: '2.0',
						obj: { sql: 'SELECT * FROM user' }
					}"
					>这个按钮是boke-button</el-button
				> </div
			><el-space>
				<BokeTextStatus>成功</BokeTextStatus>
				<BokeTextStatus status="fail">失败</BokeTextStatus>
				<BokeTextStatus status="warning">警告</BokeTextStatus>
				<BokeTextStatus mode="text">成功</BokeTextStatus>
				<BokeTextStatus mode="text" status="fail">失败</BokeTextStatus>
				<BokeTextStatus mode="text" status="warning">赞停</BokeTextStatus>
				<BokeTextStatus mode="text" status="open">开启</BokeTextStatus>
			</el-space>
		</div>
	</BokeResizeBox>

	<br />
	<!-- 二次确认弹窗 -->
	<div class="h5 m-t-10">消息提示,确认</div>
	<el-space>
		<el-button @click="open">消息提示</el-button>
		<el-button @click="openCon">弹窗确认</el-button>
		<BokePopconfirm title="二次确认一下" @confirm="confirmFan" @cancel="cancel">
			<el-button>二次确认</el-button>
		</BokePopconfirm>
	</el-space>
	<div class="h5 m-t-10">svg图标使用</div>
	<el-space>
		<BokeSvg name="up" size="18"></BokeSvg>
		<BokeSvg name="Vector"></BokeSvg>
		<BokeSvg name="Vector" color="red"></BokeSvg>
		<BokeSvg name="Vector" size="30"></BokeSvg>
	</el-space>
	<div class="h5 m-t-10" @click="showDialog = true">弹窗</div>
	<el-button @click="popup.drawerVisible = true">抽屉</el-button>
	<el-button @click="showDialog = true">对话框</el-button>
	<boke-drawer v-model:drawerVisible="popup.drawerVisible" title="抽屉标题">
		<template #content>这是弹窗内容</template>
		<template #footer>
			<el-button>确定</el-button>
		</template>
	</boke-drawer>
	<el-divider></el-divider>
	<BokePage
		ref="bookPage"
		title="demo页面"
		border
		highlight-current-row
		label-width="110px"
		:searchColumns="formColumns"
		:rules="rules"
		:form-data="formModel"
		:requestFunc="getList"
		:columns="asycColumns"
		:mountedDefault="true"
		row-key="id"
		@sort-change="sortChange"
		@current-change="handleCurrentChange"
		@page-change="pageChange"
		@handleSelectionChange="handleSelectionChange"
	>
		<template #tableTitle>
			<el-tabs v-model="activeTabs" class="boke-tabs-small" @tab-change="changeTab">
				<el-tab-pane label="任务列表" name="1"> </el-tab-pane>
				<el-tab-pane label="草稿箱" name="2"></el-tab-pane>
			</el-tabs>
		</template>
		<template #tableHandle>
			<el-space>
				<el-button type="danger" @click="deleteMul">批量删除</el-button>
			</el-space>
		</template>

		<template #expand> 展开的内容 </template>
		<template #formComponent>
			<el-tree-select style="width: 100%" v-model="treeValue" :data="treeData" :render-after-expand="false" />
		</template>
		<template #switch="{ row }">
			<el-switch v-model="row.switch"></el-switch>
		</template>
		<template #statusStr="{ row }">
			<BokeTextStatus v-if="row.statusStr === '2'">成功</BokeTextStatus>
			<BokeTextStatus v-if="row.statusStr === '1'" status="fail">失败</BokeTextStatus>
		</template>
		<template #handle>
			<el-space spacer="|">
				<el-link type="primary" @click="showDialog = true" link>表单demo</el-link>
				<el-link type="primary" link @click="showMd = true">表格demo</el-link>
				<el-link disabled>禁用样式</el-link>
			</el-space>
		</template>
		<!-- <template #tableHeader>
			<div>这是一个自定义内容区</div>
		</template> -->
	</BokePage>
	<BokeDialog title="弹窗表单" v-model:value="showDialog" :append-to-body="true" @open="handleOpen">
		<!-- <template>
			<BokeForm
				ref="formRef"
				:columns="formColumns"
				:form-data="formModel"
				:rules="rules"
				label-width="130px"
			>
				<template #formComponent>
					<el-tree-select
						style="width: 100%"
						v-model="treeValue"
						:data="treeData"
						:render-after-expand="false"
					/>
				</template>
			</BokeForm>
		</template> -->
		<iframe
			src="http://172.19.64.144:8083/devplat/larkcard"
			frameborder="0"
			ref="larkIframRef"
			width="100%"
			height="600px"
		></iframe>
		<template #footer>
			<el-row justify="center">
				<el-space>
					<el-button type="primary" @click="onSubmit">确认</el-button>
					<el-button @click="showDialog = false">取消</el-button>
				</el-space>
			</el-row>
		</template>
	</BokeDialog>
	<BokeDialog title="表格demo" v-model:value="showMd">
		<template #content>
			<boke-table
				border
				row-key="id"
				highlight-current-row
				:requestFunc="getList"
				:columns="columns"
				:mountedDefault="true"
				@sort-change="sortChange"
				@current-change="handleCurrentChange"
				@page-change="pageChange"
				@handleSelectionChange="handleSelectionChange"
			>
				<template #tableTitle> </template>
				<template #tableHandle> <el-button type="danger">批量删除</el-button> </template>
			</boke-table>
		</template>
	</BokeDialog>
	<BokeDetail title="新增需求" back="/demand/demandmanage/demandlist"> 详情页面组件 </BokeDetail>
	<!-- //编辑器开始
<div style="flex: 1">
			<boke-button type="primary" @click="handleSettings">只读</boke-button>
			<boke-button type="primary" @click="handleGetValue">获取值</boke-button>
      <boke-button type="primary" @click="handleFormat">格式化</boke-button>
			<section>
				{{ codeValue }}
			</section>
		</div>
	<div  style="min-height: 300px;height: 600px;max-height: 600px">
		<div ref="monacoEditor" style="height: 100%; width: 60%"></div>
	</div>
  <div >
    <boke-editor
    height="700px"
      id="python-editor-1111"
      v-model="detail"
      mode="python"
      resizable
    ></boke-editor>
  </div>
  // 编辑器结束 -->
</template>

<script setup>
import { message, confirm } from '@/utils/tools'
import BokePage from '@/components/table/BokePage.vue'
// import BokeForm from "@/components/form/BokeForm.vue"
import { ElCheckboxGroup, ElRadioGroup } from 'element-plus'
import BokeTable from '@/components/table/BokeTable.vue'
const cardInfo = ref({
	robot_open_id: 'ou_ac8843aa839611ec1d8af26f3eaf6c73',
	card_body:
		// eslint-disable-next-line quotes
		'{"config": {"wide_screen_mode": true}, "elements": [{"tag": "div", "text": {"tag": "lark_md", "content": "**1111**"}}, {"tag": "div", "text": {"tag": "plain_text", "content": "可点击此处跳转预览👉"}, "extra": {"tag": "button", "text": {"content": "预览", "tag": "plain_text"}, "type": "primary", "url": "http://172.19.64.144:8083/dbquery/bi/dashboard_preview?id=83"}}, {"tag": "hr"}, {"tag": "div", "text": {"tag": "lark_md", "content": "**⌚卡片时间：**2024-11-19 10:51:21"}}, {"fields": [{"is_short": true, "text": {"content": "**👤任务创建人：**<at id=3925e396></at>", "tag": "lark_md"}}], "tag": "div"}, {"tag": "div", "text": {"tag": "lark_md", "content": "**👤发送对象：**<at id=3925e396></at> "}}, {"tag": "div", "text": {"tag": "lark_md", "content": "可点击此处查询任务历史卡片👉"}, "extra": {"tag": "button", "text": {"tag": "lark_md", "content": "任务历史卡片"}, "multi_url": {"url": "https://applink.feishu.cn/client/web_app/open?appId=cli_a6811a1cb0b0100e&path=/devplat/cardcenter?title=【四史逐梦】测试邮件截图"}, "type": "primary"}}, {"tag": "div", "text": {"tag": "lark_md", "content": "可点击此处进行评论,会通知任务创建人👉"}, "extra": {"tag": "button", "text": {"tag": "lark_md", "content": "评论"}, "multi_url": {"url": "https://applink.feishu.cn/client/web_app/open?appId=cli_a6811a1cb0b0100e&mode=appCenter&lk_target_url=http%3A//172.19.64.144%3A8083/devplat/cardcenter%3Fcomment%3Dtrue%26message_hash%3Deacccc06218f68eead9fe3e2c453d498&reload=true"}, "type": "primary"}}], "header": {"template": "blue", "title": {"content": "【四史逐梦】测试邮件截图", "tag": "plain_text"}}}'
})
const handleOpen = () => {
	// index.html
	console.log(999, larkIframRef)
	// const timer = setTimeout(() => {
	// 	nextTick(() => {
	// 		larkIframRef.value.contentWindow.postMessage(JSON.stringify(cardInfo.value), "*")
	// 	})
	// 	clearTimeout(timer)
	// }, 0)
	// if (!isread.value) {
	// 	larkIframRef.value.addEventListener("load", () => {
	// 		isread.value = true
	// 		console.log("加载完了", larkIframRef.value.contentWindow)
	// 		setTimeout(() => {
	// 			larkIframRef.value?.contentWindow?.postMessage(JSON.stringify(cardInfo.value), "*")
	// 		}, 0)
	// 	})
	// } else {
	// 	larkIframRef.value?.contentWindow?.postMessage(JSON.stringify(cardInfo.value), "*")
	// }
	window?.addEventListener(
		'message',
		function (e) {
			try {
				console.log('父', e)
				if (!e.data) {
					return
				}
				const data = JSON.parse(e.data)
				if (data.done) {
					larkIframRef.value?.contentWindow?.postMessage(JSON.stringify(cardInfo.value), '*')
				}
			} catch (error) {
				console.log(222, error)
			}
		},
		false
	)
}
const popup = reactive({
	drawerVisible: false
})
const open = () => {
	message.success('This is a message', 'Title')
}
const openCon = () => {
	confirm('弹窗确认一下')
		.then(() => {
			console.log('确认')
		})
		.catch(() => {
			console.log('取消')
		})
}
const confirmFan = () => {
	console.log('确认')
}
const cancel = () => {
	console.log('取消')
}
const activeTabs = ref('1')
const sourceData = ref([])
const showDialog = ref(false)
const showMd = ref(false)
const bookPage = ref()
const state = reactive({
	formModel: {
		phone: 17621732566
	},
	formRef: {}
})
// 数据源
const columns = ref([
	{
		label: '序号',
		prop: 'id',
		type: 'selection',
		width: 100,
		fixed: 'left'
	},
	{
		label: '输入框',
		prop: 'name',
		width: 150,
		sortable: true,
		formProp: {
			required: false,
			el: ElInput
		}
	},
	{
		label: '手机号必填',
		prop: 'phone',
		width: 150,
		formProp: {
			required: true,
			el: ElInput
		}
	},
	{
		label: '单选',
		prop: 'radio',
		width: 150,
		formProp: {
			el: ElRadioGroup,
			childEl: ElRadio,
			source: sourceData
		}
	},
	{
		label: '开关',
		prop: 'switch',
		width: 150,
		component: defineComponent({
			name: 'MyComponent',
			setup() {
				const count = ref('你好，函数式组件111')
				return {
					count
				}
			},
			render() {
				return h('h5', this.count)
			}
		}),
		formProp: {
			el: ElSwitch
		}
	},
	{
		label: '复选',
		prop: 'checkbox',
		width: 150,
		formProp: {
			el: ElCheckboxGroup,
			childEl: ElCheckbox,
			source: sourceData
		}
	},
	{
		label: '状态',
		prop: 'statusStr',
		formProp: {
			filterable: true,
			multiple: true,
			el: ElSelect,
			key: 'status',
			childEl: ElOption,
			source: sourceData,
			clearable: true
		}
	},
	{
		label: '日期',
		prop: 'date2',
		width: 150,
		formProp: {
			el: ElDatePicker,
			'value-format': 'YYYY-MM-DD'
		}
	},
	{
		label: '展开',
		prop: 'expand',
		width: 500,
		type: 'expand',
		formProp: {}
	},
	{
		label: '自定义组件',
		prop: 'custom',
		width: 150,
		formProp: {
			slot: 'formComponent',
			clearable: true
		}
	},
	{
		label: '操作',
		prop: 'handle',
		fixed: 'right',
		width: 260
	}
])
const asycColumns = ref(columns.value)
const formColumns = ref([
	...columns.value.filter((item) => !!item.formProp),
	{
		label: '',
		prop: 'submit',
		width: 160,
		formProp: {
			slot: 'formSubmit'
		}
	}
])
console.log(formColumns.value)
const multipleSelection = ref()
const treeValue = ref()
const treeData = [
	{
		value: '1',
		label: 'Level one 1',
		children: [
			{
				value: '1-1',
				label: 'Level two 1-1',
				children: [
					{
						value: '1-1-1',
						label: 'Level three 1-1-1'
					}
				]
			}
		]
	},
	{
		value: '2',
		label: 'Level one 2',
		children: [
			{
				value: '2-1',
				label: 'Level two 2-1',
				children: [
					{
						value: '2-1-1',
						label: 'Level three 2-1-1'
					}
				]
			},
			{
				value: '2-2',
				label: 'Level two 2-2',
				children: [
					{
						value: '2-2-1',
						label: 'Level three 2-2-1'
					}
				]
			}
		]
	},
	{
		value: '3',
		label: 'Level one 3',
		children: [
			{
				value: '3-1',
				label: 'Level two 3-1',
				children: [
					{
						value: '3-1-1',
						label: 'Level three 3-1-1'
					}
				]
			},
			{
				value: '3-2',
				label: 'Level two 3-2',
				children: [
					{
						value: '3-2-1',
						label: 'Level three 3-2-1'
					}
				]
			}
		]
	}
]
const { formModel, formRef } = toRefs(state)
const sortChange = (val) => {
	console.log(val)
}
const pageChange = (val) => {
	console.log(val)
}
const handleCurrentChange = (val) => {
	console.log(val)
}
const handleSelectionChange = (val) => {
	console.log(11, val)
	multipleSelection.value = val
}
// 新增表单的配置项 与 校验规则
const rules = ref({})
const checkMobile = (rule, value, callback) => {
	if (!value) {
		callback(new Error('请输入手机号'))
	}
	const regMobile = /^1[3-9]\d{9}$/
	if (regMobile.test(value)) {
		return callback()
	}
	callback(new Error('请输入合法的手机号'))
}
formColumns.value.forEach((item) => {
	if (item.prop === 'phone') {
		rules.value[item.formProp.key || item.prop] = [
			{
				validator: checkMobile,
				trigger: 'blur'
			}
		]
	} else {
		rules.value[item.formProp.key || item.prop] = [
			{
				required: item.formProp.required,
				message: item.formProp.el === 'input' ? `请输入${item.label}` : `请选择${item.label}`,
				trigger: 'blur'
			}
		]
	}
})
const deleteMul = () => {
	confirm(`确认删除${multipleSelection.value.map((item) => item.id)}吗?`)
		.then(() => {
			console.log('确认')
		})
		.catch(() => {
			console.log('取消')
		})
}
const getList = () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				items: [
					{
						id: 1,
						name: '张三',
						phone: '17688886666 ',
						switch: '1',
						radio: '1',
						statusStr: '1',
						date2: '2',
						custom: '3',
						children: [
							// {
							// 	id: "1-1",
							// 	name: "张三",
							// 	phone: "17688886666 ",
							// 	switch: "1",
							// 	radio: "1",
							// 	date1: "2",
							// 	date2: "2",
							// 	custom: "3"
							// }
						]
					},
					{
						id: 2,
						name: '张三',
						phone: '17688886666 ',
						switch: '1',
						radio: '1',
						statusStr: '2',
						date2: '2',
						custom: '3'
					},
					{
						id: 3,
						name: '张三',
						phone: '17688886666 ',
						switch: '1',
						radio: '1',
						statusStr: '2',
						date2: '2',
						custom: '3'
					},
					{
						id: 4,
						name: '张三',
						phone: '17688886666 ',
						switch: '1',
						radio: '1',
						statusStr: '2',
						date2: '2',
						custom: '3'
					},
					{
						id: 5,
						name: '张三',
						phone: '17688886666 ',
						switch: '1',
						radio: '1',
						statusStr: '2',
						date2: '2',
						custom: '3'
					},
					{
						id: 6,
						name: '张三',
						phone: '17688886666 ',
						switch: '1',
						radio: '1',
						statusStr: '2',
						date2: '2',
						custom: '3'
					},
					{
						id: 7,
						name: '张三',
						phone: '17688886666 ',
						switch: '1',
						radio: '1',
						statusStr: '2',
						date2: '2',
						custom: '3'
					},
					{
						id: 8,
						name: '张三',
						phone: '17688886666 ',
						switch: '1',
						radio: '1',
						statusStr: '2',
						date2: '2',
						custom: '3'
					},
					{
						id: 9,
						name: '张三',
						phone: '17688886666 ',
						switch: '1',
						radio: '1',
						statusStr: '2',
						date2: '2',
						custom: '3'
					},
					{
						id: 10,
						name: '张三',
						phone: '17688886666 ',
						switch: '1',
						radio: '1',
						statusStr: '2',
						date2: '2',
						custom: '3'
					},
					{
						id: 11,
						name: '张三',
						phone: '17688886666 ',
						switch: '1',
						radio: '1',
						statusStr: '2',
						date2: '2',
						custom: '3'
					},
					{
						id: 12,
						name: '张三',
						phone: '17688886666 ',
						switch: '1',
						radio: '1',
						statusStr: '2',
						date2: '2',
						custom: '3'
					}
				],
				total: 12
			})
		})
	})
}
// 表单提交
const onSubmit = () => {
	console.log(formRef.value)
	let form = formRef.value.form
	form.validate(async (res) => {
		if (res) {
			console.log('proform res ===', res, formModel.value)
		}
	})
}
const larkIframRef = ref()
onMounted(() => {
	sourceData.value = [
		{ label: '在线', value: 1 },
		{ label: '离线', value: 0 }
	]
})
</script>
<!-- <script setup>
// 编辑器开始
import * as monaco from "monaco-editor"
// import { registerProvider } from "@/components/form/python_editor/woker.js"
defineProps({
	constModelData: String
})
// const registerPro = registerProvider("sql", props.constModelData)
const editor = ref()
const detail = ref(`import pandas as pdfrom nebula3.gclient.net import ConnectionPoolfrom nebula3.Config import Configimport pymysqlimport loggingimport networkx as nxlogger = logging.getLogger(name="DB")
logger.setLevel(logging.DEBUG)
consoleHandler = logging.StreamHandler()
consoleHandler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
consoleHandler.setFormatter(formatter)
logger.addHandler(consoleHandler)


class __DataIO:
    def __init__(self, host, user, password, database, port):
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.port = port
        self.conn = None

    def connect(self):
        try:
            self.conn = pymysql.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database,
                charset='utf8',
                port=self.port
            )
        except pymysql.Error as err:
            logger.error(f"数据库连接失败: {err}")

    def read(self, sql):
        cursor = None
        if self.conn is None:
            self.connect()
        try:
            cursor = self.conn.cursor()
            cursor.execute(sql)
            data_ = cursor.fetchall()
            # 将结果转换为 DataFrame
            # 提取列名
            column_names = [desc[0] for desc in cursor.description]
            df = pd.DataFrame(data_, columns=column_names)
            return df
        except pymysql.Error as err:
            logger.error(f"数据读取失败: {err}")
        finally:
            if cursor:
                cursor.close()
`)
const monacoEditor = ref()
const options = ref({
	language: "python",
	theme: "vs-dark",
	value: detail.value,
	automaticLayout: true,
	folding: true, // 是否折叠
	foldingHighlight: true, // 折叠等高线
	foldingStrategy: "indentation", // 折叠方式  auto | indentation
	colorDecorators: true, // 颜色装饰器
	lineNumbers: "on", // 行号 取值： "on" | "off" | "relative" | "interval" | function
	lineNumbersMinChars: 5, // 行号最小字符   number
	tabSize: 2,
	fontSize: 14,
	enableSplitViewResizing: false,
	formatOnPaste: true,
	readOnly: false, //是否只读  取值 true | false
	// showFoldingControls: "always", // 是否一直显示折叠 always | mouseover
	// theme: "hc-light", // 主题vs' (default), 'vs-dark', 'hc-black', 'hc-light
	// value: "console.log(1111)", // 默认显示的值
	// language: "javascript",
	// folding: true, // 是否折叠
	// foldingHighlight: true, // 折叠等高线
	// foldingStrategy: "indentation", // 折叠方式  auto | indentation
	// showFoldingControls: "always", // 是否一直显示折叠 always | mouseover
	// disableLayerHinting: true, // 等宽优化
	// emptySelectionClipboard: false, // 空选择剪切板
	// selectionClipboard: false, // 选择剪切板
	// automaticLayout: true, // 自动布局
	// codeLens: false, // 代码镜头
	// scrollBeyondLastLine: false, // 滚动完最后一行后再滚动一屏幕
	// colorDecorators: true, // 颜色装饰器
	// accessibilitySupport: "off", // 辅助功能支持  "auto" | "off" | "on"
	// lineNumbers: "on", // 行号 取值： "on" | "off" | "relative" | "interval" | function
	// lineNumbersMinChars: 5, // 行号最小字符   number
	// enableSplitViewResizing: false,
	// readOnly: false, //是否只读  取值 true | false
})
const codeValue = ref()
const showEditor = ref(true)
const handleSettings = () => {
	unInstallEditor()
	showEditor.value = false
	options.value.readOnly = true
	editor.value = monaco.editor.create(monacoEditor.value, options.value)
	showEditor.value = true
}
const handleGetValue = () => {
	codeValue.value = toRaw(editor.value).getValue()
}
// const updateOptions = () => {
// 	toRaw(editor.value).setModel({
// 		readOnly: true
// 	})
// }
const handleFormat = () => {
	handleGetValue()
	console.log(codeValue.value)
	// const value = prettier.format(codeValue.value, {
	// 	parser: "python",
	// 	// plugins: prettierPlugins,
	// })
	// toRaw(editor.value).setValue(value)
	// toRaw(editor.value).trigger("anyString", "editor.action.formatDocument")//自动格式化代码
	// toRaw(editor.value).setValue(toRaw(editor.value).getValue())//再次设置
	// toRaw(editor.value).getAction(["editor.action.formatDocument" ])?._run()

}
const unInstallEditor = () => {
	if (editor.value) {
		toRaw(editor.value).dispose()
	}
}
// 实时获取内容
const onChange = (val) => {
	console.log(val)
}
onMounted(() => {
	editor.value = monaco.editor.create(monacoEditor.value, options.value)
	toRaw(editor.value).onDidChangeModelContent(() => {
		// 触发父组件的 change 事件，通知编辑器内容变化
		console.log(121, toRaw(editor.value))
		onChange(toRaw(editor.value).getValue())
    
	})
	toRaw(editor.value).onKeyDown ((event) => {
		// 触发父组件的 change 事件，通知编辑器内容变化
		const keyCode = event.keyCode || event.which || event.charCode
		const isCtrlOrCmdPressed = event.ctrlKey || event.metaKey
		if (keyCode === 83 && isCtrlOrCmdPressed) {
			toRaw(editor.value).trigger("editor", "editor.action.formatDocument")
			event.preventDefault()
		}

	})
	// 自定义右键菜单
	var myCondition = toRaw(editor.value).createContextKey(/*key name*/"myCondition", /*default value*/false)
	toRaw(editor.value).addAction({
		id: "code-format",
		label: "格式化",
		keybindings: [
			monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_O
		],
		precondition: "myCondition",
		keybindingContext: null,
		contextMenuGroupId: "navigation",
		contextMenuOrder: 1.4,
		run: function () {
			/*something do*/
		}
	})
	myCondition.set(true)

	// 自定义语言提示
	const customCompletionItems = [
		{
			label: "myFunction",
			kind: monaco.languages.CompletionItemKind.Function,
			documentation: "这是一个自定义的函数",
			insertText: "myFunction()"
		},
	]
 
	// 自定义语言提示器
	const customCompletionProvider = {
		provideCompletionItems: () => {
			return {
				suggestions: customCompletionItems
			}
		}
	}
	monaco.languages.registerCompletionItemProvider("python", customCompletionProvider)
 
})
onUnmounted(() => {
	unInstallEditor()
	// registerPro && registerPro.dispose()
})
</script> -->

<style scoped lang="scss">
// <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/monaco-editor/min/vs/editor/editor.main.css">
</style>
