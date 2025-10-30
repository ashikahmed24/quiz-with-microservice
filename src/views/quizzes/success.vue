<script setup>
import MathJax from '@/components/MathJax.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const data = ref({})

// Parse data from query
if (route.query.data) {
  try {
    data.value = JSON.parse(route.query.data)
  } catch {
    data.value = {}
  }
}
</script>

<template>
  <main class="min-h-screen bg-indigo-50 px-4 py-6">
    <div class="max-w-3xl mx-auto bg-white rounded-xl px-4 py-6">
      <header class="p-6">
        <div class="text-center space-y-4">
          <div
            class="inline-block bg-green-100 text-green-800 text-sm font-medium px-4 py-1 rounded-full tracking-wide animate-bounce print:animate-none print:bg-gray-200"
          >
            কুইজ সম্পন্ন হয়েছে
          </div>

          <h4 class="text-3xl md:text-5xl font-extrabold leading-tight">
            অভিনন্দন! আপনি কুইজটি সম্পন্ন করেছেন
          </h4>

          <!-- Stats Section -->
          <div
            class="flex flex-wrap justify-center gap-4 mt-6 print:flex-col print:items-start print:gap-2"
          >
            <!-- Total Questions -->
            <button
              class="bg-green-50 text-green-800 px-4 py-2 rounded-xl flex items-center gap-2 transition"
            >
              <span class="text-sm font-medium">মোট প্রশ্ন</span>
              <strong class="text-sm">{{ data.correct + data.wrong }}</strong>
            </button>

            <!-- Correct Answers -->
            <button
              class="bg-blue-50 text-blue-800 px-4 py-2 rounded-xl flex items-center gap-2 transition"
            >
              <span class="text-sm font-medium">সঠিক উত্তর</span>
              <strong class="text-sm">{{ data.correct }}</strong>
            </button>

            <!-- Wrong Answers -->
            <button
              class="bg-red-50 text-red-800 px-4 py-2 rounded-xl flex items-center gap-2 transition"
            >
              <span class="text-sm font-medium">ভুল উত্তর</span>
              <strong class="text-sm">{{ data.wrong }}</strong>
            </button>

            <!-- Duration -->
            <button
              class="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-xl flex items-center gap-2 transition"
            >
              <span class="text-sm font-medium">সময়</span>
              <strong class="text-sm">{{ data.duration_formatted }}</strong>
            </button>

            <!-- Score -->
            <button
              class="bg-purple-50 text-purple-800 px-4 py-2 rounded-xl flex items-center gap-2 transition"
            >
              <span class="text-sm font-medium">স্কোর</span>
              <strong class="text-sm">{{ data.score }}</strong>
            </button>
          </div>
        </div>
      </header>

      <div class="space-y-4">
        <div
          v-for="answer in data.answers || []"
          :key="answer.id"
          class="bg-white p-5 rounded-xl border border-border"
        >
          <div class="flex flex-col md:flex-row justify-between gap-4">
            <!-- QA -->
            <div class="flex-1 space-y-2">
              <div class="flex flex-wrap items-start gap-2">
                <span class="font-semibold">Question:</span>
                <RenderMath :content="answer.question.content" />
              </div>
              <div class="flex flex-wrap items-start gap-2">
                <span class="font-semibold">Answer:</span>
                <RenderMath
                  :content="answer.option?.content || answer.text_answer || 'No answer'"
                />
              </div>
              <div v-if="answer.question.explanation" class="flex flex-wrap items-start gap-2">
                <span class="font-semibold">Explanation:</span>
                <RenderMath :content="answer.question.explanation" />
              </div>
            </div>

            <!-- Status -->
            <div class="text-sm flex-none flex md:flex-col items-end justify-between gap-2">
              <span
                :class="
                  answer.is_correct ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'
                "
              >
                {{ answer.is_correct ? 'Correct' : 'Wrong' }}
              </span>
              <span
                :class="
                  answer.is_correct ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'
                "
                >Marks: {{ answer.marks_obtained }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5%);
  }
}
.animate-bounce {
  animation: bounce 1s infinite;
}
</style>
