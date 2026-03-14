import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		cors: true,
		fs: { allow: ['..'] },
		host: true,
		port: 8888,
		proxy: {
			'/app/': {
				changeOrigin: true,
				target: 'http://rap2api.taobao.org'
			}
		}
	}
})
