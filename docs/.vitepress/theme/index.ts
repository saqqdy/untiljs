import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import Playground from '../components/Playground.vue'
import './style.css'

export default {
	enhanceApp({ app }) {
		// register global components
		app.component('Playground', Playground)
	},
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {})
	},
} satisfies Theme
