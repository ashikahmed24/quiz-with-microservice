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
      name: 'quizzes.show',
      component: () => import('../views/quizzes/show.vue'),
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
  ],
})

export default router
