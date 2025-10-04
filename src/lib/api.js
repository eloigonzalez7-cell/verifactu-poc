import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export async function sendInvoice(payload) {
  const { data } = await apiClient.post('/api/send-invoice', payload)
  return data
}
