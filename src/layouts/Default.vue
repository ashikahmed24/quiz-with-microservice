<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import IconHome from '@/components/icons/IconHome.vue'
import IconPower from '@/components/icons/IconPower.vue'
import IconQuestion from '@/components/icons/IconQuestion.vue'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<template>
  <div class="h-screen">
    <!-- Sidebar -->
    <aside class="w-60 hidden md:flex flex-col fixed top-0 left-0 bottom-0 z-30 bg-white">
      <div class="bg-white flex items-center gap-2 px-2 py-3">
        <img src="/logo.png" alt="logo" class="h-10 w-auto" />
      </div>

      <nav class="bg-white flex-1 overflow-y-auto scrollbar px-2 py-4 space-y-2">
        <RouterLink :to="{ name: 'home' }" active-class="active" class="nav__item">
          <IconHome class="size-5" />
          <span class="ml-3">Dashboard</span>
        </RouterLink>

        <RouterLink :to="{ name: 'quizzes' }" active-class="active" class="nav__item">
          <IconQuestion class="size-5" />
          <span class="ml-2">Quizzes</span>
        </RouterLink>

        <RouterLink :to="{ name: 'results' }" active-class="active" class="nav__item">
          <IconHome class="size-5" />
          <span class="ml-2">Results</span>
        </RouterLink>

        <RouterLink :to="{ name: 'leaderboards' }" active-class="active" class="nav__item">
          <IconHome class="size-5" />
          <span class="ml-2">Leaderboards</span>
        </RouterLink>

        <button type="button" @click="cacheClear()" active-class="active" class="nav__item w-full">
          <IconHome class="size-5" />
          <span class="ml-2">Cache Clear</span>
        </button>
        <button type="button" @click="logout" class="nav__item w-full">
          <IconPower class="size-5" />
          <span class="ml-2">Logout</span>
        </button>
      </nav>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col md:ml-60">
      <!-- Header -->
      <header class="bg-white sticky top-0 z-30 px-4 py-3 flex items-center">
        <div class="flex-grow">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <button
                type="button"
                class="bg-gray-100 p-2 rounded-full cursor-pointer hover:opacity-70 transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"
                  />
                </svg>
              </button>
              <input type="search" class="form__control max-w-md" placeholder="Enter keywords..." />
            </div>

            <div class="flex-none">
              <button type="button" class="flex items-center gap-2 cursor-pointer">
                <img :src="user.avatar_url" :alt="user.name" class="w-8 h-8 rounded-full" />
                <div class="text-left">
                  <p class="text-sm font-semibold">{{ user.name }}</p>
                  <p class="text-xs lowercase">{{ user.email }}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main -->
      <main class="space-y-4 m-4 rounded-xl flex-1">
        <div v-if="loading" class="bg-white h-dvh rounded-xl text-center py-10">
          <img src="/loader.gif" alt="Loading..." class="mx-auto w-48 h-48" />
        </div>
        <slot v-else />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
