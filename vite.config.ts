import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/events-api': {
				target: 'https://events.queereszentrumkassel.de',
				changeOrigin: true,
				secure: false,
      	rewrite: path => path.replace(/^\/events-api/, ''),
			}
		},
	}
});
