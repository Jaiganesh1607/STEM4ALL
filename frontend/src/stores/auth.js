import { defineStore } from 'pinia'
import { authAPI } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isInstructor: (state) => state.user?.role === 'instructor' && state.user?.approved === true
  },
  actions: {
    async login({ email, password, role }) {
      this.loading = true
      this.error = null
      try {
        const { data } = await authAPI.login({ email, password, role })
        this.user = data.user
        this.token = data.token
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
        return { success: true }
      } catch (err) {
        this.error = err?.response?.data?.message || 'Login failed'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async register({ name, email, password, role }) {
      this.loading = true
      this.error = null
      try {
        const { data } = await authAPI.register({ name, email, password, role })
        this.user = data.user
        this.token = data.token
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
        return { success: true }
      } catch (err) {
        this.error = err?.response?.data?.message || 'Registration failed'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }
})
