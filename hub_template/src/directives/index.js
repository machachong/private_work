import permission from '@/directives/permission'
import tracking from '@/directives/tracking'
import track_permission from '@/directives/track_permission'
import no_right_menu from '@/directives/no_right_menu'
export default (app) => {
	permission(app)
	tracking(app)
	track_permission(app)
	no_right_menu(app)
}
