import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Tooltip from '@material-ui/core/Tooltip'
import Snackbar from '@material-ui/core/Snackbar'

import api_interface from '../../api_interface'
import { getSunDuringWeek, formatIntoDate } from './../../utils'

const useStyles = makeStyles({
  button_root: {
    margin: '1em 0 1em 1em',
    padding: '.5em 2em',
    width: '150px',
    color: '#31c660',
    borderRadius: '5em',
    textTransform: 'capitalize',
    border: '2px solid #31c660'
  },
  button_disabled: {
    opacity: '.7',
    borderColor: '#bdbdbd'
  }
})

interface ShiftFormProps {
  current_account: any;
  submit_type: string;
  retrieveScheduleAction: any;
  query_schedule: string;
  existing_data: {
    start_time: any;
    end_time: any;
    shift_date: any;
    shift_type: string;
    notes: string;
    id: string|null;
  } | null;
}

const ShiftForm: React.FC<ShiftFormProps> = ({ current_account, submit_type, retrieveScheduleAction, query_schedule, existing_data }) => {

  const classes = useStyles()
  const now = new Date()
  const base_start = existing_data && existing_data.start_time ? existing_data.start_time : now
  const base_end = existing_data && existing_data.end_time ? existing_data.end_time : new Date(new Date(now).setHours( now.getHours()+1 ))
  const base_shift_date = existing_data && existing_data.shift_date ? existing_data.shift_date : now

  const [notes, setNotes] = React.useState<string>('')
  const [start, setStart] = React.useState<any>( `${base_start.getHours() < 10 ? '0' : ''}${base_start.getHours()}:${base_start.getMinutes() < 10 ? '0' : ''}${base_start.getMinutes()}`)
  const [end, setEnd] = React.useState<any>(`${base_end.getHours() < 10 ? '0' : ''}${base_end.getHours()}:${base_end.getMinutes() < 10 ? '0' : ''}${base_end.getMinutes()}`)
  const [shift_date, setShiftDate] = React.useState<any>(`${base_shift_date.getFullYear()}-${base_shift_date.getMonth()+1 < 10 ? '0' : ''}${base_shift_date.getMonth()+1}-${now.getDate() < 10 ? '0' : ''}${base_shift_date.getDate()}`)

  const [is_submitted, setIsSubmitted] = React.useState<boolean>(false)
  const [submit_success, setSubmitSuccess] = React.useState<boolean>(false)
  const [error_submit, setErrorSubmit] = React.useState<any | null>(null)

  React.useEffect(() => {
    const now = new Date()
    const base_start = existing_data && existing_data.start_time ? existing_data.start_time : now
    const base_end = existing_data && existing_data.end_time ? existing_data.end_time : new Date(new Date(now).setHours( now.getHours()+1 ))
    const base_shift_date = existing_data && existing_data.shift_date ? existing_data.shift_date : now
    setStart(`${base_start.getHours() < 10 ? '0' : ''}${base_start.getHours()}:${base_start.getMinutes() < 10 ? '0' : ''}${base_start.getMinutes()}`)
    setEnd(`${base_end.getHours()+1 < 10 ? '0' : ''}${base_end.getHours()}:${base_end.getMinutes() < 10 ? '0' : ''}${base_end.getMinutes()}`)
    setShiftDate(`${base_shift_date.getFullYear()}-${base_shift_date.getMonth()+1 < 10 ? '0' : ''}${base_shift_date.getMonth()+1}-${now.getDate() < 10 ? '0' : ''}${base_shift_date.getDate()}`)
    setNotes(existing_data ? existing_data.notes : '')
  }, [existing_data])

  const handleSubmitShift = async (e: any, command = 'submit') => {
    e.preventDefault()
    setIsSubmitted(true)
    setErrorSubmit(null)
    try {
      if (!(start && end && shift_date))
        throw new Error('Empty shift date and time is not allowed')

      if(!(current_account && current_account._id))
        throw new Error('No account detected for this shift')

      const shift_date_arr = shift_date.split('-')
      const start_arr = start.split(':')
      const end_arr = end.split(':')
      const start_time = new Date(parseInt(shift_date_arr[0]), parseInt(shift_date_arr[1])-1, parseInt(shift_date_arr[2]), start_arr[0], start_arr[1]).getTime()
      const end_time = new Date(parseInt(shift_date_arr[0]), parseInt(shift_date_arr[1])-1, parseInt(shift_date_arr[2]), end_arr[0], end_arr[1]).getTime()

      if (end_time <= start_time)
        throw new Error('Start time should be prior to the end time')

      let data: any[] = [{
        start_time,
        end_time,
        id: existing_data && existing_data.id ? existing_data.id.toString() : null
      }]
      let shifts: object = {
        account_id: current_account._id,
        shift_type: 'general',
        data, notes
      }
      console.log('data', data)
      if (command === 'published') {
        const publish_shift_limit = getSunDuringWeek(new Date(end_time)).getTime()
        const publish_shift_start = new Date(start_time).getTime()

        const day_distance = Math.ceil((publish_shift_limit - publish_shift_start) / (24*60*60*1000) )
        data = Array.from({length: day_distance}, (v: any, i: number) => {
          const start_date_arg = new Date(new Date(start_time).setDate( new Date(start_time).getDate() + i ))
          const end_date_arg = new Date(new Date(end_time).setDate( new Date(end_time).getDate() + i ))
          return {
            start_time: start_date_arg.getTime(),
            end_time: end_date_arg.getTime()
          }
        })
        shifts = {
          ...shifts,
          shift_type: command,
          data, notes
        }
      }

      if (existing_data && existing_data.id) {
        await api_interface.updateShift(shifts)
      } else {
        await api_interface.postShifts(shifts)
      }

      await retrieveScheduleAction(query_schedule)
      setSubmitSuccess(true)
      setIsSubmitted(false)

    } catch (error) {
      console.log('error:', error)
      alert('failed to submit shift form')
      setIsSubmitted(false)
      setErrorSubmit(error.toString())
    }
  }

  const handleCloseSnackbar = (e: any, reason: any) => {
    if (reason === 'clickaway') {
      return
    }
    setSubmitSuccess(false)
  }

  return (
    <Paper style={{ padding: '1.2em 2em' }} >
      <h3 style={{ marginBottom: '2em' }} >Shift Form</h3>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1em 0' }} >
        <TextField
          id='time'
          label='Date'
          type='date'
          variant='outlined'
          value={ shift_date }
          onChange={ (e) => setShiftDate(e.target.value) }
          disabled={ is_submitted }
          style={{ width: '50%' }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id='time'
          label='Start'
          type='time'
          variant='outlined'
          value={ start }
          onChange={ (e: any) => setStart(e.target.value) }
          disabled={ is_submitted }
          inputProps={{
            step: 60, // 5 min
          }}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ width: '20%' }}
        />
        <TextField
          id='time'
          label='End'
          type='time'
          variant='outlined'
          value={ end }
          onChange={( e: any) => setEnd(e.target.value) }
          disabled={ is_submitted }
          inputProps={{
            step: 60, // 5 min
          }}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ width: '20%' }}
        />
      </div>
      <div>
        <TextField
          id='time'
          label='Notes'
          type='text'
          multiline
          rows={ 3 }
          fullWidth
          value={ notes }
          disabled={ is_submitted }
          onChange={( e) => setNotes(e.target.value) }
          placeholder='Explain about something here...'
          variant='outlined'
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      {
        is_submitted ?
          <div style={{ margin: '1em 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
            <CircularProgress size={20} />
          </div>
          :
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }} >
            <Button disabled={ is_submitted } onClick={(e) => handleSubmitShift(e) } style={{ margin: '1em 0 1em 1em', padding: '.5em 2em', width: '150px', background: 'rgb(49, 120, 198)', color: '#fff', borderRadius: '5em', border: '2px solid rgb(49, 120, 198)', textTransform: 'capitalize' }} >{ submit_type }</Button>
            {
              submit_type !== 'update' &&
              <Tooltip title={
                <React.Fragment>
                  <p>This shift will be applied until the end of the week ({ formatIntoDate(getSunDuringWeek(new Date(shift_date))) })</p>
                </React.Fragment>
              } aria-label="publish">
                <Button disabled={ (is_submitted || (existing_data && existing_data.shift_type === 'published')) || false } onClick={(e) => handleSubmitShift(e, 'published')} classes={{ root: classes.button_root, disabled: classes.button_disabled }} >Publish</Button>
              </Tooltip>
            }
          </div>
      }
      { error_submit &&
        <div style={{ color: 'red', margin: '2em 0' }} >
          <div>Failed to submit shift form</div>
          <div>Reason: { error_submit }</div>
        </div>
      }
      <Snackbar open={ submit_success } onClose={ (e: any, reason: any) => handleCloseSnackbar(e, reason) } autoHideDuration={6000} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} >
        <div style={{ background: '#015a42', fontSize: '.875em', lineHeight: '1', fontWeight: 'lighter', padding: '1em 2.4em', color: '#fff', borderRadius: '4px', boxShadow: '0 2px 7px 3px rgb(0 0 0 / 25%)' }} >Successfully { submit_type } shifts</div>
      </Snackbar>
    </Paper>
  )
}

export default ShiftForm