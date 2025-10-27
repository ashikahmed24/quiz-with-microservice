<script setup>
import { onMounted, ref } from 'vue'
import { useQuizStore } from '@/stores/quiz'
import { useRoute } from 'vue-router'

const quizStore = useQuizStore()
const route = useRoute()
const quiz = ref(null)
const errors = ref(null)

const loadQuiz = async () => {
  const response = await quizStore.view(route.params.code)
  quiz.value = response.data
}

onMounted(() => {
  loadQuiz()
})

const startQuiz = async () => {
  await quizStore.start(route.params.code)
}
</script>

<template>
  <div class="min-h-screen bg-[url(/bg-quiz.jpg)] bg-cover flex items-center justify-center p-4">
    <div v-if="quiz" class="w-full bg-gray-100 max-w-3xl text-center p-6 rounded-xl">
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

      <p v-if="errors" class="text-red-500 mt-4">{{ errors }}</p>
      <p v-if="errors" class="text-green-600 mt-4">Quiz Started Successfully!</p>
    </div>
  </div>
</template>
