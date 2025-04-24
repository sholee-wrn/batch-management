import axios from 'axios'
type Token = {
  employeeId: string
  ecId: string
  rmId: string
}
export async function validateToken(token: string) {
  const response = await axios
    .get<Token>('/validateOtt?token=' + token, {
      baseURL: import.meta.env.VITE_AUTH_API_URL,
    })
    .catch(() => null)
  return response
}
