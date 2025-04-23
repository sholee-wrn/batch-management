import type { Batch } from '@/schema/batch'
import useAxios from 'axios-hooks'

export const useFetchBatches = () => {
  return useAxios<Batch[]>({ url: '/batch', method: 'GET' }, { manual: true })
}

export const useSaveBatch = () => {
  return useAxios({ url: '/batch', method: 'POST' }, { manual: true })
}

export const useDeleteBatch = () => {
  return useAxios({ url: '/batch', method: 'DELETE' }, { manual: true })
}
