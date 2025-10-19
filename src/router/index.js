import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: '',
  linkExactActiveClass: '',
  routes: [
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('../views/auth/login.vue'),
    },
    {
      path: '/auth/forgot',
      name: 'forgot',
      component: () => import('../views/auth/forgot.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/index.vue'),
    },

    {
      path: '/quizzes',
      name: 'quizzes',
      component: () => import('../views/quizzes/index.vue'),
    },

    {
      path: '/quizzes/:id',
      name: 'quizzes.edit',
      component: () => import('../views/quizzes/edit.vue'),
    },

    {
      path: '/quiz/:code',
      name: 'quiz.view',
      component: () => import('../views/quizzes/view.vue'),
    },

    {
      path: '/quiz/:code/success',
      name: 'quiz.success',
      component: () => import('../views/quizzes/success.vue'),
    },

    {
      path: '/results',
      name: 'results',
      component: () => import('../views/results/index.vue'),
    },

    {
      path: '/leaderboards',
      name: 'leaderboards',
      component: () => import('../views/leaderboards/index.vue'),
    },
  ],
})

export default router
