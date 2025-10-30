<script setup>
import Default from '@/layouts/Default.vue'
import { onMounted, ref } from 'vue'
import { useQuizStore } from '@/stores/quiz'
import { useRoute } from 'vue-router'
import formatDateTime from '@/utils/formatDateTime.js'

const quizStore = useQuizStore()
const route = useRoute()

const result = ref(null)
const leaderboards = ref(null)
const participants = ref(null)

const loadQuizResult = async () => {
  const response = await quizStore.results(route.params.id)
  result.value = response.data
}

const loadLeaderboards = async () => {
  const response = await quizStore.leaderboards(route.params.id)
  leaderboards.value = response.data
}

const loadParticipants = async () => {
  const response = await quizStore.participants(route.params.id)
  participants.value = response.data
}

onMounted(() => {
  loadQuizResult()
  loadLeaderboards()
  loadParticipants()
})
</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <div>
          <h3 class="card__title">Quiz Overview</h3>
          <p class="text-sm text-gray-500">
            Quick summary and participants for
            <span class="font-medium text-gray-700">{{ result?.quiz?.title }}</span>
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
          >
            Publish Results
          </button>
          <button
            class="ml-2 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover"
          >
            Export CSV
          </button>
        </div>
      </div>
      <div v-if="result?.quiz" class="card__body space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="col-span-2 bg-white rounded-2xl p-6 border border-border">
            <div class="flex items-start gap-5">
              <div class="flex-shrink-0">
                <div
                  class="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold"
                >
                  QZ
                </div>
              </div>
              <div class="flex-1">
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">{{ result.quiz.title }}</h3>
                    <p class="text-sm text-gray-500 mt-1">
                      Quiz Code:
                      <span class="font-medium text-gray-700">{{ result.quiz.code }}</span>
                    </p>
                  </div>
                  <div class="text-right">
                    <span v-if="result.quiz.published" class="badge badge__success">Published</span>
                    <span v-else class="badge badge__success">Unpublished</span>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-3 mt-4">
                  <div class="p-3 bg-gray-50 rounded-lg">
                    <div class="text-xs text-gray-500">Total Attempts</div>
                    <div class="mt-1 text-xl font-semibold text-gray-900">
                      {{ result.summary?.total_attempts }}
                    </div>
                  </div>
                  <div class="p-3 bg-gray-50 rounded-lg">
                    <div class="text-xs text-gray-500">Average Score</div>
                    <div class="mt-1 text-xl font-semibold text-gray-900">
                      {{ result.quiz.total_marks }}/{{ result.summary?.average_score }}
                      <span class="text-sm text-gray-500">pts</span>
                    </div>
                  </div>
                  <div class="p-3 bg-gray-50 rounded-lg">
                    <div class="text-xs text-gray-500">Average Time</div>
                    <div class="mt-1 text-sm text-gray-700 font-medium">
                      {{ result.summary?.average_time_formatted }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-4 border border-border">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              Leaderboards
            </h3>

            <div v-if="leaderboards" class="space-y-3 h-40 overflow-y-auto scrollbar">
              <div
                v-for="player in leaderboards?.leaderboards"
                :key="player.user.id"
                class="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition-colors"
              >
                <!-- Rank Badge -->
                <div class="flex items-center gap-3">
                  <span
                    :class="[
                      'w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm',
                      player.rank === 1
                        ? 'bg-yellow-400 text-white'
                        : player.rank === 2
                          ? 'bg-amber-600 text-white'
                          : player.rank === 3
                            ? 'bg-gray-300 text-gray-800'
                            : 'bg-indigo-100 text-indigo-700',
                    ]"
                  >
                    {{ player.rank }}
                  </span>

                  <!-- User Info -->
                  <div>
                    <div class="font-medium text-gray-900">{{ player.user.name }}</div>
                  </div>
                </div>

                <!-- Score & Duration -->
                <div class="text-right">
                  <div class="text-lg font-semibold text-gray-900">
                    {{ result.quiz.total_marks }}/{{ player.score }}
                    <span class="text-sm text-gray-500">pts</span>
                  </div>
                  <div class="text-sm text-gray-500">{{ player.duration_formatted }}</div>
                </div>
              </div>
            </div>

            <div v-else class="text-center text-gray-500 py-6">No participants yet.</div>
          </div>
        </div>

        <!-- Participants card -->
        <div v-if="participants" class="bg-white rounded-2xl p-6 border border-border">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-semibold text-gray-900">Participants</h4>
            <span class="text-sm">({{ participants.total_participants }}) participants</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Score</th>
                <th>Correct</th>
                <th>Wrong</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in participants.participants" :key="item.id">
                <td>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ item.user?.name }}</div>
                    <div class="text-xs text-gray-500">{{ item.user?.email }}</div>
                  </div>
                </td>
                <td>{{ formatDateTime(item.started_at) }}</td>
                <td>{{ formatDateTime(item.ended_at) }}</td>
                <td>{{ item.score }}</td>
                <td>{{ item.correct }}</td>
                <td>{{ item.wrong }}</td>
                <td>{{ item.duration_formatted }}</td>
                <td>{{ item.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Default>
</template>

<style scoped></style>
