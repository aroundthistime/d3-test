import axios from 'axios'
import { type BirthRateData, type BirthRateDataDto } from './types'

export const getBirthRateData = async () => {
  const rawData: BirthRateDataDto = (await axios.get('/singapore_birthrate.json')).data

  const data: BirthRateData = rawData.map(d => ({
    year: new Date(d.Key),
    birth: parseInt(d.Value)
  }))

  return data
}
