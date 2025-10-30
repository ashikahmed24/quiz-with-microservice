import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    errors: {},
    loading: false,
  }),

  getters: {},

  actions: {
    async all(page) {
      try {
        const response = await apiClient.get(`/api/v1/quizzes`, {
          params: {
            page: page,
          },
        })
        if (response.status === 200) {
          return Promise.resolve(response)
        }
      } catch (error) {
        toast.error(error.response.data.message)
        return Promise.reject(error.response)
      }
    },

    async store(form, { toast, router }) {
      this.loading = true
      try {
        const response = await apiClient.post(`/api/v1/quizzes`, form)
        if (response.status === 201) {
          toast.success(response.data.message)
          router.push({ name: 'quizzes' })
          return Promise.resolve(response)
        }
      } catch (error) {
        toast.error(error.response.data.message)
        return Promise.reject(error.response)
      } finally {
        this.loading = false
      }
    },

    async show(quiz) {
      try {
        const response = await apiClient.get(`/api/v1/quizzes/${quiz}`)
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        toast.error(error.response.data.message)
        return Promise.reject(error.response)
      }
    },

    async update(quiz, payload) {
      this.loading = true
      try {
        const response = await apiClient.put(`/api/v1/quizzes/${quiz}`, payload)

        if (response.status === 200) {
          toast.success(response.data.message)
        }
        return Promise.resolve(response.data)
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message)
          return Promise.reject(error.response)
        }
      } finally {
        this.loading = false
      }
    },

    async view(quiz) {
      this.loading = true
      try {
        const response = await apiClient.get(`/api/quizzes/${quiz}`)
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message)
          return Promise.reject(error.response)
        }
      } finally {
        this.loading = false
      }
    },

    async start(quiz) {
      this.loading = true
      try {
        const response = await apiClient.post(`/api/quizzes/${quiz}/start`)
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message)
          return Promise.reject(error.response)
        }
      } finally {
        this.loading = false
      }
    },

    async submit(quiz, payload) {
      this.loading = true
      try {
        const response = await apiClient.post(`/api/quizzes/${quiz}/submit`, payload)
        if (response.status === 200) {
          return Promise.resolve(response)
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message)
          return Promise.reject(error.response)
        }
      } finally {
        this.loading = false
      }
    },

    async results(quiz) {
      try {
        const response = await apiClient.get(`/api/v1/quizzes/${quiz}/results`)
        if (response.status === 200) {
          return Promise.resolve(response)
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message)
          return Promise.reject(error.response)
        }
      }
    },

    async leaderboards(quiz) {
      try {
        const response = await apiClient.get(`/api/v1/quizzes/${quiz}/leaderboards`)
        if (response.status === 200) {
          return Promise.resolve(response)
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message)
          return Promise.reject(error.response)
        }
      }
    },

    async participants(quiz) {
      try {
        const response = await apiClient.get(`/api/v1/quizzes/${quiz}/participants`)
        if (response.status === 200) {
          return Promise.resolve(response)
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message)
          return Promise.reject(error.response)
        }
      }
    },
  },
})
