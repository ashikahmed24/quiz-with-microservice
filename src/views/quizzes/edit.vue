<script setup>
import BaseButton from '@/components/BaseButton.vue'
import Default from '@/layouts/Default.vue'
import { useQuizStore } from '@/stores/quiz'
import { useQuestionStore } from '@/stores/question'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import IconX from '@/components/icons/IconX.vue'

const quizStore = useQuizStore()
const questionStore = useQuestionStore()
const route = useRoute()
const toast = useToast()

const quiz = ref(null)
const questions = ref([])

const loadQuiz = async () => {
  const response = await quizStore.show(route.params.id)
  quiz.value = response.data
}

const loadQuestions = async () => {
  const response = await questionStore.questions(route.params.id)
  questions.value = response.data
}

// Add a new choice to a question (for MCQ)
const addChoice = (questionId) => {
  const question = questions.value.find((q) => q.id === questionId)
  if (!question) return

  question.options.push({
    id: Date.now(),
    content: '',
    is_correct: false,
  })
}

// Update option content
const updateChoice = (questionId, optionId, value) => {
  const q = questions.value.find((q) => q.id === questionId)
  if (!q) return
  const opt = q.options.find((o) => o.id === optionId)
  if (opt) opt.content = value
}

// Remove option
const removeChoice = (questionId, optionId) => {
  const q = questions.value.find((q) => q.id === questionId)
  if (!q) return
  q.options = q.options.filter((o) => o.id !== optionId)
}

// Add a new question
const addQuestion = async () => {
  const newQuestion = {
    content: 'title',
    type: 'mcq',
    mark: 5,
    negative_mark: 1,
    time_limit: 60,
    hasExplanation: false,
    explanation: '',
    options: [
      { content: 'option', is_correct: false },
      { content: 'option', is_correct: true },
      { content: 'option', is_correct: false },
      { content: 'option', is_correct: false },
    ],
  }

  await questionStore.store(route.params.id, newQuestion)
  await loadQuestions()
}

const removeQuestion = async (question) => {
  if (confirm('Are you sure you went to deleted this question?')) {
    await questionStore.delete(route.params.id, question)
  }
}

// Update question type dynamically
const updateQuestionType = (question) => {
  switch (question.type) {
    case 'mcq':
      question.options =
        question.options.length >= 4
          ? question.options
          : [
              { id: Date.now() + 1, content: '', is_correct: false },
              { id: Date.now() + 2, content: '', is_correct: false },
              { id: Date.now() + 3, content: '', is_correct: false },
              { id: Date.now() + 4, content: '', is_correct: false },
            ]
      break
    case 'true_false':
      question.options = [
        { id: Date.now() + 1, content: 'True', is_correct: false },
        { id: Date.now() + 2, content: 'False', is_correct: false },
      ]
      break
    default:
      question.options = [{ id: Date.now() + 1, content: '', is_correct: false }] // short_answer or fill_blank
  }
}

// Submit quiz
const submitQuiz = async () => {
  try {
    await quizStore.updateQuestions(route.params.id, questions.value)
    toast.success('Quiz updated successfully')
  } catch (err) {
    toast.error('Failed to submit quiz')
  }
}

onMounted(() => {
  loadQuiz()
  loadQuestions()
})
</script>

