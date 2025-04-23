import { createFileRoute, redirect } from '@tanstack/react-router'
import BatchManagement from './components/BatchManagement'
import z from 'zod'

const searchSchema = z.object({
  token: z.string().optional(),
})

export const Route = createFileRoute('/')({
  validateSearch: searchSchema,
  beforeLoad: ({ search: { token } }) => {
    if (!token) {
      throw redirect({ to: '/permission' })
    }
  },
  component: BatchManagement,
})
