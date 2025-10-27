<script setup>
import Default from '@/layouts/Default.vue'
import { ref, onMounted } from 'vue'
import { useQuizStore } from '@/stores/quiz'
import IconEllipsis from '@/components/icons/IconEllipsis.vue'

const quizStore = useQuizStore()

const quizzes = ref([])

const loadQuizzes = async (page = 1) => {
  const { data } = await quizStore.all(page)
  quizzes.value = data
}

onMounted(() => {
  loadQuizzes()
})
</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Quizzes</h3>
        <div class="flex items-center gap-2">
          <input type="text" placeholder="Search keywords..." class="form__control w-64" />
          <RouterLink :to="{ name: 'quizzes.create' }" class="base__button">Add Quiz</RouterLink>
        </div>
      </div>
      <div class="card__body">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="quiz in quizzes.data"
            :key="quiz.id"
            class="border border-gray-200 rounded-lg p-4 transition relative"
          >
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-gray-800 mb-2">
                {{ quiz.title }}
              </h3>

              <RouterLink :to="{ name: 'quizzes.edit', params: { id: quiz.id } }">
                <IconEllipsis class="size-5 text-gray-500" />
              </RouterLink>
            </div>

            <p class="text-sm text-gray-500 mb-2">
              {{ quiz.description }}
            </p>

            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-500">{{ quiz.total_marks }} পয়েন্ট</span>
              <span>•</span>
              <span class="text-sm text-gray-500">সময়সীমা {{ quiz.time_limit }} মিনিট</span>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center items-center mt-8 gap-2">
          <Pagination
            :total-items="quizzes?.meta?.total ?? 0"
            :current-page="quizzes?.meta?.current_page ?? 1"
            :items-per-page="quizzes?.meta?.per_page ?? 10"
            :pages-to-show="1"
            @page-change="loadQuizzes"
            visible-always
          />
        </div>
      </div>
    </div>
  </Default>
</template>

<style scoped></style>
