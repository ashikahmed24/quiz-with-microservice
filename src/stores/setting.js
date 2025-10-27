import apiClient from '@/utils/axios'
import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useSettingStore = defineStore('setting', {
  state: () => ({
    errors: {},
    loading: false,
  }),

  getters: {},

  actions: {
    async reboot() {
      try {
        const response = await apiClient.get('/api/settings/reboot')
        if (response.status === 200) {
          toast.success(response.data.message)
          return Promise.resolve(response.data)
        }
      } catch (error) {
        return Promise.reject(error.response)
      }
    },
  },
})
