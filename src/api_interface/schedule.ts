import axios from 'axios'

const API_URL = process.env.REACT_APP_API_SERVER_URL

export const retrieveSchedules = async (query:string) => {
  try {
    console.log('start retrieve schedules')
    const schedules_res_data = await axios.get(`${API_URL}/schedule/all?${query}`, {timeout: 10000 })

    console.log('products_res_data', schedules_res_data)

    return schedules_res_data.data
    
  } catch (e) {
    console.log('response', e.response)
    throw e.response && e.response.data ? e.response.data.message : 'Unexpected Error'
  }
}