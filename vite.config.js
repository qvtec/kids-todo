import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'script',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
            outDir: 'public/build',
            base: 'public',
            scope: '/',
            buildBase: '/',
            workbox: {
              navigateFallback: '/',
              navigateFallbackDenylist: [/\/[api,admin]+\/.*/],
              maximumFileSizeToCacheInBytes: 4194304,
              globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,woff2}'],
              cleanupOutdatedCaches: true,
              directoryIndex: null, // this prevents fallback to index.html
            },
            manifest: {
                name: 'Kids Todo APP',
                short_name: 'Laravel APP',
                theme_color: '#0e7490',
                background_color: "#FFFFFF",
                display: "standalone",
                orientation: "portrait",
                id: '/',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
            }
        }),
    ],
});
