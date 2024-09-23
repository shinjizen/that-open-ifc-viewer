import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        proxy: {
            '/viewer': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/viewer/, 'viewer'),
            },
        },
    },
    build: {
        outDir: 'dist',
    },
});
