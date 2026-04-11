import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

// Inject token into every request
api.interceptors.request.use((config) => {
    const auth = useAuthStore();
    if (auth.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
});

// Handle 401 (Expired Token) automatically
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const auth = useAuthStore();
            auth.logout(); // Clears local storage and state
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

export default api;
