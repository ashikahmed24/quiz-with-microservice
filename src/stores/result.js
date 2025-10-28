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
        const response = await apiClient.get(`/api/v1/quizzes/results`)
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        toast.error(error.response.data.message)
        return Promise.reject(error.response)
      }
    },
  },
})
