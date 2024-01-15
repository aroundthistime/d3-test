import { useQuery } from '@tanstack/react-query'
import { getBirthRateData } from './api'

const BIRTH_RATE_QUERY_KEY = ['birthrate'] as const

export const useBirthRateQuery = () => {
  return useQuery({
    queryKey: BIRTH_RATE_QUERY_KEY,
    queryFn: getBirthRateData
  })
}
