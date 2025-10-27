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
        const response = await apiClient.get(`/api/quizzes`, {
          params: {
            page: page,
          },
        })
        if (response.status === 200) {
          return Promise.resolve(response)
        }
      } catch (error) {
        return Promise.reject(error.response)
      }
    },

    async store(form, { toast, router }) {
      this.loading = true
      try {
        const response = await apiClient.post(`/api/quizzes`, form)
        if (response.status === 201) {
          toast.success(response.data.message)
          router.push({ name: 'quizzes' })
          return Promise.resolve(response)
        }
      } catch (error) {
        return Promise.reject(error.response)
      } finally {
        this.loading = false
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

    async update(quiz, payload) {
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
        const response = await apiClient.get(`/api/quiz/${quiz}`)
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          return Promise.reject(error.response)
        }
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
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          return Promise.reject(error.response)
        }
      } finally {
        this.loading = false
      }
    },

    async results(quiz) {
      try {
        const response = await apiClient.get(`/api/quizzes/${quiz}/results`)
        if (response.status === 200) {
          return Promise.resolve(response)
        }
      } catch (error) {
        if (error.response) {
          return Promise.reject(error.response)
        }
      }
    },

    async leaderboards(quiz) {
      try {
        const response = await apiClient.get(`/api/quizzes/${quiz}/leaderboards`)
        if (response.status === 200) {
          return Promise.resolve(response)
        }
      } catch (error) {
        if (error.response) {
          return Promise.reject(error.response)
        }
      }
    },

    async participants(quiz) {
      try {
        const response = await apiClient.get(`/api/quizzes/${quiz}/participants`)
        if (response.status === 200) {
          return Promise.resolve(response)
        }
      } catch (error) {
        if (error.response) {
          return Promise.reject(error.response)
        }
      }
    },
  },
})
