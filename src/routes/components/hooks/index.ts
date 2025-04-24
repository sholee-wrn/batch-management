import type { Batch } from '@/schema/batch'
import useAxios from 'axios-hooks'

export const useFetchBatches = () => {
  return useAxios<Batch[]>(
    { url: '/schedules', method: 'GET' },
    { manual: true }
  )
}

export const useSaveBatch = () => {
  return useAxios<Batch>(
    { url: '/schedules', method: 'POST' },
    { manual: true }
  )
}

export const useRefreshBatch = () => {
  return useAxios<Batch>(
    { url: '/schedules/refresh', method: 'POST' },
    { manual: true }
  )
}

export const useDeleteBatch = () => {
  return useAxios<Batch>(
    { url: '/schedules', method: 'DELETE' },
    { manual: true }
  )
}
