import axios from 'axios'
import { configure } from 'axios-hooks'

// Create an Axios instance with a base URL
const axiosInstance = axios.create({
  baseURL: 'https://api.yourdomain.com', // Replace with your actual API base URL
  headers: {
    'Content-Type': 'application/json',
  },
})

// Configure axios-hooks to use the custom Axios instance
configure({ axios: axiosInstance })

export default axiosInstance