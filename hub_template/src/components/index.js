import BokeTitle from '@/components/common/title/BokeTitle.vue'
import BokeCard from '@/components/common/card/BokeCard.vue'
import BokeButton from '@/components/common/button/BokeButton.vue'
import BokeDetail from '@/components/common/detail/BokeDetail.vue'
import BokeTextStatus from '@/components/common/button/BokeTextStatus.vue'
import BokeTextButton from '@/components/common/button/BokeTextButton.vue'
import BokeTextOverflow from '@/components/common/button/BokeTextOverflow.vue'
import BokePopconfirm from '@/components/common/popconfirm/BokePopconfirm.vue'
import BokeDrawer from '@/components/common/drawer/BokeDrawer.vue'
import BokeEditor from '@/components/form/editor/MyEditor.vue'
import BokeMarkdown from '@/components/form/markdown/BokeMd.vue'
import BokeUpload from '@/components/form/upload/BokeUpload.vue'
import BokeSvg from '@/components/common/icon/BokeSvg.vue'
import BokeDialog from '@/components/common/dialog/BokeDialog.vue'

import BokeTableSelect from '@/components/table/BokeTableSelect.vue'
import BokeTabs from '@/components/common/tabs/BokeTabs.vue'
import BokePage from '@/components/table/BokePage.vue'
import BokeForm from '@/components/form/BokeForm.vue'
import BokeList from '@/components/common/list/BokeList.vue'
import BokeSelect from '@/components/form/select/BokeSelect.vue'

import BokeChart from '@/components/common/chart/BokeChart.vue'
import BokeRobotSelect from '@/components/form/select/BokeRobotSelect.vue'
import BokeEditorDialog from '@/components/common/dialog/BokeEditorDialog.vue'
import BokeRankList from '@/components/common/list/RankList.vue'
import BokeResizeBox from '@/components/common/resize/BokeResizeBox.vue'
import BokeTableFilter from '@/components/common/high_filter/TableHeaderFilter.vue'
import BokeUserProfile from '@/components/common/user/BokeUserProfile.vue'
import BokeMdEditor from '@/components/form/markdown/BokeMdEditor.vue'
import BokeWangEditor from '@/components/form/editor/wang_editor/BokeWangEditor.vue'
import BokeTooltip from '@/components/common/tooltip/BokeTooltip.vue'
import BokeTimeLine from '@/components/common/timeline/BokeTimeLine.vue'
import BokeCommentInput from '@/components/common/comment/CommentInput.vue'
import BokeCommentItem from '@/components/common/comment/CommentItem.vue'
import BokeExecutorSelect from '@/components/form/select/BokeExecutorSelect.vue'
import BokeWeekPicker from '@/components/form/date_picker/BokeWeekPicker.vue'
export default {
	install(Vue) {
		Vue.component('BokeTitle', BokeTitle)
		Vue.component('BokeCard', BokeCard)
		Vue.component('BokeButton', BokeButton)
		Vue.component('BokeTextButton', BokeTextButton)
		Vue.component('BokeTextOverflow', BokeTextOverflow)
		Vue.component('BokeTextStatus', BokeTextStatus)
		Vue.component('BokeEditor', BokeEditor)
		Vue.component('BokeMarkdown', BokeMarkdown)
		Vue.component('BokeDetail', BokeDetail)
		Vue.component('BokeUpload', BokeUpload)

		Vue.component('BokePopconfirm', BokePopconfirm)
		Vue.component('BokeSvg', BokeSvg)
		Vue.component('BokeDrawer', BokeDrawer)
		Vue.component('BokeDialog', BokeDialog)

		Vue.component('BokeTableSelect', BokeTableSelect)
		Vue.component('BokeTabs', BokeTabs)
		Vue.component('BokePage', BokePage)
		Vue.component('BokeForm', BokeForm)
		Vue.component('BokeList', BokeList)
		Vue.component('BokeSelect', BokeSelect)

		Vue.component('BokeChart', BokeChart)
		Vue.component('BokeRobotSelect', BokeRobotSelect)
		Vue.component('BokeEditorDialog', BokeEditorDialog)
		Vue.component('BokeRankList', BokeRankList)
		Vue.component('BokeResizeBox', BokeResizeBox)
		Vue.component('BokeTableFilter', BokeTableFilter)
		Vue.component('BokeUserProfile', BokeUserProfile)
		Vue.component('BokeMdEditor', BokeMdEditor)
		Vue.component('BokeWangEditor', BokeWangEditor)
		Vue.component('BokeTooltip', BokeTooltip)
		Vue.component('BokeTimeLine', BokeTimeLine)
		Vue.component('BokeCommentInput', BokeCommentInput)
		Vue.component('BokeCommentItem', BokeCommentItem)
		Vue.component('BokeExecutorSelect', BokeExecutorSelect)
		Vue.component('BokeWeekPicker', BokeWeekPicker)
	}
}
