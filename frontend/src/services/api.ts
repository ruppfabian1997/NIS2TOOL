import axios from 'axios'
import { Domain, DomainScore, Task } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL
})

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

export async function register(email: string, password: string): Promise<string> {
  const res = await api.post('/auth/register', { email, password })
  return res.data.access_token
}

export async function login(email: string, password: string): Promise<string> {
  const form = new URLSearchParams()
  form.append('username', email)
  form.append('password', password)
  const res = await api.post('/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  return res.data.access_token
}

export async function fetchDomains(): Promise<Domain[]> {
  const res = await api.get('/domains/')
  return res.data
}

export async function saveAnswer(domain_id: string, question_id: string, value: number) {
  await api.post('/assessment/answers', { domain_id, question_id, value })
}

export async function fetchDomainScores(): Promise<DomainScore[]> {
  const res = await api.get('/scores/domain')
  return res.data
}

export async function fetchOverallScore(): Promise<number> {
  const res = await api.get('/scores/overall')
  return res.data.score_percent
}

export async function generateTasks(): Promise<Task[]> {
  const res = await api.post('/tasks/generate')
  return res.data
}

export async function fetchTasks(): Promise<Task[]> {
  const res = await api.get('/tasks')
  return res.data
}

export async function updateTask(taskId: number, data: Partial<Task>): Promise<Task> {
  const res = await api.patch(`/tasks/${taskId}`, data)
  return res.data
}

export default api
