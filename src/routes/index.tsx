import { createFileRoute, redirect } from '@tanstack/react-router'
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
      throw redirect({ to: '/permission' })
    }
    const isValidToken = await validateToken(token)
    if (!isValidToken) {
      throw redirect({ to: '/permission' })
    }
  },
  component: BatchManagement,
})
