import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'

export const useQuestionStore = defineStore('question', {
  state: () => ({
    errors: {},
    loading: false,
  }),

  getters: {},

  actions: {
    async questions(quiz) {
      try {
        const response = await apiClient.get(`/api/quizzes/${quiz}/questions`)
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        return Promise.reject(error.response)
      }
    },

    async store(quiz, question) {
      try {
        const response = await apiClient.post(`/api/quizzes/${quiz}/questions`, question)
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        return Promise.reject(error.response)
      }
    },

    async delete(quiz, question) {
      try {
        const response = await apiClient.delete(`quizzes/${quiz}/questions/${question}`)
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        return Promise.reject(error.response)
      }
    },
  },
})
