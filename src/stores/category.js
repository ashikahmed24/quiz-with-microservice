import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    errors: {},
    loading: false,
  }),

  getters: {},

  actions: {
    async all(page) {
      try {
        const response = await apiClient.get(`/api/categories`, {
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
        const response = await apiClient.post(`/api/categories`, from)
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

    async update(category, form) {
      this.loading = true
      try {
        const response = await apiClient.put(`/api/categories/${category}`, form)
        if (response.status === 200) {
          return Promise.resolve(response)
        }
      } catch (error) {
        return Promise.reject(error.response)
      } finally {
        this.loading = false
      }
    },

    async search(query) {
      try {
        const response = await apiClient.get(`api/categories/search`, {
          params: {
            query: query,
          },
        })
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        return Promise.reject(error.response)
      }
    },
  },
})
