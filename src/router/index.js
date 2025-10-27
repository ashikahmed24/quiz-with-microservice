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
      path: '/categories',
      name: 'categories',
      component: () => import('@/views/categories/index.vue'),
    },

    // users
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/users/index.vue'),
    },

    {
      path: '/quizzes',
      name: 'quizzes',
      component: () => import('../views/quizzes/index.vue'),
    },

    {
      path: '/quizzes/create',
      name: 'quizzes.create',
      component: () => import('../views/quizzes/create.vue'),
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
      path: '/quizzes/:code/start',
      name: 'quiz.start',
      component: () => import('../views/quizzes/start.vue'),
    },

    {
      path: '/quiz/:code/success',
      name: 'quiz.success',
      component: () => import('../views/quizzes/success.vue'),
    },

    {
      path: '/quiz/:id/results',
      name: 'quiz.results',
      component: () => import('../views/quizzes/results.vue'),
    },

    {
      path: '/results',
      name: 'results',
      component: () => import('../views/results/index.vue'),
    },
  ],
})

export default router
