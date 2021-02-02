import api_interface from '../../api_interface'
import { Dispatch } from 'redux'

export const retrieveScheduleAction = (query:string) => async (dispatch:Dispatch) => {
  try {
    console.log('start retrieve schedules')
    console.log('query', query)
    const schedules_res_data = await api_interface.retrieveSchedules(query)

    console.log('schedules_res_data', schedules_res_data)
    
    dispatch({ type: 'RETRIEVE_SCHEDULES', schedules: schedules_res_data.schedules })
  } catch (e) {
    console.log('response', e)
    throw e && e.response && e.response.data ? e.response.data.message : 'Unexpected Error'
  }
}