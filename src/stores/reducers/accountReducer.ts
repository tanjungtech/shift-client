const initial_state:any = {
  accounts: [],
  current_account: null
}

export default function accountReducer(state = initial_state, action:any) {
  switch (action.type) {
    case "SELECTED_ACCOUNT":
      console.log('state', state)
      return {
        ...state,
        current_account: action.current_account
      }
    default:
      return state
  }
}