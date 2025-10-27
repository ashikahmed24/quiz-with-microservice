<script setup>
import { useAuthStore } from '@/stores/auth'
import { reactive } from 'vue'

const authStore = useAuthStore()

const form = reactive({
  email: 'info@ashikahmed.net',
  password: 'password',
})

const login = async () => {
  await authStore.login(form)
}
</script>

<template>
  <main
    v-if="true"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fadeIn">
      <h2 class="text-2xl font-bold text-center mb-6">Welcome Back</h2>

      <form @submit.prevent="login" class="space-y-4">
        <div class="form__group">
          <label class="form__label">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="form__control"
            placeholder="you@example.com"
            required
          />
        </div>

        <div class="form__group">
          <label class="form__label">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="form__control"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" class="base__button w-full" :disabled="authStore.loading">
          <span v-if="authStore.loading">Signing in...</span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <p class="text-center text-sm text-gray-600 mt-4">
        Don’t have an account?
        <a href="#" class="text-primary font-medium hover:underline">Sign up</a>
      </p>
    </div>
  </main>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
