<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const toast = useToast()

// Get quiz result from query params
const score = route.query.score || '0'
const time = route.query.time || '00:00:00'
const quizCode = route.query.code || ''

// Optional toast message
if (route.query.message) {
  toast.success(route.query.message)
}

const goToDashboard = () => {
  router.push('/dashboard')
}

const retryQuiz = () => {
  if (quizCode) {
    router.push(`/quiz/${quizCode}`)
  } else {
    toast.error('Quiz code missing, cannot retry.')
  }
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4 relative"
  >
    <div
      class="bg-white rounded-xl p-8 max-w-md w-full text-center border border-indigo-100 shadow-lg relative overflow-hidden"
    >
      <!-- Animated Checkmark -->
      <div class="flex justify-center mb-6">
        <div
          class="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center animate-bounce"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-gray-800 mb-2">🎉 Quiz Submitted!</h2>
      <p class="text-gray-600 mb-6">Your result is ready. Check your score and time taken below.</p>

      <!-- Quiz Result Summary -->
      <div class="bg-indigo-50 rounded-xl p-4 mb-6 space-y-2">
        <div class="flex justify-between text-gray-700 text-lg font-medium">
          <span>Score:</span>
          <span class="font-bold text-indigo-600">{{ score }}</span>
        </div>
        <div class="flex justify-between text-gray-700 text-lg font-medium">
          <span>Time Taken:</span>
          <span class="font-bold text-indigo-600">{{ time }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          @click="goToDashboard"
          class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
        >
          Go to Dashboard
        </button>
        <button
          @click="retryQuiz"
          class="flex-1 border border-indigo-300 hover:bg-indigo-50 text-indigo-600 font-semibold py-3 rounded-xl transition-all duration-200"
        >
          Retry Quiz
        </button>
      </div>
    </div>

    <!-- Subtle background circles -->
    <div
      class="absolute top-0 left-0 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-40 -z-10"
    ></div>
    <div
      class="absolute bottom-0 right-0 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-40 -z-10"
    ></div>
  </div>
</template>

<style scoped>
/* Optional: smoother bounce animation */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10%);
  }
}
.animate-bounce {
  animation: bounce 1s infinite;
}
</style>
