import { config } from '@eslint-sets/eslint-config'

export default config({
	ignores: ['examples/**'],
	markdown: false,
	rules: {
		camelcase: 'off',
	},
	stylistic: {
		indent: 'tab',
	},
	type: 'lib',
	typescript: true,
})
