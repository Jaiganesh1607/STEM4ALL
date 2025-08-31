import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
})

// SINGLE request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor for 401 handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: data => api.post('/auth/login', data),
  register: data => api.post('/auth/register', data),
}

export const instructorAPI = {
  getDashboardStats: () => api.get('/instructor/dashboard/stats'),
  getWorkshops: () => api.get('/instructor/workshops'),
  createWorkshop: data => api.post('/instructor/workshops', data),
  deleteWorkshop: id => api.delete(`/instructor/workshops/${id}`),
  getStudents: params => api.get('/instructor/students', { params }),
  searchStudents: query => api.get(`/instructor/students/search?q=${query}`),
}

export default api