<template>
  <Default>
    <div class="flex items-start justify-between gap-6">
      <!-- Main Quiz Editor -->
      <div class="grow bg-white rounded-xl p-6">
        <header
          v-if="quiz"
          class="bg-white flex items-center justify-between border-b border-border py-2 mb-6"
        >
          <div>
            <h1 class="text-2xl font-semibold text-gray-800 mb-1">{{ quiz.title }}</h1>
            <p class="text-gray-500 text-sm">{{ quiz.description }}</p>
          </div>
          <div class="flex-none text-gray-600 text-sm">
            <div class="flex items-center gap-4">
              <div><span class="font-medium">Total Marks:</span> {{ quiz.total_marks }}</div>
              <div><span class="font-medium">Passing Marks:</span> {{ quiz.passing_marks }}</div>
            </div>
            <div class="flex items-center gap-4">
              <div><span class="font-medium">Time:</span> {{ quiz.time_limit }} min</div>
              <div><span class="font-medium">Shuffle:</span> {{ quiz.shuffle ? 'Yes' : 'No' }}</div>
              <div>
                <span class="font-medium">Active:</span> {{ quiz.is_active ? 'Yes' : 'No' }}
              </div>
            </div>
          </div>
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
                    {{ index + 1 }} Question: {{ question.content }}</label
                  >
                  <input
                    type="text"
                    v-model="question.content"
                    placeholder="Question title"
                    class="form__control"
                  />
                </div>
              </div>

              <div class="flex gap-2 items-center">
                <!-- Question Type Selector -->
                <div class="">
                  <label class="form__label">Question Type</label>
                  <select
                    v-model="question.type"
                    class="form__control"
                    @change="updateQuestionType(question)"
                  >
                    <option value="mcq">Multiple Choice</option>
                    <option value="true_false">True / False</option>
                    <option value="short_answer">Short Answer</option>
                    <option value="fill_blank">Fill Blank</option>
                  </select>
                </div>

                <!-- Points -->
                <div class="w-20">
                  <label class="form__label">Mark</label>
                  <input
                    type="number"
                    v-model.number="question.mark"
                    min="1"
                    class="form__control"
                  />
                </div>
                <button
                  @click.prevent="removeQuestion(question.id)"
                  class="bg-gray-100 text-danger px-4 py-2 rounded cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>

            <!-- Options (hidden for short_answer & fill_blank) -->
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
                  @change="quizStore.toggleCorrectAnswer(question.id, option.id)"
                  class="form__radio"
                />
                <input
                  type="text"
                  v-model="option.content"
                  @input="updateChoice(question.id, option.id, $event.target.value)"
                  class="form__control"
                  :placeholder="
                    question.type === 'mcq'
                      ? 'Option ' + String.fromCharCode(65 + oIndex)
                      : option.content
                  "
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

            <!-- Add Choice & Explanation -->
            <div class="flex items-center justify-between mt-2">
              <label class="form__label flex items-center gap-2">
                <input type="checkbox" v-model="question.hasExplanation" />
                Add Explanation
              </label>
              <button
                v-if="question.type === 'mcq'"
                @click.prevent="addChoice(question.id)"
                class="px-3 py-1.5 bg-primary text-white text-sm rounded hover:bg-primary-hover focus:outline-none cursor-pointer"
              >
                Add Choice
              </button>
            </div>

            <textarea
              v-if="question.hasExplanation"
              v-model="question.explanation"
              class="form__control mt-2"
              placeholder="Write explanation..."
            ></textarea>
          </div>

          <!-- Add Question / Submit -->
          <div class="flex items-center justify-between mt-4">
            <div class="flex gap-2">
              <button @click="addQuestion()" class="base__outline">Add Question</button>
            </div>
            <BaseButton @click="submitQuiz" :loading="quizStore.loading">Submit</BaseButton>
          </div>
        </article>
      </div>

      <div class="flex-none w-72">
        <div class="flex-none w-72">
          <div class="card">
            <div class="card__header">
              <h3 class="card__title">Question Settings</h3>
              <RouterLink :to="{ name: 'quiz.view', params: { code: quiz.code } }" target="_blank">
                Public
              </RouterLink>
            </div>
            <div class="card__body">
              <!-- Pagination -->
              <div class="form__group">
                <label class="form__label font-medium text-gray-700 mb-2 block">Pagination</label>
                <div class="flex flex-col gap-2">
                  <label class="inline-flex items-center">
                    <input
                      type="radio"
                      name="pagination"
                      value="all"
                      class="form-radio h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span class="ml-2 text-gray-700">Show all the test questions on one page</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input
                      type="radio"
                      name="pagination"
                      value="one"
                      class="form-radio h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span class="ml-2 text-gray-700">Show one item per page</span>
                  </label>
                </div>
              </div>
              <!-- Other Settings -->
              <div class="form__group mt-4">
                <label class="form__label font-medium text-gray-700 mb-2 block"
                  >Other Settings</label
                >
                <div class="flex flex-col gap-2">
                  <label class="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="shuffle_questions"
                      class="form-checkbox h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span class="ml-2 text-gray-700"
                      >Randomize the order of the questions during the test</span
                    >
                  </label>
                  <label class="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="allow_blank"
                      class="form-checkbox h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span class="ml-2 text-gray-700"
                      >Allow students to submit blank/empty answers</span
                    >
                  </label>
                  <label class="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="negative_marking"
                      class="form-checkbox h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span class="ml-2 text-gray-700"
                      >Penalize incorrect answers (negative marking)</span
                    >
                  </label>
                </div>
              </div>
              <!-- Notifications -->
              <div class="form__group">
                <label class="form__label font-medium text-gray-700 mb-2 block"
                  >Do you want to receive an email whenever someone finishes this test?</label
                >
                <div class="flex flex-col gap-2">
                  <label class="inline-flex items-center">
                    <input
                      type="radio"
                      name="pagination"
                      value="all"
                      class="form-radio h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span class="ml-2 text-gray-700">Yes, and send them to:</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input
                      type="radio"
                      name="pagination"
                      value="one"
                      class="form-radio h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span class="ml-2 text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Default>
</template>

<style scoped>
/* Optional: Add custom styling if needed */
</style>
