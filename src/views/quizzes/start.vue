<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useQuizStore } from '@/stores/quiz'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import BaseButton from '@/components/BaseButton.vue'

const quizStore = useQuizStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()

// --- State ---
const quiz = ref({})
const questions = ref([])
const currentIndex = ref(0)
const selectedIndex = ref(null)
const score = ref(0)
const results = ref([])
const timeLeft = ref(0)
const timer = ref(null)

// --- Computed ---
const currentQuestion = computed(() => questions.value[currentIndex.value] || {})
const answered = computed(() => results.value[currentIndex.value] !== undefined)
const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60)
  const s = timeLeft.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

// --- Load Quiz ---
const loadQuiz = async () => {
  const { data } = await quizStore.start(route.params.code)
  quiz.value = data

  questions.value = data.questions.map((q) => ({
    id: q.id,
    text: q.content,
    mark: q.mark,
    options: q.options.map((o) => ({
      id: o.id,
      label: o.label,
      content: o.content,
      is_correct: o.is_correct,
    })),
    answer: q.options.findIndex((o) => o.is_correct),
  }))

  // Set timer
  timeLeft.value = quiz.value.time_limit * 60
  startTimer()
}

// --- Timer ---
const startTimer = () => {
  clearInterval(timer.value)
  timer.value = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--
    else {
      clearInterval(timer.value)
      submit(true) // auto-submit when time ends
    }
  }, 1000)
}

// --- Selection Handler ---
const select = (index) => {
  if (answered.value) return // disable after first click

  selectedIndex.value = index

  // Save answer
  results.value[currentIndex.value] = {
    question_id: currentQuestion.value.id,
    option_id: currentQuestion.value.options[index].id,
  }

  // Update live score
  score.value = results.value.reduce((total, r, i) => {
    const q = questions.value[i]
    const selectedOption = q.options.find((o) => o.id === r.option_id)
    return total + (selectedOption?.is_correct ? q.mark : 0)
  }, 0)
}

// --- Navigation ---
const next = () => {
  if (currentIndex.value < questions.value.length - 1) currentIndex.value++
  updateSelectedIndex()
}
const prev = () => {
  if (currentIndex.value > 0) currentIndex.value--
  updateSelectedIndex()
}
const updateSelectedIndex = () => {
  const ans = results.value[currentIndex.value]
  selectedIndex.value = ans
    ? questions.value[currentIndex.value].options.findIndex((o) => o.id === ans.option_id)
    : null
}

// --- Submit Quiz ---
const submit = async () => {
  clearInterval(timer.value)

  // final score calculation
  score.value = results.value.reduce((total, r, i) => {
    const q = questions.value[i]
    const selectedOption = q.options.find((o) => o.id === r.option_id)
    return total + (selectedOption?.is_correct ? q.mark : 0)
  }, 0)

  const payload = {
    started_at: new Date()
      .toLocaleString('sv-SE', {
        timeZone: 'Asia/Dhaka',
        hour12: false,
      })
      .replace(' ', 'T'),
    answers: results.value.map((r) => ({
      question_id: r.question_id,
      option_id: r.option_id,
    })),
  }

  const response = await quizStore.submit(quiz.value.code, payload)

  if (response.success) {
    toast.success(response.message)

    // Navigate to success page
    router.push({
      name: 'quiz.success',
      params: { code: response.data?.quiz?.code },
      query: {
        score: response.data.score,
        time: response.data.duration_formatted,
      },
    })
  }
}

// --- Option Styles ---
const choiceClass = (index) => {
  if (!answered.value) return 'cursor-pointer border-gray-300 hover:border-indigo-400'
  return selectedIndex.value === index
    ? 'border-indigo-500 bg-indigo-50 cursor-pointer'
    : 'border-gray-300 cursor-not-allowed'
}

// --- Lifecycle ---
onUnmounted(() => clearInterval(timer.value))
onMounted(() => loadQuiz())
</script>

<template>
  <div class="min-h-screen bg-[url(/bg-quiz.jpg)] bg-cover flex items-center justify-center p-4">
    <div class="w-full bg-gray-100 max-w-3xl p-6 rounded-xl">
      <!-- Header -->
      <header class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-indigo-600">{{ quiz.title }}</h1>
          <p class="text-sm text-gray-500">{{ quiz.description }}</p>
        </div>
        <div class="text-right">
          <div class="text-sm text-gray-600">
            সময় বাকি: <span class="font-semibold text-red-600">{{ formattedTime }}</span>
          </div>
          <div class="text-xs text-gray-500 mt-1">
            প্রশ্ন {{ currentIndex + 1 }} / {{ questions.length }} | স্কোর:
            <span class="font-semibold text-indigo-600">{{ score }}</span>
          </div>
        </div>
      </header>

      <!-- Progress Bar -->
      <div v-if="questions.length" class="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
        <div
          :style="{ width: ((currentIndex + 1) / questions.length) * 100 + '%' }"
          class="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all"
        ></div>
      </div>

      <!-- Question Card -->
      <div v-if="currentQuestion && questions.length">
        <main class="bg-white rounded-2xl p-6 border border-gray-100">
          <!-- Question -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold">প্রশ্ন {{ currentQuestion.id }}: {{ currentQuestion.text }}</h3>
            <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {{ currentQuestion.mark }} পয়েন্ট
            </span>
          </div>

          <!-- Options -->
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li v-for="(choice, index) in currentQuestion.options" :key="choice.id">
              <button
                class="w-full text-left p-4 rounded-xl border transition focus:outline-none flex items-center justify-between"
                :class="choiceClass(index)"
                @click="select(index)"
                :disabled="answered"
              >
                <div class="flex items-center gap-2 truncate">
                  <span class="font-semibold">{{ choice.label }}.</span>
                  <span>{{ choice.content }}</span>
                </div>
                <span v-if="answered && choice.is_correct" class="text-green-600 font-bold"
                  >✔</span
                >
                <span
                  v-if="answered && selectedIndex === index && !choice.is_correct"
                  class="text-red-600 font-bold"
                  >✘</span
                >
              </button>
            </li>
          </ul>

          <!-- Navigation -->
          <div class="mt-8 flex items-center justify-between">
            <button class="base__outline" @click="prev" :disabled="currentIndex === 0">Prev</button>

            <div>
              <button
                v-if="currentIndex < questions.length - 1"
                class="base__button"
                @click="next"
                :disabled="!answered"
              >
                Next
              </button>

              <BaseButton v-else @click="submit" :loading="quizStore.loading">Submit</BaseButton>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
