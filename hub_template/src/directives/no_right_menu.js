export default (app) => {
	app.directive('no-right-menu', {
		async mounted(el) {
			el.addEventListener('contextmenu', function (event) {
				event.preventDefault() // 阻止默认的右键菜单
			})
		}
	})
}
