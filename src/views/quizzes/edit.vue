<script setup>
import BaseButton from '@/components/BaseButton.vue'
import Default from '@/layouts/Default.vue'
import { useQuizStore } from '@/stores/quiz'
import { useQuestionStore } from '@/stores/question'
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import IconX from '@/components/icons/IconX.vue'
import { debounce } from 'lodash'
import IconLoading from '@/components/icons/IconLoading.vue'
import MathJax from '@/components/MathJax.vue'

const quizStore = useQuizStore()
const questionStore = useQuestionStore()
const route = useRoute()

const form = reactive({
  code: '',
  title: '',
  description: '',
  total_marks: 0,
  passing_marks: 0,
  time_limit: 0,
  start_time: '',
  end_time: '',
  is_active: false,
  shuffle: false,
  allow_blank: false,
  negative_marking: false,
  email_notify: false,
})

const quizUpdate = async () => {
  await quizStore.update(route.params.id, form)
}

const quiz = ref(null)
const questions = ref([])
const message = ref(null)

// Load quiz
const loadQuiz = async () => {
  const response = await quizStore.show(route.params.id)
  quiz.value = response.data
  Object.assign(form, {
    code: response.data.code,
    title: response.data.title,
    description: response.data.description,
    total_marks: response.data.total_marks,
    passing_marks: response.data.passing_marks,
    time_limit: response.data.time_limit,
    start_time: response.data.start_time,
    end_time: response.data.end_time,
    is_active: !!response.data.is_active,
    shuffle: !!response.data.shuffle,
    allow_blank: !!response.data.allow_blank,
    negative_marking: !!response.data.negative_marking,
    email_notify: !!response.data.email_notify,
  })
}

// Load questions
const loadQuestions = async () => {
  const response = await questionStore.all(route.params.id)
  questions.value = response.data
}

// Auto-save with debounce
const autoSave = debounce(async (question) => {
  try {
    await questionStore.update(route.params.id, question)
    message.value = 'Question auto-saved!'
  } catch {
    message.value = 'Auto-save failed'
  }
}, 1000)

// Add this function here
const toggleCorrectAnswer = (questionId, optionId) => {
  const q = questions.value.find((q) => q.id === questionId)
  if (!q) return
  q.options.forEach((opt) => (opt.is_correct = opt.id === optionId))
  autoSave(q)
}

// Add new option
const addChoice = (questionId) => {
  const q = questions.value.find((q) => q.id === questionId)
  if (!q) return
  q.options.push({ id: crypto.randomUUID(), content: '', is_correct: false })
  autoSave(q)
}

// Update option
const updateChoice = (questionId, optionId, value) => {
  const q = questions.value.find((q) => q.id === questionId)
  if (!q) return
  const opt = q.options.find((o) => o.id === optionId)
  if (opt) opt.content = value
  autoSave(q)
}

// Remove option
const removeChoice = (questionId, optionId) => {
  const q = questions.value.find((q) => q.id === questionId)
  if (!q) return
  q.options = q.options.filter((o) => o.id !== optionId)
  autoSave(q)
}

// Add new question
const addQuestion = async () => {
  const newQuestion = {
    content: 'New Question',
    type: 'mcq',
    mark: 2,
    negative_mark: 1,
    time_limit: 60,
    hasExplanation: false,
    explanation: '',
    options: [
      { id: crypto.randomUUID(), content: 'Option A', is_correct: false },
      { id: crypto.randomUUID(), content: 'Option B', is_correct: true },
      { id: crypto.randomUUID(), content: 'Option C', is_correct: false },
      { id: crypto.randomUUID(), content: 'Option D', is_correct: false },
    ],
  }

  await questionStore.store(route.params.id, newQuestion)
  await loadQuestions()
  message.value = 'Question added!'
}

// Change question type
const updateQuestionType = (question) => {
  switch (question.type) {
    case 'mcq':
      if (!question.options || question.options.length < 4) {
        question.options = Array.from({ length: 4 }, (_, i) => ({
          id: crypto.randomUUID(),
          content: '',
          is_correct: false,
        }))
      }
      break
    case 'true_false':
      question.options = [
        { id: crypto.randomUUID(), content: 'True', is_correct: false },
        { id: crypto.randomUUID(), content: 'False', is_correct: false },
      ]
      break
    default:
      question.options = [{ id: crypto.randomUUID(), content: '', is_correct: false }]
  }
  autoSave(question)
}

