import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useAuthStore = defineStore('auth', {
  state: () => ({
    errors: {},
    loading: false,
    token: null,
    user: {},
  }),

  persist: {
    paths: ['token', 'user'],
  },

  getters: {
    loggedIn: (state) => !!state.token,
  },

  actions: {
    async login(payload, { toast, router }) {
      this.loading = true
      try {
        const response = await apiClient.post(`/api/auth/login`, payload)
        if (response.status === 200) {
          this.token = response.data?.token
          this.user = response.data?.user
          toast.success(response.data.message)
          router.push({
            name: 'home',
          })
        }
      } catch (error) {
        if (error.response) {
          return Promise.reject(error.response)
        }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      try {
        const response = await axiosInstance.post('/api/auth/logout')
        if (response.status === 200) {
          toast.success(response.data.message)
          this.$reset()
          return new Promise((resolve) => {
            resolve(response)
          })
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          toast.error(error.response.data.message)
        }
      } finally {
        this.loading = false
      }
    },
  },
})
