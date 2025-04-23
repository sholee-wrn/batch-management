import { type BatchWithId } from '@/schema/batch'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'

type BatchTableProps = {
  batches: BatchWithId[]
  isLoading: boolean
  onEdit: (batch: BatchWithId) => void
  onDelete: (batch: BatchWithId) => void
}

export default function BatchTable({
  batches,
  isLoading,
  onEdit,
  onDelete,
}: BatchTableProps) {
  return (
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
                onClick={() => onEdit(batch)}
                disabled={isLoading}
              >
                <Pencil className='h-4 w-4' />
              </Button>
              <Button
                size='icon'
                variant='ghost'
                onClick={() => onDelete(batch)}
                disabled={isLoading}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
