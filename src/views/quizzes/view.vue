<script setup>
import { onMounted, ref, watch } from 'vue'
import { useQuizStore } from '@/stores/quiz'
import { useRoute, useRouter } from 'vue-router'
import AuthOverlay from '@/components/AuthOverlay.vue'
import { useAuthStore } from '@/stores/auth'
import MathJax from '@/components/MathJax.vue'
const authStore = useAuthStore()
const quizStore = useQuizStore()
const route = useRoute()
const router = useRouter()
const quiz = ref(null)
const errors = ref(null)

// state to toggle overlay
const showAuthOverlay = ref(false)

const loadQuiz = async () => {
  const response = await quizStore.view(route.params.code)
  quiz.value = response.data
}

const startQuiz = async () => {
  // check login or token first
  if (!authStore.token) {
    showAuthOverlay.value = true
    return
  }

  const { data } = await quizStore.start(route.params.code)
  router.push({ name: 'quiz.start', params: { code: data.code } })
}

onMounted(() => {
  loadQuiz()
})

watch(
  () => authStore.token,
  (token) => {
    if (token) {
      showAuthOverlay.value = false
    }
  },
)
</script>

<template>
  <div class="min-h-screen bg-[url(/bg-quiz.jpg)] bg-cover flex items-center justify-center p-4">
    <template v-if="quizStore.loading">
      <div class="w-full max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 animate-pulse">
        <div class="flex flex-col items-center space-y-4">
          <div
            class="h-12 w-12 rounded-full border-4 border-gray-300 border-t-primary animate-spin"
          ></div>

          <div class="h-4 w-3/4 bg-gray-200 rounded"></div>
          <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
          <p class="text-gray-500 mt-4">Please wait...</p>
        </div>
      </div>
    </template>

    <template v-else-if="quiz">
      <div class="w-full bg-gray-100 max-w-3xl text-center p-6 rounded-xl">
        <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ quiz.title }}</h3>
        <p class="text-gray-500 mb-4">{{ quiz.description }}</p>

        <div class="text-sm text-gray-600 mb-6">
          <p><strong>Total Marks:</strong> {{ quiz.total_marks }}</p>
          <p><strong>Passing Marks:</strong> {{ quiz.passing_marks }}</p>
          <p><strong>Time Limit:</strong> {{ quiz.time_limit }} mins</p>
        </div>

        <button @click="startQuiz" :disabled="quizStore.loading" class="base__button">
          <span v-if="quizStore.loading" class="animate-pulse">Starting...</span>
          <span v-else>Start Quiz</span>
        </button>

        <AuthOverlay v-if="showAuthOverlay" @close="showAuthOverlay = false" />

        <p v-if="errors" class="text-red-500 mt-4">{{ errors }}</p>
        <p v-if="errors" class="text-green-600 mt-4">Quiz Started Successfully!</p>
      </div>
    </template>
    <template v-else>
      <div class="w-full bg-gray-100 max-w-3xl text-center p-6 rounded-xl">
        <div class="p-10 text-center">
          <h1 class="text-6xl font-bold text-red-500 mb-4">404</h1>
          <h2 class="text-2xl font-semibold mb-4">Quiz Not Found</h2>
          <p class="text-gray-600 mb-6">
            Sorry, the quiz you are looking for does not exist or has been removed.
          </p>
          <router-link
            to="/"
            class="inline-block bg-red-500 text-white px-6 py-2 rounded-full font-medium hover:bg-red-600 transition"
          >
            Go Home
          </router-link>
        </div>
      </div>
    </template>
  </div>
</template>
