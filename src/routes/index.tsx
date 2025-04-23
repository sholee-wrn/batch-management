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
    if (!token || !validateToken(token)) {
      throw redirect({ to: '/permission' })
    }
  },
  component: BatchManagement,
})
