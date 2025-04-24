import type { Batch } from '@/schema/batch'
import useAxios from 'axios-hooks'

export const useFetchBatches = () => {
  return useAxios<Batch[]>(
    { url: '/api/schedules', method: 'GET' },
    { manual: true }
  )
}

export const useSaveBatch = () => {
  return useAxios<Batch>(
    { url: '/api/schedules', method: 'POST' },
    { manual: true }
  )
}

export const useRefreshBatch = () => {
  return useAxios<Batch>(
    { url: '/api/schedules/refresh', method: 'POST' },
    { manual: true }
  )
}

export const useDeleteBatch = () => {
  return useAxios<Batch>(
    { url: '/api/schedules', method: 'DELETE' },
    { manual: true }
  )
}
