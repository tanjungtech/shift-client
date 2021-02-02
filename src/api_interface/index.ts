import * as account_interface from './account'
import * as schedule_interface from './schedule'

const api_interface = {
  ...account_interface,
  ...schedule_interface
}

export default api_interface
