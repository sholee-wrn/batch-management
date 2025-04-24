import axios from 'axios'
type Token = {
  employeeId: string
  ecId: string
  rmId: string
}
export async function validateToken(token: string) {
  const response = await axios
    .get<Token>('auth/validateOtt?token=' + token)
    .catch(() => null)
  return response
}
