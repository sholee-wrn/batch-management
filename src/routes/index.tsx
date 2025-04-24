import { createFileRoute } from '@tanstack/react-router'
import BatchManagement from './components/BatchManagement'
import z from 'zod'
import { validateToken } from '@/services/auth'

const searchSchema = z.object({
  token: z.string().optional(),
})

export const Route = createFileRoute('/')({
  validateSearch: searchSchema,
  beforeLoad: async ({ search: { token } }) => {
    if (!token) {
      throw new Error('Authentication required')
    }

    const isValidToken = await validateToken(token)
    if (!isValidToken) {
      throw new Error('Authentication required')
    }
  },
  component: BatchManagement,
})
