import { defineConfig } from 'vitepress'

export default defineConfig({
	base: '/untiljs/',
	head: [
		['link', { href: '/untiljs/logo.svg', rel: 'icon' }],
		['meta', { name: 'theme-color', content: '#42b883' }],
	],

	locales: {
		root: {
			description: 'Promise-based one-time watch for changes - Framework Agnostic',
			label: 'English',
			lang: 'en',
			themeConfig: {
				darkModeSwitchLabel: 'Theme',
				darkModeSwitchTitle: 'Switch to dark theme',
				docFooter: { next: 'Next', prev: 'Previous' },
				editLink: {
					pattern: 'https://github.com/saqqdy/untiljs/edit/master/docs/:path',
					text: 'Edit this page on GitHub',
				},
				footer: {
					copyright: 'Copyright © 2024-present saqqdy',
					message: 'Released under the MIT License.',
				},
				langMenuLabel: 'Language',
				lastUpdated: {
					formatOptions: { dateStyle: 'medium', timeStyle: 'short' },
					text: 'Last updated',
				},
				lightModeSwitchTitle: 'Switch to light theme',
				nav: [
					{ activeMatch: '/guide/', link: '/guide/', text: 'Guide' },
					{ link: '/playground', text: 'Playground' },
					{ activeMatch: '/api/', link: '/api/', text: 'API' },
					{
						items: [
							{ link: 'https://github.com/saqqdy/untiljs', text: 'GitHub' },
							{ link: 'https://www.npmjs.com/package/untiljs', text: 'NPM' },
						],
						text: 'Links',
					},
				],
				outline: { label: 'On this page' },
				returnToTopLabel: 'Return to top',
				sidebar: {
					'/api/': [
						{
							items: [{ link: '/api/', text: 'Overview' }],
							text: 'API Reference',
						},
						{
							collapsed: false,
							items: [
								{ link: '/api/until', text: 'until()' },
								{ link: '/api/create-store', text: 'createStore()' },
							],
							text: 'Functions',
						},
						{
							collapsed: false,
							items: [
								{ link: '/api/watch-source', text: 'WatchSource' },
								{ link: '/api/subscribable', text: 'Subscribable' },
								{ link: '/api/options', text: 'UntilToMatchOptions' },
							],
							text: 'Types',
						},
						{
							collapsed: false,
							items: [
								{ link: '/api/methods/toBe', text: 'toBe()' },
								{ link: '/api/methods/toMatch', text: 'toMatch()' },
								{ link: '/api/methods/toBeTruthy', text: 'toBeTruthy()' },
								{ link: '/api/methods/toBeNull', text: 'toBeNull()' },
								{ link: '/api/methods/toBeUndefined', text: 'toBeUndefined()' },
								{ link: '/api/methods/toBeNaN', text: 'toBeNaN()' },
								{ link: '/api/methods/changed', text: 'changed()' },
								{ link: '/api/methods/changedTimes', text: 'changedTimes()' },
								{ link: '/api/methods/toContains', text: 'toContains()' },
								{ link: '/api/methods/not', text: 'not.*' },
							],
							text: 'Methods',
						},
					],
					'/guide/': [
						{
							items: [
								{ link: '/guide/', text: 'Introduction' },
								{ link: '/guide/installation', text: 'Installation' },
								{ link: '/guide/quick-start', text: 'Quick Start' },
								{ link: '/guide/migration', text: 'Migration (v1 → v2)' },
							],
							text: 'Getting Started',
						},
						{
							items: [
								{ link: '/guide/vue', text: 'Vue' },
								{ link: '/guide/react', text: 'React' },
								{ link: '/guide/angular', text: 'Angular' },
								{ link: '/guide/svelte', text: 'Svelte' },
								{ link: '/guide/nodejs', text: 'Node.js' },
								{ link: '/guide/vanilla', text: 'Vanilla JS' },
							],
							text: 'Framework Integration',
						},
						{
							items: [
								{ link: '/guide/timeout', text: 'Timeout Handling' },
								{ link: '/guide/deep-comparison', text: 'Deep Comparison' },
								{ link: '/guide/not-modifier', text: 'Not Modifier' },
							],
							text: 'Advanced',
						},
					],
				},
				sidebarMenuLabel: 'Menu',
			},
			title: 'UntilJS',
		},
		zh: {
			description: '基于 Promise 的一次性变化监听 - 框架无关',
			label: '简体中文',
			lang: 'zh-CN',
			link: '/zh/',
			themeConfig: {
				darkModeSwitchLabel: '主题',
				darkModeSwitchTitle: '切换到深色模式',
				docFooter: { next: '下一页', prev: '上一页' },
				editLink: {
					pattern: 'https://github.com/saqqdy/untiljs/edit/master/docs/:path',
					text: '在 GitHub 上编辑此页',
				},
				footer: {
					copyright: '版权所有 © 2024-present saqqdy',
					message: '基于 MIT 许可发布',
				},
				langMenuLabel: '语言',
				lastUpdated: {
					formatOptions: { dateStyle: 'medium', timeStyle: 'short' },
					text: '最后更新于',
				},
				lightModeSwitchTitle: '切换到浅色模式',
				nav: [
					{ activeMatch: '/zh/guide/', link: '/zh/guide/', text: '指南' },
					{ link: '/zh/playground', text: '在线体验' },
					{ activeMatch: '/zh/api/', link: '/zh/api/', text: 'API' },
					{
						items: [
							{ link: 'https://github.com/saqqdy/untiljs', text: 'GitHub' },
							{ link: 'https://www.npmjs.com/package/untiljs', text: 'NPM' },
						],
						text: '链接',
					},
				],
				outline: { label: '页面导航' },
				returnToTopLabel: '回到顶部',
				sidebar: {
					'/zh/api/': [
						{
							items: [{ link: '/zh/api/', text: '概览' }],
							text: 'API 参考',
						},
						{
							collapsed: false,
							items: [
								{ link: '/zh/api/until', text: 'until()' },
								{ link: '/zh/api/create-store', text: 'createStore()' },
							],
							text: '函数',
						},
						{
							collapsed: false,
							items: [
								{ link: '/zh/api/watch-source', text: 'WatchSource' },
								{ link: '/zh/api/subscribable', text: 'Subscribable' },
								{ link: '/zh/api/options', text: 'UntilToMatchOptions' },
							],
							text: '类型',
						},
						{
							collapsed: false,
							items: [
								{ link: '/zh/api/methods/toBe', text: 'toBe()' },
								{ link: '/zh/api/methods/toMatch', text: 'toMatch()' },
								{ link: '/zh/api/methods/toBeTruthy', text: 'toBeTruthy()' },
								{ link: '/zh/api/methods/toBeNull', text: 'toBeNull()' },
								{ link: '/zh/api/methods/toBeUndefined', text: 'toBeUndefined()' },
								{ link: '/zh/api/methods/toBeNaN', text: 'toBeNaN()' },
								{ link: '/zh/api/methods/changed', text: 'changed()' },
								{ link: '/zh/api/methods/changedTimes', text: 'changedTimes()' },
								{ link: '/zh/api/methods/toContains', text: 'toContains()' },
								{ link: '/zh/api/methods/not', text: 'not.*' },
							],
							text: '方法',
						},
					],
					'/zh/guide/': [
						{
							items: [
								{ link: '/zh/guide/', text: '介绍' },
								{ link: '/zh/guide/installation', text: '安装' },
								{ link: '/zh/guide/quick-start', text: '快速上手' },
								{ link: '/zh/guide/migration', text: '迁移指南 (v1 → v2)' },
							],
							text: '开始',
						},
						{
							items: [
								{ link: '/zh/guide/vue', text: 'Vue' },
								{ link: '/zh/guide/react', text: 'React' },
								{ link: '/zh/guide/angular', text: 'Angular' },
								{ link: '/zh/guide/svelte', text: 'Svelte' },
								{ link: '/zh/guide/nodejs', text: 'Node.js' },
								{ link: '/zh/guide/vanilla', text: '原生 JS' },
							],
							text: '框架集成',
						},
						{
							items: [
								{ link: '/zh/guide/timeout', text: '超时处理' },
								{ link: '/zh/guide/deep-comparison', text: '深度比较' },
								{ link: '/zh/guide/not-modifier', text: '取反修饰符' },
							],
							text: '进阶',
						},
					],
				},
				sidebarMenuLabel: '菜单',
			},
			title: 'UntilJS',
		},
	},

	themeConfig: {
		logo: '/logo.svg',
		search: {
			provider: 'local',
		},
		siteTitle: 'UntilJS',
		socialLinks: [{ icon: 'github', link: 'https://github.com/saqqdy/untiljs' }],
	},

	title: 'UntilJS',
})
