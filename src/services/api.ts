import axios from 'axios'
import { configure } from 'axios-hooks'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BATCH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

configure({ axios: axiosInstance })

export default axiosInstance