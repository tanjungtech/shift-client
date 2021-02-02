const initial_state:any = {
  schedules: []
}

export default function scheduleReducer(state = initial_state, action:any) {
  switch (action.type) {
    case "RETRIEVE_SCHEDULES":
      console.log('state', state)
      return {
        ...state,
        schedules: action.schedules
      }
    default:
      return state
  }
}