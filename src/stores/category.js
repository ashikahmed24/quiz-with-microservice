import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useCategoryStore = defineStore('category', {
  state: () => ({
    errors: {},
    loading: false,
  }),

  getters: {},

  actions: {
    async all(page) {
      try {
        const response = await apiClient.get(`/api/v1/categories`, {
          params: {
            page: page,
          },
        })
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        toast.error(error.response.data.message)
        return Promise.reject(error.response)
      }
    },

    async store(from, { router, toast }) {
      this.loading = true
      try {
        const response = await apiClient.post(`/api/v1/categories`, from)
        if (response.status === 201) {
          toast.success(response.data.message)
          router.push({ name: 'categories' })
          return Promise.resolve(response.data)
        }
      } catch (error) {
        toast.error(error.response.data.message)
        return Promise.reject(error.response)
      } finally {
        this.loading = false
      }
    },

    async update(category, form) {
      this.loading = true
      try {
        const response = await apiClient.put(`/api/v1/categories/${category}`, form)
        if (response.status === 200) {
          return Promise.resolve(response)
        }
      } catch (error) {
        toast.error(error.response.data.message)
        return Promise.reject(error.response)
      } finally {
        this.loading = false
      }
    },

    async search(query) {
      try {
        const response = await apiClient.get(`api/v1/categories/search`, {
          params: {
            query: query,
          },
        })
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
