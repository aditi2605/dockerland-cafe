// utils/api.js — Central place to configure all HTTP calls to our FastAPI backend.
//
// 🐳 Docker concept: This file talks to the "backend" service.
// In docker-compose.yml, our FastAPI app runs in a container named "backend".
// The Vite proxy (vite.config.js) forwards /api/* requests to http://backend:8000.
// Docker's internal DNS resolves "backend" → the container's IP automatically!

import axios from 'axios'

// Create a pre-configured Axios instance.
// All requests made with `api` will automatically prefix /api to the URL.
const api = axios.create({
  baseURL: '/api',         // Goes through Vite proxy → FastAPI backend container
  timeout: 10000,          // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Interceptors ──────────────────────────────────────────────────────────
// These run before every request / after every response.

// Request interceptor — log or add auth tokens here
api.interceptors.request.use((config) => {
  // TODO: add Authorization header if you add user auth later
  return config
})

// Response interceptor — unified error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response?.data?.detail || error.message)
    return Promise.reject(error)
  }
)

// ─── Lesson endpoints ──────────────────────────────────────────────────────
export const getLessons        = ()         => api.get('/lessons')
export const getLesson         = (id)       => api.get(`/lessons/${id}`)

// ─── Quiz endpoints ────────────────────────────────────────────────────────
export const getQuiz           = (lessonId) => api.get(`/quizzes/${lessonId}`)
export const submitQuiz        = (payload)  => api.post('/quiz/submit', payload)

// ─── Progress endpoints ────────────────────────────────────────────────────
export const getProgress       = (username) => api.get(`/progress/${username}`)
export const saveProgress      = (payload)  => api.post('/progress', payload)

export default api
