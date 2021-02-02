import accountReducer from './accountReducer'
import scheduleReducer from './scheduleReducer'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  account: accountReducer,
  schedule: scheduleReducer
})

export default rootReducer
