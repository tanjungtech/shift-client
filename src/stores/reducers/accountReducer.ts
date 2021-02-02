const initial_state:any = {
  accounts: [],
  current_account: null
}

export default function accountReducer(state = initial_state, action:any) {
  switch (action.type) {
    case "RETRIEVE_ACCOUNTS":
      console.log('state', state)
      return {
        ...state,
        accounts: [ ...state.accounts, ...action.accounts ]
      }
    case "SELECT_ACCOUNT":
      console.log('state', state)
      return {
        ...state,
        current_account: action.current_account
      }
    default:
      return state
  }
}