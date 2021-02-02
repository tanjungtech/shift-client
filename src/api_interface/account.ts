import axios from 'axios'

const API_URL = process.env.REACT_APP_API_SERVER_URL 

export const retrieveAccounts = async () => {
  try {
    console.log('start retrieving order status')
    const accounts = await axios.get(`${API_URL}/account/all`, { timeout: 10000 })
    return accounts.data
  } catch (e) {
    console.log('response', e.response)
    throw e.response && e.response.data ? e.response.data.message : 'Unexpected Error'
  }
}
