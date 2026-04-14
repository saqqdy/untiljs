import { config } from '@eslint-sets/eslint-config'

export default config({
	type: 'lib',
	ignores: ['examples/**'],
	markdown: false,
	rules: {
		camelcase: 'off',
	},
	stylistic: {
		indent: 'tab',
	},
	typescript: true,
})
