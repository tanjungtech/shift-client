const formatIntoDate = ( date:any ) => {
  const options:any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Intl.DateTimeFormat('en-SG', options).format(date)
}

const formatIntoCalendarLabel = ( date: any ) => {
  const day_label = setIntlFormat(date, { weekday: 'long' })
  const date_label = date.getDate()
  return { day_label, date_label }
}

const setIntlFormat = ( date: any, options: object ) => {
  return new Intl.DateTimeFormat('en-SG', options).format(date)
}

const getMonDuringWeek = (date: any) => {
  const mon = ((date.getDay() + 7) - 1) % 7
  let base_date = date
  base_date.setDate(base_date.getDate() - mon)
  return new Date(base_date.getFullYear(), base_date.getMonth(), base_date.getDate(), 0, 0)
}

const getSunDuringWeek = (date: any) => {
  const sun = (date.getDay() + 7) % 7
  let base_date = new Date(date)
  base_date.setDate(base_date.getDate() - sun + 7)
  return new Date(base_date.getFullYear(), base_date.getMonth(), base_date.getDate(), base_date.getHours(), base_date.getMinutes())
}

const formatIntoWeekLabel = ( current_date:any ) => {
  const base_date = getMonDuringWeek(current_date)

  let end_date_week:any = new Date(base_date)
  end_date_week.setDate(end_date_week.getDate()+6)

  const date_list = Array.from({length: 7}, (v, i) => {
    const initial_date_ref = new Date(base_date)
    const next_date = new Date(initial_date_ref.setDate(initial_date_ref.getDate()+i))
    const date_ref = new Date(next_date.getFullYear(), next_date.getMonth(), next_date.getDate(), 0, 0)
    return {
      date_label: date_ref.getDate(),
      day_label: setIntlFormat(date_ref, { weekday: 'long' }),
      date_set: date_ref
    }
  })

  return {
    date_list,
    period_label: `${formatIntoDate(base_date)} - ${formatIntoDate(end_date_week)}`
  }
}

const formatIntoStartAndEnd = (date_start: any, date_end: any) => {
  const start = setIntlFormat(date_start, { timeStyle: 'short' })
  const end = setIntlFormat(date_end, { timeStyle: 'short' })
  return { start, end }
}

export {
  formatIntoDate,
  formatIntoCalendarLabel,
  getMonDuringWeek,
  getSunDuringWeek,
  formatIntoWeekLabel,
  formatIntoStartAndEnd
}