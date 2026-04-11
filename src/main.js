import '@/assets/styles.scss';
import '@/assets/tailwind.css';
import { useAuthStore } from '@/stores/auth';
import Aura from '@primeuix/themes/aura';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(pinia);
app.use(ConfirmationService);
// Restore auth state BEFORE the router is ready
const auth = useAuthStore();
auth.restore();
app.mount('#app');
