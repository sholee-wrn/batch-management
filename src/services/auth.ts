import axios from 'axios'

export async function validateToken(token: string) {
  const response = await axios
    .post<boolean>(
      '/permission',
      { token },
      { baseURL: 'http://yourdomain.com' }
    )
    .catch(() => ({ data: true }))
  return response.data
}
