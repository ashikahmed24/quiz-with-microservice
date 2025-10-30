<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center p-6"
  >
    <!-- Hero Section -->
    <div class="text-center max-w-2xl">
      <h1 class="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
        Test Your Knowledge with <span class="text-primary">Quiz</span>
      </h1>
      <p class="text-gray-600 text-lg md:text-xl mb-8">
        Challenge yourself, compete with friends, and climb the leaderboard!
      </p>
      <RouterLink
        to="/"
        class="inline-block bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary-hover transition duration-300"
      >
        Get Started
      </RouterLink>
    </div>

    <!-- Features Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl w-full">
      <div class="bg-white rounded-2xl p-6 text-center hover:-translate-y-1 transition">
        <div class="text-primary text-4xl mb-3">📚</div>
        <h3 class="text-xl font-semibold mb-2">Learn & Improve</h3>
        <p class="text-gray-500">
          Take quizzes that help you grow your knowledge in fun, interactive ways.
        </p>
      </div>
      <div class="bg-white rounded-2xl p-6 text-center hover:-translate-y-1 transition">
        <div class="text-blue-600 text-4xl mb-3">🏆</div>
        <h3 class="text-xl font-semibold mb-2">Leaderboard</h3>
        <p class="text-gray-500">Compete with others and see how you rank among top scorers.</p>
      </div>
      <div class="bg-white rounded-2xl p-6 text-center hover:-translate-y-1 transition">
        <div class="text-blue-600 text-4xl mb-3">💡</div>
        <h3 class="text-xl font-semibold mb-2">Instant Results</h3>
        <p class="text-gray-500">Get instant feedback and see detailed reports after every quiz.</p>
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-16 text-gray-500 text-sm">
      © {{ new Date().getFullYear() }} Quiz — All rights reserved.
    </footer>
  </div>
</template>

<style scoped></style>
