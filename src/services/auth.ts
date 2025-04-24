import axios from 'axios'

export async function validateToken(token: string) {
  const response = await axios
    .post<boolean>(
      '/validateOTT',
      { token },
      { baseURL: import.meta.env.VITE_AUTH_API_URL }
    )
    .catch(() => ({ data: true }))
  return response.data
}
