<script setup>
import BaseButton from '@/components/BaseButton.vue'
import Default from '@/layouts/Default.vue'
import { useQuizStore } from '@/stores/quiz'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const quizStore = useQuizStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const quiz = ref({
  questions: [], // initialize as empty array to avoid undefined access
})

// Load quiz data
const loadQuiz = async () => {
  const { data } = await quizStore.show(route.params.id)
  quiz.value = data
}

// Update option text
const updateChoice = (questionId, optionId, value) => {
  const question = quiz.value.questions.find((q) => q.id === questionId)
  if (!question) return
  const option = question.options.find((o) => o.id === optionId)
  if (!option) return
  option.content = value
}

// Remove option
const removeChoice = (questionId, optionId) => {
  const question = quiz.value.questions.find((q) => q.id === questionId)
  if (!question) return
  question.options = question.options.filter((o) => o.id !== optionId)
}

// ✅ Add new question
const addQuestion = () => {
  const newQuestionId = Date.now()

  const newQuestion = {
    id: newQuestionId,
    quiz_id: quiz.value.id,
    content: '',
    mode: 'default',
    type: 'multiple_choice',
    points: 1,
    explanation: '',
    hasExplanation: false,
    options: [
      { id: newQuestionId + 1, label: 'A', content: '', is_correct: false },
      { id: newQuestionId + 2, label: 'B', content: '', is_correct: false },
    ],
  }

  quiz.value.questions.push(newQuestion)
}

// Submit quiz
const submitQuiz = async () => {
  await quizStore.update(route.params.id, quiz.value, toast)
}

onMounted(() => {
  loadQuiz()
})
</script>

<template>
  <Default>
    <div class="flex items-start justify-between gap-6">
      <div class="grow bg-white rounded-xl p-6">
        <article>
          <div
            v-for="(question, index) in quiz.questions"
            :key="question.id"
            class="border border-border p-4 rounded mb-4"
          >
            <!-- Question Header -->
            <div class="flex items-center justify-between gap-6 mb-4">
              <div class="grow">
                <label class="form__label"> {{ index + 1 }} Question</label>
                <input
                  type="text"
                  v-model="question.content"
                  placeholder="Question title"
                  class="form__control"
                />
              </div>
              <div class="flex-none w-20 text-end">
                <label class="form__label">Point</label>
                <input
                  type="number"
                  v-model.number="question.points"
                  min="1"
                  class="form__control"
                />
              </div>
            </div>

            <!-- Options -->
            <div
              v-for="option in question.options"
              :key="option.id"
              class="flex items-center gap-4 mb-2"
            >
              <input
                type="radio"
                :name="'q' + question.id"
                :checked="option.is_correct"
                @change="quizStore.toggleCorrectAnswer(question.id, option.id)"
                class="form__radio"
              />
              <input
                type="text"
                v-model="option.content"
                @input="updateChoice(question.id, option.id, $event.target.value)"
                class="form__control"
                placeholder="Option text"
              />
              <button @click.prevent="removeChoice(question.id, option.id)">✕</button>
            </div>

            <div class="flex items-center justify-between">
              <div class="form__group">
                <label class="form__label">
                  <input type="checkbox" v-model="question.hasExplanation" />
                  Add Explanation
                </label>
              </div>
              <div class="form__group">
                <select v-model="question.type" class="form__select">
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="">Dropdown</option>
                  <option>Short Answer</option>
                </select>
              </div>
            </div>
            <textarea
              v-if="question.hasExplanation"
              v-model="question.explanation"
              class="form__control mt-2"
              placeholder="Write explanation..."
            ></textarea>
          </div>

          <div class="flex items-center justify-between mt-4">
            <button @click="addQuestion" class="base__outline">+ Add Question</button>
            <BaseButton @click="submitQuiz" :loading="quizStore.loading">Submit</BaseButton>
          </div>
        </article>
      </div>
      <div class="flex-none w-72">dd</div>
    </div>
  </Default>
</template>

<style lscoped></style>
