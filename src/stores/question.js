import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useQuestionStore = defineStore('question', {
  state: () => ({
    errors: {},
    loading: false,
  }),

  getters: {},

  actions: {
    async all(quiz) {
      try {
        const response = await apiClient.get(`/api/v1/quizzes/${quiz}/questions`)
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        toast.error(error.response.data.message)
        return Promise.reject(error.response)
      }
    },

    async store(quiz, question) {
      try {
        const response = await apiClient.post(`/api/v1/quizzes/${quiz}/questions`, question)
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        toast.error(error.response.data.message)
        return Promise.reject(error.response)
      }
    },

    async update(quiz, question) {
      this.loading = true
      try {
        const response = await apiClient.put(
          `/api/v1/quizzes/${quiz}/questions/${question.id}`,
          question,
        )
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

    async delete(quiz, question) {
      try {
        const response = await apiClient.delete(`/api/v1/quizzes/${quiz}/questions/${question}`)
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        toast.error(error.response.data.message)
        return Promise.reject(error.response)
      }
    },

    async dragged(quiz) {
      try {
        const response = await apiClient.post(`/api/v1/quizzes/${quiz}/questions/dragged`)
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
