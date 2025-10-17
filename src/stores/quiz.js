import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    errors: {},
    loading: false,
  }),

  getters: {},

  actions: {
    async all() {
      try {
        const response = await apiClient.get(`/api/quizzes`)
        if (response.status === 200) {
          return Promise.resolve(response)
        }
      } catch (error) {
        return Promise.reject(error.response)
      }
    },

    async show(quizId) {
      try {
        const response = await apiClient.get(`/api/quizzes/${quizId}`)
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        throw error.response || error
      }
    },

    async update(quiz, payload, toast) {
      this.loading = true
      try {
        const response = await apiClient.put(`/api/quizzes/${quiz}`, payload)

        if (response.status === 200) {
          toast.success(response.data.message)
        }
        return Promise.resolve(response.data)
      } catch (error) {
        if (error.response) {
          return Promise.reject(error.response)
        }
      } finally {
        this.loading = false
      }
    },

    async view(quiz) {
      try {
        const response = await apiClient.get(`/api/public/quizzes/${quiz}`)
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          return Promise.reject(error.response)
        }
      }
    },

    async submit(quiz, payload, { toast, router }) {
      this.loading = true
      try {
        const response = await apiClient.post(`/api/quizzes/${quiz}/submit`, payload)
        if (response.status === 200) {
          toast.success(response.data.message)
          router.push({
            name: 'quiz.success',
            query: {
              score: response.data.score,
              time: response.data.time,
              code: quiz.code,
            },
          })
        }
      } catch (error) {
        if (error.response) {
          return Promise.reject(error.response)
        }
      } finally {
        this.loading = false
      }
    },
  },
})
