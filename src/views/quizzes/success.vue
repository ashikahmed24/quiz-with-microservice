<script setup>
import MathJax from '@/components/MathJax.vue'
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

// Get quiz result from query params
const score = route.query.score
const time = route.query.time
const allow_blank = route.query.allow_blank

const answers = ref([])

if (route.query.answers) {
  try {
    answers.value = JSON.parse(route.query.answers)
  } catch (e) {
    answers.value = []
  }
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4 relative"
  >
    <div
      class="bg-white rounded-xl p-8 max-w-md w-full text-center border border-indigo-100 relative overflow-hidden"
    >
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

      <div class="bg-indigo-50 rounded-xl p-4 mb-6 space-y-2">
        <div class="flex justify-between text-gray-700 text-lg font-medium">
          <span>Score:</span>
          <span class="font-bold text-indigo-600">{{ score }}</span>
        </div>
        <div class="flex justify-between text-gray-700 text-lg font-medium">
          <span>Duration:</span>
          <span class="font-bold text-indigo-600">{{ time }}</span>
        </div>
      </div>

      <div class="w-full text-center space-x-4">
        <RouterLink :to="{ name: 'home' }" class="base__button">Go to Home</RouterLink>
        <button class="base__outline">Retry Quiz</button>
      </div>
    </div>

    <div v-if="route.query.allow_blank === 'true'" class="max-w-3xl w-full mx-auto my-6">
      <div
        v-for="answer in answers"
        :key="answer.id"
        class="bg-white p-4 border border-border rounded mb-3"
      >
        <div class="flex items-start gap-2">
          <strong>Question:</strong> <MathJax :content="answer.question.content" />
        </div>
        <div class="flex items-start gap-2">
          <strong>Your Answer:</strong>
          <MathJax :content="answer.option?.content || answer.text_answer || 'No answer'" />
        </div>
        <div class="flex items-start gap-2">
          <strong>Correct:</strong>
          <span :class="answer.is_correct ? 'text-green-600' : 'text-red-600'">
            {{ answer.is_correct ? 'Yes' : 'No' }}
          </span>
        </div>
        <div class="flex items-start gap-2">
          <strong>Marks:</strong> {{ answer.marks_obtained }}
        </div>
        <div class="flex items-start gap-2" v-if="answer.question.explanation">
          <strong>Explanation:</strong> <MathJax :content="answer.question.explanation" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
