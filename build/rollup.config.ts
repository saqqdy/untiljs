import type { InternalModuleFormat, OutputOptions, Plugin, RollupOptions } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import filesize from 'rollup-plugin-filesize'
import { visualizer } from 'rollup-plugin-visualizer'
import { banner, extensions, reporter } from './config'

export interface Config {
	browser?: boolean
	env: 'development' | 'production'
	file: string
	format: InternalModuleFormat
	input: string
	minify?: boolean
	plugins?: Plugin[]
	transpile?: boolean
}

export interface Output extends OutputOptions {
	plugins: Plugin[]
}

export interface Options extends RollupOptions {
	external: string[]
	output: Output
	plugins: Plugin[]
}

const IS_WATCH = process.env.ROLLUP_WATCH

const configs: Config[] = IS_WATCH
	? [
		{
			browser: true,
			env: 'development',
			file: 'dist/index.mjs',
			format: 'es',
			input: 'src/index.ts',
		},
		{
			env: 'development',
			file: 'dist/index.cjs',
			format: 'cjs',
			input: 'src/index.ts',
		},
	]
	: [
		{
			env: 'development',
			file: 'dist/index.mjs',
			format: 'es',
			input: 'src/index.ts',
		},
		{
			env: 'development',
			file: 'dist/index.iife.js',
			format: 'iife',
			input: 'src/index.ts',
		},
		{
			env: 'production',
			file: 'dist/index.iife.min.js',
			format: 'iife',
			input: 'src/index.ts',
			minify: true,
		},
		{
			env: 'development',
			file: 'dist/index.cjs',
			format: 'cjs',
			input: 'src/index.ts',
		},
	]

function createEntries() {
	return configs.map(createEntry)
}

function createEntry(config: Config) {
	const isGlobalBuild = config.format === 'iife'
	const isTypeScript = config.input.endsWith('.ts')
	const isTranspiled
		= config.input.endsWith('bundler.js')
		  || config.input.endsWith('browser.js')
		  || config.input.endsWith('prod.js')

	const _config: Options = {
		external: [],
		input: config.input,
		onwarn: (msg: any, warn) => {
			if (!/Circular/.test(msg)) {
				warn(msg)
			}
		},
		output: {
			exports: 'auto',
			file: config.file,
			format: config.format,
			globals: {},
			// extend: true,
			plugins: [],
		},
		plugins: [],
	}

	if (isGlobalBuild || config.browser) _config.output.banner = banner

	if (isGlobalBuild) {
		_config.output.name = _config.output.name || 'until'
	}

	if (!isGlobalBuild) {
		_config.external.push('@vue/reactivity', 'js-cool', 'tslib')
	}

	_config.plugins.push(nodeResolve(), commonjs(), json())

	if (config.transpile !== false) {
		if (!isTranspiled) {
			_config.plugins.push(
				babel({
					babelHelpers: 'bundled',
					exclude: [/node_modules[\\/]core-js/],
					extensions,
				}),
			)
		}
		if (isTypeScript) {
			_config.plugins.push(
				typescript({
					compilerOptions: {
						declaration: false,
					},
				}),
			)
		}
	}

	if (config.minify) {
		_config.plugins.push(terser({ module: config.format === 'es' }))
	}

	_config.plugins.push(filesize({ reporter }), visualizer())

	return _config
}

export default createEntries()
