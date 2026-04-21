import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        noDiscovery: true
    },
    plugins: [
        vue(),
        tailwindcss(),
        Components({
            resolvers: [PrimeVueResolver()]
        })
        // VueRouter({
        //     // Point to your different view folders
        //     routesFolder: [
        //         { src: 'src/views/pages', path: '' }, // Public routes at root
        //         { src: 'src/views/uikit', path: 'app/' } // Internal routes under /app
        //     ],
        //     extensions: ['.vue']
        // }),
        // vue()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});
