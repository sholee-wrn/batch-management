import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { type Batch, type BatchWithId, BatchSchema } from '@/schema/batch'
import { useSaveBatch } from './hooks'

type BatchFormProps = {
  batch?: BatchWithId
  onSave: () => void
  onCancel: () => void
}

export default function BatchForm({ batch, onSave, onCancel }: BatchFormProps) {
  const [formData, setFormData] = useState<Batch>({
    jobName: batch?.jobName || '',
    cronExpression: batch?.cronExpression || '',
    targetUrl: batch?.targetUrl || '',
    enabled: batch?.enabled ?? true,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof Batch, string>>>({})

  const [{ loading: isSaving }, executeSave] = useSaveBatch()

  const setBatch = <K extends keyof Batch>(key: K, value: Batch[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const validateForm = () => {
    const validationResult = BatchSchema.safeParse(formData)

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

    try {
      if (batch) {
        await executeSave({
          url: `/schedules/${batch.id}`,
          method: 'PUT',
          data: formData,
        })
      } else {
        await executeSave({
          data: formData,
        })
      }
      onSave()
    } catch (error) {
      console.error('Failed to save batch:', error)
    }
  }

  return (
    <div className='grid gap-4 pt-8'>
      <div>
        <Input
          placeholder='Job Name'
          value={formData.jobName}
          onChange={(e) => setBatch('jobName', e.target.value)}
          disabled={isSaving}
        />
        {errors.jobName && (
          <p className='text-red-500 text-sm mt-1'>{errors.jobName}</p>
        )}
      </div>
      <div>
        <Input
          placeholder='Cron Expression'
          value={formData.cronExpression}
          onChange={(e) => setBatch('cronExpression', e.target.value)}
          disabled={isSaving}
        />
        {errors.cronExpression && (
          <p className='text-red-500 text-sm mt-1'>{errors.cronExpression}</p>
        )}
      </div>
      <div>
        <Input
          placeholder='Target URL'
          value={formData.targetUrl}
          onChange={(e) => setBatch('targetUrl', e.target.value)}
          disabled={isSaving}
        />
        {errors.targetUrl && (
          <p className='text-red-500 text-sm mt-1'>{errors.targetUrl}</p>
        )}
      </div>
      <div className='flex items-center space-x-2'>
        <Checkbox
          id='enabled'
          checked={formData.enabled}
          onCheckedChange={(checked) => setBatch('enabled', checked === true)}
          disabled={isSaving}
        />
        <label htmlFor='enabled' className='text-sm'>
          Enabled
        </label>
      </div>
      <div className='flex gap-2 justify-end'>
        <Button variant='outline' onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : batch ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  )
}
