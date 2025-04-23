import { z } from 'zod'
import cronstrue from 'cronstrue'

// Zod schema for batch validation
export const BatchSchema = z.object({
  id: z.number().optional(), // ID may not be present in POST requests
  jobName: z
    .string()
    .min(1, 'Job name is required')
    .max(100, 'Job name is too long'),
  cronExpression: z.string().refine(
    (value) => {
      try {
        cronstrue.toString(value)
        return true
      } catch {
        return false
      }
    },
    { message: 'Invalid cron expression' }
  ),
  targetUrl: z.string().url('Invalid URL format'),
  enabled: z.boolean(),
})

// Type derived from Zod schema
export type Batch = z.infer<typeof BatchSchema>

// Add ID for client-side use
export type BatchWithId = Batch & { id: number }
