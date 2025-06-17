import { Boot, DomEditor, SlateNode } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import markdownModule from '@wangeditor/plugin-md'
import pluginLink from './plugin-link'

Boot.registerPlugin(pluginLink)

Boot.registerModule(markdownModule)

export { SlateNode, Editor, Toolbar, DomEditor }
