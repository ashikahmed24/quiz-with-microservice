<script setup>
import Default from '@/layouts/Default.vue'
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const { dashboard } = storeToRefs(appStore)

const loadDashboard = async () => {
  await appStore.getDashboard()
}

onMounted(() => {
  loadDashboard()
})
</script>

<template>
  <Default>
    <section class="bg-white px-4 py-6 rounded-xl">
      <div v-if="dashboard.stats" class="grid md:grid-cols-2 lg:grid-cols-5 items-center gap-4">
        <div class="bg-green-50 rounded-lg p-4 flex-1 relative">
          <div>
            <p>মোট প্রশ্ন তৈরী</p>
            <p class="font-bold text-5xl text-green-600">{{ dashboard.stats?.total_quizzes }}</p>
          </div>
          <span class="absolute bottom-2 right-0 text-4xl opacity-10 text-green-700">
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 384 512"
              class="size-10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"
              ></path>
            </svg>
          </span>
        </div>
        <div class="bg-indigo-50 rounded-lg p-4 relative flex-1">
          <div>
            <p>অনলাইন পরীক্ষা</p>
            <p class="font-bold text-5xl text-indigo-500">{{ dashboard.stats?.total_attempts }}</p>
          </div>
          <span class="absolute bottom-2 right-0 text-4xl opacity-10 text-indigo-700">
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 384 512"
              class="size-10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 64C16 28.7 44.7 0 80 0H304c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H80c-35.3 0-64-28.7-64-64V64zM144 448c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16s-7.2-16-16-16H160c-8.8 0-16 7.2-16 16zM304 64H80V384H304V64z"
              ></path>
            </svg>
          </span>
        </div>
        <div class="bg-yellow-50 rounded-lg p-4 flex-1 relative">
          <div>
            <p>গড় স্কোর</p>
            <p class="font-bold text-5xl text-yellow-500">{{ dashboard.stats?.average_score }}</p>
          </div>
          <span class="absolute bottom-2 right-1 text-4xl opacity-10 text-yellow-700">
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 512 512"
              class="size-10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M139.61 35.5a12 12 0 0 0-17 0L58.93 98.81l-22.7-22.12a12 12 0 0 0-17 0L3.53 92.41a12 12 0 0 0 0 17l47.59 47.4a12.78 12.78 0 0 0 17.61 0l15.59-15.62L156.52 69a12.09 12.09 0 0 0 .09-17zm0 159.19a12 12 0 0 0-17 0l-63.68 63.72-22.7-22.1a12 12 0 0 0-17 0L3.53 252a12 12 0 0 0 0 17L51 316.5a12.77 12.77 0 0 0 17.6 0l15.7-15.69 72.2-72.22a12 12 0 0 0 .09-16.9zM64 368c-26.49 0-48.59 21.5-48.59 48S37.53 464 64 464a48 48 0 0 0 0-96zm432 16H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"
              ></path>
            </svg>
          </span>
        </div>
        <div class="bg-blue-50 rounded-lg p-4 flex-1 relative">
          <div>
            <p>মোট পয়েন্ট</p>
            <p class="font-bold text-5xl text-blue-500">{{ dashboard.stats?.total_points }}</p>
          </div>
          <span class="absolute bottom-2 right-1 text-4xl opacity-20 text-blue-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-10"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
              />
            </svg>
          </span>
        </div>
        <div class="bg-teal-50 rounded-lg p-4 flex-1 relative">
          <div>
            <p>শিক্ষার্থী</p>
            <p class="font-bold text-5xl text-teal-500">{{ dashboard.stats?.total_users }}</p>
          </div>
          <span class="absolute bottom-2 right-1 text-4xl opacity-20 text-teal-700">
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 640 512"
              class="size-10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z"
              ></path>
            </svg>
          </span>
        </div>
      </div>
    </section>

    <section class="space-y-6">
      <div class="bg-white p-5 rounded-xl">
        <h2 class="text-xl font-semibold mb-4">সাম্প্রতিক পরীক্ষা</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-gray-600">Quiz Title</th>
                <th class="px-4 py-2 text-left text-gray-600">User</th>
                <th class="px-4 py-2 text-left text-gray-600">Score</th>
                <th class="px-4 py-2 text-left text-gray-600">Correct</th>
                <th class="px-4 py-2 text-left text-gray-600">Wrong</th>
                <th class="px-4 py-2 text-left text-gray-600">Duration</th>
                <th class="px-4 py-2 text-left text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="attempt in dashboard.recent_quizzes" :key="attempt.id">
                <td class="px-4 py-2">{{ attempt.quiz?.title }}</td>
                <td class="px-4 py-2">
                  <div class="flex items-center">
                    <div class="bg-gray-200 size-10 p-2 rounded-full text-center">A</div>
                    <div class="ml-2">
                      <h4 class="font-semibold">{{ attempt.user?.name }}</h4>
                      <span class="font-normal">{{ attempt.user?.phone }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-2">{{ attempt.score }}</td>
                <td class="px-4 py-2">{{ attempt.correct }}</td>
                <td class="px-4 py-2">{{ attempt.wrong }}</td>
                <td class="px-4 py-2">{{ attempt.duration_formatted }}</td>
                <td class="px-4 py-2">
                  <span
                    :class="{
                      'text-green-600 font-semibold': attempt.status === 'completed',
                      'text-yellow-500 font-semibold': attempt.status === 'pending',
                    }"
                  >
                    {{ attempt.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </Default>
</template>

<style scoped></style>
