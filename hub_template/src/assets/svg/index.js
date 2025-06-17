import SvgIcon from '@/components/common/icon/BokeSvg.vue'

const componentPlugin = {
	install: function (vue, options) {
		if (options && options.imports && Array.isArray(options.imports) && options.imports.length > 0) {
			// 按需引入图标
			const { imports } = options
			imports.forEach((name) => {
				// eslint-disable-next-line @typescript-eslint/no-require-imports
				require(`@/assets/svg/svg_icon/${name}.svg`)
			})
		} else {
			// 全量引入图标
			// ("@/assets/svg/svg_icon", false, /\.svg$/)
			const ctx = import.meta.glob('./svg_icon/*.svg', { eager: true })
			console.log(ctx)

			Object.keys(ctx).forEach((path) => {
				const temp = path.match(/\.\/([A-Za-z0-9\-_]+)\.svg$/)
				if (!temp) return
				const name = temp[1]
				// eslint-disable-next-line @typescript-eslint/no-require-imports
				require(`@/assets/svg/svg_icon/${name}.svg`)
			})
		}
		vue.component(SvgIcon.name, SvgIcon)
	}
}
export default componentPlugin
