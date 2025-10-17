import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'
const toast = useToast()
export const useToastStore = defineStore('toast', {
  state: () => ({}),

  actions: {
    info(message) {
      toast.info(message, {
        timeout: 3000,
      })
    },

    success(message) {
      toast.success(message, {
        timeout: 3000,
      })
    },

    error(message) {
      toast.error(message, {
        timeout: 3000,
      })
    },

    warning(message) {
      toast.warning(message, {
        timeout: 3000,
      })
    },
  },
})
