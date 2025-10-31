import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    errors: {},
    loading: false,
    dashboard: [],
  }),

  getters: {},

  actions: {
    async getDashboard() {
      try {
        const response = await apiClient.get(`/api/v1/dashboard`)
        if (response.status === 200) {
          this.dashboard = response.data
          return Promise.resolve(response)
        }
      } catch (error) {
        toast.error(error.response.data.message)
        return Promise.reject(error.response)
      }
    },
  },
})
