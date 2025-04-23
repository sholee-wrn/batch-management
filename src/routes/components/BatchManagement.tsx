import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { RefreshCw, Plus } from 'lucide-react'
import { type BatchWithId, BatchSchema } from '@/schema/batch'
import BatchTable from './BatchTable'
import BatchForm from './BatchForm'
import { useFetchBatches, useDeleteBatch } from './hooks'
import z from 'zod'

export default function BatchManagement() {
  const [batches, setBatches] = useState<BatchWithId[]>([])
  const [open, setOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<BatchWithId>()
  const [editingBatch, setEditingBatch] = useState<BatchWithId>()

  const [{ data: batchesData, loading: isLoadingBatches }, fetchBatches] =
    useFetchBatches()
  const [{ loading: isDeleting }, executeDelete] = useDeleteBatch()

  useEffect(() => {
    if (Array.isArray(batchesData)) {
      try {
        const validatedBatches = z.array(BatchSchema).parse(batchesData)
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

  useEffect(() => {
    fetchBatches()
  }, [])

  const handleEdit = (batch: BatchWithId) => {
    setEditingBatch(batch)
    setOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await executeDelete({
        url: `/batch/${id}`,
      })
      await fetchBatches()
      setConfirmDelete(undefined)
    } catch (error) {
      console.error('Failed to delete batch:', error)
    }
  }

  const resetForm = () => {
    setEditingBatch(undefined)
    setOpen(false)
  }

  const refreshData = () => {
    fetchBatches()
  }

  const isLoading = isLoadingBatches || isDeleting

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
                className={'h-4 w-4' + (isLoading ? ' animate-spin' : '')}
              />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button disabled={isLoading}>
                  <Plus className='mr-2 h-4 w-4' /> Add Batch
                </Button>
              </DialogTrigger>
              <DialogContent>
                <BatchForm
                  batch={editingBatch}
                  onSave={() => {
                    fetchBatches()
                    resetForm()
                  }}
                  onCancel={resetForm}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <BatchTable
            batches={batches}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={setConfirmDelete}
          />
        </CardContent>
      </Card>

      {confirmDelete && (
        <Dialog
          open={!!confirmDelete}
          onOpenChange={() => setConfirmDelete(undefined)}
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
                  onClick={() => setConfirmDelete(undefined)}
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
