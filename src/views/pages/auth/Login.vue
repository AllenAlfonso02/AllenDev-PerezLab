<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();
const username = ref('');
const password = ref('');
// 1. Define your array of test users
const testUsers = [
    { user: 'hugob', pass: 'password1' },
    { user: 'allen', pass: 'allen1' },
    { user: 'bibi', pass: 'manuel1' },
    { user: 'xiomara', pass: 'manuel1' },
    { user: 'clara', pass: 'manuel1' }
];

const loading = ref(false);
const error = ref('');
async function onSubmit() {
    error.value = '';
    loading.value = true;

    const inputUser = username.value.trim().toLowerCase();
    const inputPass = password.value.trim();

    const validUser = testUsers.find((u) => {
        return u.user.toLowerCase() === inputUser && u.pass === inputPass;
    });

    if (!validUser) {
        error.value = 'Invalid username or password.';
        loading.value = false;
        return;
    }

    // --- BYPASS START ---
    // If it's a test user, we manually "log in" without hitting the server
    try {
        // You can still call auth.login if your store has a "mock" mode,
        // but if it's hitting a real database, it will fail.
        // For testing, let's just force the redirect:

        console.log('Local test match found! Redirecting...');
        const target = '/app/uikit/table';
        router.push(target);
    } catch (e) {
        error.value = e?.message || 'Store login failed';
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div style="max-width: 420px; margin: 2rem auto; padding: 1rem; border: 1px solid #ddd; border-radius: 12px">
        <h2>Staff Login</h2>

        <form @submit.prevent="onSubmit" style="display: grid; gap: 12px; margin-top: 12px">
            <label>
                Username
                <input v-model="username" type="text" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 10px" />
            </label>
            <label>
                Password
                <input v-model="password" type="password" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 10px" />
            </label>

            <button :disabled="loading" style="padding: 10px; border-radius: 10px; border: 1px solid #ddd; background: #111; color: #fff">
                {{ loading ? 'Logging in…' : 'Login' }}
            </button>

            <div v-if="error" style="color: #b00020">{{ error }}</div>
        </form>
    </div>
</template>
