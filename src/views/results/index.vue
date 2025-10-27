<script setup>
import Default from '@/layouts/Default.vue'
import { useResultStore } from '@/stores/result'
import { onMounted, ref } from 'vue'

const resultStore = useResultStore()
const results = ref([])

const loadResults = async (page = 1) => {
  const response = await resultStore.all(page)
  results.value = response.data
}

onMounted(() => {
  loadResults()
})
</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Results</h3>
      </div>
      <div class="card__body">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Total Attempts</th>
              <th>Average Score</th>
              <th>Average Time</th>
              <th>Quiz Title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(result, index) in results">
              <td>{{ index + 1 }}</td>
              <td>{{ result.total_attempts }}</td>
              <td>{{ result.average_score }}</td>
              <td>{{ result.average_time_formatted }}</td>
              <td>{{ result.quiz.title }}</td>
              <td>
                <RouterLink
                  :to="{ name: 'quiz.results', params: { id: result.quiz?.id } }"
                  class="badge badge__primary"
                  >Details</RouterLink
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Default>
</template>

<style scoped></style>
