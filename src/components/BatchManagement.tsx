import { useState, useEffect } from 'react'
import useAxios, { configure } from 'axios-hooks'
import axios from 'axios'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Pencil, RefreshCw } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import cronstrue from 'cronstrue'

// Create an Axios instance with a base URL
const axiosInstance = axios.create({
  baseURL: 'https://api.yourdomain.com', // Replace with your actual API base URL
  headers: {
    'Content-Type': 'application/json',
  },
})

// Configure axios-hooks to use the custom Axios instance
configure({ axios: axiosInstance })

// Zod schema for batch validation
const BatchSchema = z.object({
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
type Batch = z.infer<typeof BatchSchema>

// Add ID for client-side use
type BatchWithId = Batch & { id: number }

export default function BatchManagement() {
  const [batches, setBatches] = useState<BatchWithId[]>([])
  const [open, setOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<BatchWithId | null>(null)
  const [editingBatch, setEditingBatch] = useState<BatchWithId | null>(null)
  const [jobName, setJobName] = useState('')
  const [cronExpression, setCronExpression] = useState('')
  const [targetUrl, setTargetUrl] = useState('')
  const [enabled, setEnabled] = useState(true)
  const [errors, setErrors] = useState<Partial<Record<keyof Batch, string>>>({})

  // Axios hooks for API calls
  const [{ data: batchesData, loading: isLoadingBatches }, fetchBatches] =
    useAxios({ url: '/batch', method: 'GET' }, { manual: true })

  const [{ loading: isSaving }, executeSave] = useAxios(
    { url: '/batch', method: 'POST' },
    { manual: true }
  )

  const [{ loading: isDeleting }, executeDelete] = useAxios(
    { url: '/batch', method: 'DELETE' },
    { manual: true }
  )

  // Handle batches data
  useEffect(() => {
    if (batchesData) {
      try {
        const validatedBatches = z.array(BatchSchema).parse(batchesData)
        // Add client-side ID if not provided by the server
        const batchesWithId = validatedBatches.map((batch, index) => ({
          ...batch,
          id: batch.id || Date.now() + index,
        }))
        setBatches(batchesWithId)
      } catch (error) {
        console.error('Failed to validate batches:', error)
      }
    }
  }, [batchesData])

  // Initial fetch
  useEffect(() => {
    fetchBatches()
  }, [])

  const validateForm = () => {
    const validationResult = BatchSchema.safeParse({
      jobName,
      cronExpression,
      targetUrl,
      enabled,
    })

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors
      setErrors({
        jobName: fieldErrors.jobName?.[0],
        cronExpression: fieldErrors.cronExpression?.[0],
        targetUrl: fieldErrors.targetUrl?.[0],
        enabled: fieldErrors.enabled?.[0],
      })
      return false
    }
    setErrors({})
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return

    const batchData = { jobName, cronExpression, targetUrl, enabled }

    try {
      if (editingBatch) {
        await executeSave({
          url: `/batch/${editingBatch.id}`,
          method: 'PUT',
          data: batchData,
        })
      } else {
        await executeSave({
          data: batchData,
        })
      }
      await fetchBatches()
      resetForm()
    } catch (error) {
      console.error('Failed to save batch:', error)
    }
  }

  const handleEdit = (batch: BatchWithId) => {
    setEditingBatch(batch)
    setJobName(batch.jobName)
    setCronExpression(batch.cronExpression)
    setTargetUrl(batch.targetUrl)
    setEnabled(batch.enabled)
    setOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await executeDelete({
        url: `/batch/${id}`,
      })
      await fetchBatches()
      setConfirmDelete(null)
    } catch (error) {
      console.error('Failed to delete batch:', error)
    }
  }

  const resetForm = () => {
    setEditingBatch(null)
    setJobName('')
    setCronExpression('')
    setTargetUrl('')
    setEnabled(true)
    setErrors({})
    setOpen(false)
  }

  const refreshData = () => {
    fetchBatches()
  }

  const isLoading = isLoadingBatches || isSaving || isDeleting

  return (
    <div className='p-4 grid gap-4'>
      <Card>
        <CardHeader className='flex flex-row justify-between items-center'>
          <CardTitle>Batch Management</CardTitle>
          <div className='flex items-center gap-2'>
            <Button
              size='icon'
              variant='outline'
              onClick={refreshData}
              disabled={isLoading}
            >
              <RefreshCw
                className={'h-4 w-4' + isLoading ? 'animate-spin' : ''}
              />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button disabled={isLoading}>
                  <Plus className='mr-2 h-4 w-4' /> Add Batch
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div className='grid gap-4 pt-8'>
                  <div>
                    <Input
                      placeholder='Job Name'
                      value={jobName}
                      onChange={(e) => setJobName(e.target.value)}
                      disabled={isLoading}
                    />
                    {errors.jobName && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.jobName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder='Cron Expression'
                      value={cronExpression}
                      onChange={(e) => setCronExpression(e.target.value)}
                      disabled={isLoading}
                    />
                    {errors.cronExpression && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.cronExpression}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder='Target URL'
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      disabled={isLoading}
                    />
                    {errors.targetUrl && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.targetUrl}
                      </p>
                    )}
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='enabled'
                      checked={enabled}
                      onCheckedChange={(checked) =>
                        setEnabled(checked === true)
                      }
                      disabled={isLoading}
                    />
                    <label htmlFor='enabled' className='text-sm'>
                      Enabled
                    </label>
                  </div>
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading
                      ? 'Saving...'
                      : editingBatch
                        ? 'Update'
                        : 'Create'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Name</TableHead>
                <TableHead>Cron Expression</TableHead>
                <TableHead>Target URL</TableHead>
                <TableHead>Enabled</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell>{batch.jobName}</TableCell>
                  <TableCell>{batch.cronExpression}</TableCell>
                  <TableCell>{batch.targetUrl}</TableCell>
                  <TableCell>
                    <Badge variant={batch.enabled ? 'default' : 'outline'}>
                      {batch.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right space-x-2'>
                    <Button
                      size='icon'
                      variant='ghost'
                      onClick={() => handleEdit(batch)}
                      disabled={isLoading}
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      size='icon'
                      variant='ghost'
                      onClick={() => setConfirmDelete(batch)}
                      disabled={isLoading}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {confirmDelete && (
        <Dialog
          open={!!confirmDelete}
          onOpenChange={() => setConfirmDelete(null)}
        >
          <DialogContent>
            <div className='grid gap-4'>
              <div>
                Are you sure you want to delete{' '}
                <strong>{confirmDelete.jobName}</strong>?
              </div>
              <div className='flex gap-2 justify-end'>
                <Button
                  variant='outline'
                  onClick={() => setConfirmDelete(null)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant='destructive'
                  onClick={() => handleDelete(confirmDelete.id)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
