<script setup>
import { useAuthStore } from '@/stores/auth'
import { reactive } from 'vue'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import IconClose from './icons/IconClose.vue'

const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const { errors } = storeToRefs(authStore)

// props and emits
const emit = defineEmits(['close'])

const form = reactive({
  name: '',
  phone: '',
  email: '',
})

const register = async () => {
  const response = await authStore.register(form)
  if (response.status === 200) {
    toast.success(response.data.message)
    router.push({ name: 'quiz.start', params: { code: route.params.code } })
    emit('close') // close overlay after success
  } else {
    toast.error('Registration failed. Please try again.')
  }
}
</script>

<template>
  <main
    v-if="true"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm px-4"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fadeIn">
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        aria-label="Close"
      >
        <IconClose class="size-5" />
      </button>
      <h2 class="text-2xl font-bold text-center text-indigo-600 mb-2">Take the Quiz</h2>
      <p class="text-center text-gray-500 mb-6">
        Enter your details below to start your quiz instantly.
      </p>

      <form @submit.prevent="register" class="space-y-4">
        <div class="form__group">
          <label for="name" class="form__label">Full Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="form__control"
            placeholder="Enter your full name"
            required
          />
          <small v-if="errors.name" class="text-danger">{{ errors.name[0] }}</small>
        </div>

        <div class="form__group">
          <label for="phone" class="form__label">Phone Number</label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            class="form__control"
            placeholder="e.g. 01711000000"
            required
          />
          <small v-if="errors.phone" class="text-danger">{{ errors.phone[0] }}</small>
        </div>

        <div class="form__group">
          <label for="email" class="form__label">Email Address</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form__control"
            placeholder="you@example.com"
            required
          />
          <small v-if="errors.email" class="text-danger">{{ errors.email[0] }}</small>
        </div>

        <button type="submit" class="base__button w-full" :disabled="authStore.loading">
          <span v-if="authStore.loading">Preparing your quiz...</span>
          <span v-else>Start Quiz</span>
        </button>
      </form>

      <p
        class="mt-4 text-center text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3"
      >
        <strong>Note:</strong> If you’ve already registered before, simply use the same email or
        phone number — we’ll recognize you automatically.
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
