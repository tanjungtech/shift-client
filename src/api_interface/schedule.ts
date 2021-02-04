import axios from 'axios'

const API_URL = process.env.REACT_APP_API_SERVER_URL

export const retrieveSchedules = async (query:string) => {
  try {
    console.log('start retrieve schedules')
    const schedules_res_data = await axios.get(`${API_URL}/schedule/all?${query}`, { timeout: 10000 })

    console.log('schedules_res_data', schedules_res_data)

    return schedules_res_data.data
    
  } catch (e) {
    console.log('response', e.response)
    throw e.response && e.response.data ? e.response.data.message : 'Unexpected Error'
  }
}

export const postShifts = async (shifts:object) => {
  try {

    const schedule_res_data = await axios.post(`${API_URL}/schedule/all`, shifts, { timeout: 10000 })

    return schedule_res_data.data
    
  } catch (e) {
    console.log('response', e.response)
    throw e.response && e.response.data ? e.response.data.message : 'Unexpected Error'
  }
}

export const updateShift = async (shifts:object) => {
  try {
    
    const schedule_res_data = await axios.put(`${API_URL}/schedule/all`, shifts, { timeout: 10000 })

    return schedule_res_data.data
    
  } catch (e) {
    console.log('response', e.response)
    throw e.response && e.response.data ? e.response.data.message : 'Unexpected Error'
  }
}
