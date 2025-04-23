import axios from 'axios'

export async function validateToken(token: string) {
  const response = await axios.post<boolean>(
    '/permission',
    { token },
    { baseURL: 'http://localhost:3000' }
  )
  return response.data
}
