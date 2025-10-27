import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    errors: {},
    loading: false,
  }),

  getters: {},

  actions: {
    async all(page) {
      try {
        const response = await apiClient.get(`/api/users`, {
          params: {
            page: page,
          },
        })
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        return Promise.reject(error.response)
      }
    },

    async store(from, { router, toast }) {
      this.loading = true
      try {
        const response = await apiClient.post(`/api/users`, from)
        if (response.status === 201) {
          toast.success(response.data.message)
          router.push({ name: 'categories' })
          return Promise.resolve(response.data)
        }
      } catch (error) {
        return Promise.reject(error.response)
      } finally {
        this.loading = false
      }
    },

    async update(user, form) {
      this.loading = true
      try {
        const response = await apiClient.put(`/api/users/${user}`, form)
        if (response.status === 200) {
          return Promise.resolve(response)
        }
      } catch (error) {
        return Promise.reject(error.response)
      } finally {
        this.loading = false
      }
    },

    async delete(user) {
      try {
        const response = await apiClient.delete(`api/users/${user}`)
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        return Promise.reject(error.response)
      }
    },
  },
})
