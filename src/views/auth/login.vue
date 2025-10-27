<script setup>
import { reactive } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import { useAuthStore } from '@/stores/auth.js'
import BaseInput from '@/components/BaseInput.vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const { errors } = storeToRefs(authStore)

const form = reactive({
  email: 'info@ashikahmed.net',
  password: 'password',
})

const submit = async () => {
  const { data } = await authStore.login(form)
  console.log(data)
}
</script>

<template>
  <main class="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
    <!-- Main Card -->
    <div class="w-full max-w-5xl bg-white rounded-lg grid grid-cols-1 md:grid-cols-2">
      <!-- Left Section -->
      <div class="flex flex-col justify-center items-center p-10">
        <img src="/auth.jpg" alt="Illustration" class="mb-6" />
        <h2 class="text-2xl font-bold text-center mb-3">Show your skills be an innovator</h2>
        <p class="text-gray-500 text-center">
          Seize the moment and help shape the future by starting a career in blockchain now
        </p>
        <div class="flex justify-center mt-6 space-x-2">
          <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
          <span class="w-2 h-2 bg-gray-300 rounded-full"></span>
          <span class="w-2 h-2 bg-gray-300 rounded-full"></span>
          <span class="w-2 h-2 bg-gray-300 rounded-full"></span>
        </div>
      </div>

      <!-- Right Section -->
      <div class="p-10">
        <h2 class="text-2xl font-bold mb-2">Sign In</h2>
        <p class="text-gray-500 mb-6">Welcome back, you've been missed!</p>

        <!-- Form -->
        <form @submit.prevent="submit">
          <BaseInput
            v-model="form.email"
            label="Email"
            placeholder="Enter your email"
            :error="errors.email"
            :required="true"
          />

          <BaseInput
            v-model="form.password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            :error="errors.password"
            :required="true"
          />

          <div class="flex items-center justify-between mb-6">
            <label class="flex items-center space-x-2">
              <input type="checkbox" class="accent-emerald-500" />
              <span class="text-sm text-gray-600">Remember Me</span>
            </label>
            <RouterLink :to="{ name: 'forgot' }" class="text-sm text-blue-600 hover:underline"
              >Forget Password?</RouterLink
            >
          </div>

          <BaseButton :loading="authStore.loading" class="w-full">Submit</BaseButton>
        </form>

        <p class="text-sm text-center text-gray-500 mt-6">
          Need help?
          <a href="mailto:info@ashikahmed.net" class="text-blue-600 hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
