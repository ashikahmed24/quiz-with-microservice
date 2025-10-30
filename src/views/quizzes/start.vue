<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useQuizStore } from '@/stores/quiz'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import BaseButton from '@/components/BaseButton.vue'
import MathJax from '@/components/MathJax.vue'

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

// answered: এখন শুধু বোঝাবে user কি answer দিয়েছে কিনা
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

  timeLeft.value = quiz.value.duration * 60
  startTimer()
}

// --- Timer ---
const startTimer = () => {
  clearInterval(timer.value)
  timer.value = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--
    else {
      clearInterval(timer.value)
      submit(true)
    }
  }, 1000)
}

// --- Selection Handler ---
const select = (index) => {
  selectedIndex.value = index

  // Save/Update answer
  results.value[currentIndex.value] = {
    question_id: currentQuestion.value.id,
    option_id: currentQuestion.value.options[index].id,
  }

  // Update live score
  score.value = results.value.reduce((total, r, i) => {
    const q = questions.value[i]
    const opt = q.options.find((o) => o.id === r.option_id)
    return total + (opt?.is_correct ? q.mark : 0)
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

  score.value = results.value.reduce((total, r, i) => {
    const q = questions.value[i]
    const selectedOption = q.options.find((o) => o.id === r.option_id)
    return total + (selectedOption?.is_correct ? q.mark : 0)
  }, 0)

  const payload = {
    answers: results.value.map((result) => ({
      question_id: result.question_id,
      option_id: result.option_id,
    })),
  }

  const response = await quizStore.submit(quiz.value.code, payload)

  console.log(response.data)

  if (response.status === 200) {
    router.push({
      name: 'quiz.success',
      query: {
        score: response.data.data.score,
        time: response.data.data.duration_formatted,
        status: response.data.data.status,
        allow_blank: response.data.data.allow_blank,
        answers: JSON.stringify(response.data.data.answers),
      },
    })
  }
}

// --- Option Styles ---
const choiceClass = (index) => {
  return selectedIndex.value === index
    ? 'border-indigo-500 bg-indigo-100 cursor-pointer'
    : 'border-gray-300 hover:border-indigo-400 cursor-pointer'
}

// --- Lifecycle ---
onUnmounted(() => clearInterval(timer.value))
onMounted(() => loadQuiz())
</script>

<template>
  <div class="min-h-screen bg-[url(/bg-quiz.jpg)] bg-cover flex items-center justify-center p-4">
    <div class="w-full bg-gray-100 max-w-3xl p-6 rounded-xl">
      <!-- Header -->
      <header class="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-bold text-primary">{{ quiz.title }}</h1>
          <p class="text-sm text-gray-500">{{ quiz.description }}</p>
        </div>
        <div class="flex md:flex-col items-center gap-4 text-right">
          <div class="text-sm text-gray-600">
            সময় বাকি: <span class="font-semibold text-red-600">{{ formattedTime }}</span>
          </div>
          <div class="text-xs text-gray-500">
            <span class="font-semibold text-primary"
              >প্রশ্ন {{ currentIndex + 1 }} / {{ questions.length }}
            </span>
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
          <div class="w-full mb-4">
            <div class="flex flex-wrap items-start justify-between">
              <div class="flex flex-wrap gap-2">
                <h3 class="font-normal">প্রশ্নঃ</h3>
                <MathJax :content="currentQuestion.text" />
              </div>

              <span class="px-4 py-1 bg-indigo-100 text-primary rounded-full text-sm font-medium">
                {{ currentQuestion.mark }} পয়েন্ট
              </span>
            </div>
          </div>

          <!-- Options -->
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li v-for="(choice, index) in currentQuestion.options" :key="choice.id">
              <button
                class="w-full text-left p-4 rounded-xl border transition focus:outline-none flex items-center justify-between"
                :class="choiceClass(index)"
                @click="select(index)"
              >
                <div class="flex items-center gap-2 truncate">
                  <span class="font-semibold">{{ choice.label }}.</span>
                  <MathJax :content="choice.content" />
                </div>
                <svg
                  v-if="selectedIndex === index"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-green-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
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

              <BaseButton v-else @click="submit" :loading="quizStore.loading" :disabled="!answered">
                Submit
              </BaseButton>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
