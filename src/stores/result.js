import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const useResultStore = defineStore('result', {
  state: () => ({
    errors: {},
    loading: false,
  }),

  getters: {},

  actions: {
    async all() {
      try {
        const response = await apiClient.get(`/api/quizzes/results`)
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        return Promise.reject(error.response)
      }
    },

    async result(quiz) {
      try {
        const response = await apiClient.get(`/api/quizzes/${quiz}/results`)
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        return Promise.reject(error.response)
      }
    },
  },
})
