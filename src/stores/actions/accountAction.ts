import { Dispatch } from 'redux'

export const setSelectedAccount = (account:string) => async (dispatch:Dispatch) => {
  dispatch({ type: 'SELECTED_ACCOUNT', current_account: account })
}