// Submit quiz
const submitQuiz = async () => {
  try {
    await quizStore.update(route.params.id, { ...form, id: quiz.value.id })
    message.value = 'Quiz updated!'
  } catch {
    message.value = 'Failed to update quiz'
  }
}

onMounted(() => {
  loadQuiz()
  loadQuestions()
})
</script>

<template>
  <Default>
    <div
      class="max-w-3xl flex items-center justify-center gap-2 mt-1 ml-2 text-xs text-gray-500 transition-all duration-300"
    >
      <!-- Loading Spinner -->
      <div v-if="questionStore.loading" class="flex items-center gap-2 animate-pulse">
        <IconLoading class="size-4" />
        <span>Saving changes...</span>
      </div>

      <!-- Saved Message -->
      <transition name="fade">
        <div
          v-if="!questionStore.loading && message"
          class="flex items-center gap-1 text-green-600 font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-4 h-4 text-green-500"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>{{ message }}</span>
        </div>
      </transition>
    </div>

    <div class="flex items-start justify-between gap-6">
      <!-- Main Editor -->
      <div class="grow bg-white rounded-xl p-6">
        <header
          v-if="quiz"
          class="bg-white flex items-center justify-between border-b border-border py-2 mb-6"
        >
          <div>
            <h1 class="text-2xl font-semibold text-gray-800 mb-1">
              {{ quiz.title }}
            </h1>
            <p class="text-gray-500 text-sm">{{ quiz.description }}</p>
          </div>
          <span v-if="quiz.published" class="badge badge__success">Published</span>
          <span v-else class="badge badge__danger">Unpublished</span>
        </header>

        <article>
          <div
            v-for="(question, index) in questions"
            :key="question.id"
            class="border border-border p-4 rounded mb-4"
          >
            <!-- Question Header -->
            <div class="flex items-end justify-between gap-4 mb-4">
              <div class="grow">
                <div class="form__group">
                  <label class="form__label">
                    {{ index + 1 }}. Question: {{ question.content }}</label
                  >
                  <input
                    type="text"
                    v-model="question.content"
                    @input="autoSave(question)"
                    placeholder="Write question..."
                    class="form__control"
                  />
                </div>
              </div>

              <div class="flex gap-2 items-center">
                <!-- Type -->
                <div class="form__group">
                  <label class="form__label">Type</label>
                  <select
                    v-model="question.type"
                    @change="updateQuestionType(question)"
                    class="form__control"
                  >
                    <option value="mcq">Multiple Choice</option>
                    <option value="true_false">True / False</option>
                    <option value="short_answer">Short Answer</option>
                    <option value="fill_blank">Fill Blank</option>
                  </select>
                </div>

                <!-- Marks -->
                <div class="form__group w-20">
                  <label class="form__label">Mark</label>
                  <input
                    type="number"
                    v-model.number="question.mark"
                    min="1"
                    class="form__control"
                    @input="autoSave(question)"
                  />
                </div>
              </div>
            </div>

            <!-- Options -->
            <div v-if="question.options.length">
              <div
                v-for="(option, oIndex) in question.options"
                :key="option.id"
                class="flex items-center gap-4 mb-2"
              >
                <input
                  v-if="question.type === 'mcq' || question.type === 'true_false'"
                  type="radio"
                  :name="'q' + question.id"
                  :checked="option.is_correct"
                  @change="toggleCorrectAnswer(question.id, option.id)"
                  class="form__radio"
                />
                <input
                  type="text"
                  v-model="option.content"
                  @input="updateChoice(question.id, option.id, $event.target.value)"
                  class="form__control"
                  :placeholder="`Option ${String.fromCharCode(65 + oIndex)}`"
                />
                <button
                  v-if="question.type === 'mcq'"
                  @click.prevent="removeChoice(question.id, option.id)"
                  class="bg-gray-100 text-danger p-2.5 rounded cursor-pointer"
                >
                  <IconX class="size-4" />
                </button>
              </div>
            </div>

            <!-- Explanation -->
            <div class="flex items-center justify-between mt-2">
              <label class="form__label flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="question.hasExplanation"
                  @change="autoSave(question)"
                />
                Add Explanation
              </label>
              <button
                v-if="question.type === 'mcq'"
                @click.prevent="addChoice(question.id)"
                class="px-3 py-1.5 bg-primary text-white text-sm rounded hover:bg-primary-hover cursor-pointer"
              >
                Add Choice
              </button>
            </div>

            <textarea
              v-if="question.hasExplanation"
              v-model="question.explanation"
              @input="autoSave(question)"
              class="form__control mt-2"
              placeholder="Write explanation..."
            ></textarea>
          </div>

          <!-- Add Question / Submit -->
          <div class="flex items-center justify-between mt-4">
            <button @click="addQuestion" class="base__outline">Add Question</button>
            <BaseButton @click="submitQuiz" :loading="questionStore.loading">Submit</BaseButton>
          </div>
        </article>
      </div>
      <div class="flex-none w-72">
        <div class="card bg-white rounded-xl border border-border">
          <!-- Header -->
          <div
            class="card__header flex items-center justify-between px-4 py-3 border-b border-gray-100"
          >
            <h3 class="text-lg font-semibold text-gray-800">Quiz Settings</h3>
            <RouterLink
              v-if="quiz && quiz.code"
              :to="{ name: 'quiz.view', params: { code: quiz.code } }"
              target="_blank"
              class="text-sm text-primary hover:underline"
            >
              Public View
            </RouterLink>
          </div>

          <!-- Body -->
          <div class="card__body p-4 space-y-5 text-sm text-gray-700">
            <form @submit.prevent="quizUpdate">
              <div class="form__group">
                <label class="form__label">Title</label>
                <input type="text" v-model="form.title" class="form__control" />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div class="form__group">
                  <label class="form__label">Code</label>
                  <input type="text" v-model="form.code" class="form__control" />
                </div>
                <div class="form__group">
                  <label class="form__label">Total Marks</label>
                  <input type="text" v-model="form.total_marks" class="form__control" />
                </div>
                <div class="form__group">
                  <label class="form__label">Passing Marks</label>
                  <input type="text" v-model="form.passing_marks" class="form__control" />
                </div>
                <div class="form__group">
                  <label class="form__label">Time Limit</label>
                  <input type="text" v-model="form.time_limit" class="form__control" />
                </div>
              </div>
              <div class="form__group">
                <label class="form__label">Start Time</label>
                <input type="datetime-local" v-model="form.start_time" class="form__control" />
              </div>
              <div class="form__group">
                <label class="form__label">End Time</label>
                <input type="datetime-local" v-model="form.end_time" class="form__control" />
              </div>
              <div class="form__group">
                <label class="form__label">Published</label>
                <select class="form__select w-full" v-model="form.published">
                  <option :value="true">Yes</option>
                  <option :value="false">No</option>
                </select>
              </div>

              <div class="divide-y divide-border space-y-2">
                <!-- Settings -->
                <div class="py-4 space-y-3">
                  <h4 class="text-sm font-semibold text-gray-800 mb-2">Options</h4>

                  <label class="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="form.shuffle"
                      class="form-checkbox h-4 w-4 text-blue-600 border-gray-300"
                    />
                    Randomize the order of the questions during the test
                  </label>

                  <label class="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="form.allow_blank"
                      class="form-checkbox h-4 w-4 text-blue-600 border-gray-300"
                    />
                    Allow students to submit blank/empty answers
                  </label>

                  <label class="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="form.negative_marking"
                      class="form-checkbox h-4 w-4 text-blue-600 border-gray-300"
                    />
                    Penalize incorrect answers (negative marking)
                  </label>
                </div>

                <!-- Notifications -->
                <div class="py-4">
                  <h4 class="text-sm font-semibold text-gray-800 mb-2">Notifications</h4>
                  <p class="text-gray-600 text-sm mb-2">
                    Do you want to receive an email whenever someone finishes this test?
                  </p>
                  <div class="flex flex-col gap-2">
                    <label class="inline-flex items-center">
                      <input
                        type="radio"
                        name="email_notify"
                        :value="true"
                        v-model="form.email_notify"
                        class="form-radio h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <span class="ml-2 text-gray-700">Yes, send notification email</span>
                    </label>
                    <label class="inline-flex items-center">
                      <input
                        type="radio"
                        name="email_notify"
                        :value="false"
                        v-model="form.email_notify"
                        class="form-radio h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <span class="ml-2 text-gray-700">No, don’t send notifications</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="my-6">
                <BaseButton :loading="quizStore.loading" class="w-full">Update</BaseButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Default>
</template>
