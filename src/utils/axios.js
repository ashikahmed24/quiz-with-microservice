import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// Base Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore?.() // ensure store is initialized only when called in browser

    if (authStore?.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore?.()

    if (error.response?.status === 401) {
      // Auto logout on unauthorized
      authStore?.$reset?.()

      // Optional: show a toast/alert before redirect
      alert('Session expired. Please log in again.')

      window.location.replace('/')
    }

    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data?.message || error.message)
    }

    return Promise.reject(error)
  },
)

export default apiClient
