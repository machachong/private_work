module.exports = {
	env: {
		browser: true,
		node: true,
		es2021: true
	},
	extends: [
		'eslint:recommended',
		'plugin:vue/vue3-essential',
		'./.eslintrc-auto-import.json',
		'plugin:@typescript-eslint/recommended',
		'prettier' // 保持在最后
	],
	overrides: [
		{
			env: {
				node: true
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script'
			}
		}
	],
	parser: 'vue-eslint-parser',
	parserOptions: {
		parser: '@typescript-eslint/parser',
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	plugins: ['vue', '@typescript-eslint'],
	rules: {
		// 'no-console': 'warn',
		'no-debugger': 'warn',
		'vue/multi-word-component-names': 'off', // 忽略组件命名规则
		'no-inner-declarations': [0, 'always'],
		'@typescript-eslint/no-empty-function': 'off', // 允许setup为空
		'no-unused-vars': 2,
		// '@typescript-eslint/no-array-constructor': 'off', // 允许使用new array 创建数组
		// '@typescript-eslint/no-this-alias': 'off', // 允许使用别名
		// '@typescript-eslint/no-explicit-any': ['off'], // 允许使用any
		// '@typescript-eslint/ban-ts-comment': ['off'], // 允许使用ts-no-check
		// 'no-empty': 'warn',
		// 'no-func-assign': 'warn', // 禁止对Function声明重新赋值
		// 'no-unreachable': 'warn', // 禁止出现[return|throw]之后的代码块
		quotes: 'off',
		indent: ['error', 'tab', { SwitchCase: 1 }],
		semi: ['error', 'never']
	}
}
