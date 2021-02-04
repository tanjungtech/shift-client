import React from 'react'
import { connect } from 'react-redux'

import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog'
import Snackbar from '@material-ui/core/Snackbar'
import CircularProgress from '@material-ui/core/CircularProgress'

import AddIcon from '@material-ui/icons/Add'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'

import { retrieveScheduleAction } from './../stores/actions/scheduleAction'
import { formatIntoDate, getMonDuringWeek } from './../utils'
import api_interface from './../api_interface'

import ShiftForm from './sections/ShiftForm'

interface IProps {
  history: any;
  location: object;
  match: object;
  retrieveScheduleAction: any;
  account: { current_account: any };
  schedule: { schedules: any[] };
}

interface IState {
  start_date: any;
  open_shift_form: boolean;
  edit_form_content: any;
  open_delete_dialog: boolean;
  deleted_schedule: any|null;
  is_submitted: boolean;
  delete_success: boolean;
  error_delete: any;
}

class Shift extends React.Component<IProps, IState> {
  constructor(props : IProps){
    super(props)

    this.state = {
      start_date: getMonDuringWeek(new Date()),
      open_shift_form: false,
      edit_form_content: null,
      open_delete_dialog: false,
      deleted_schedule: null,

      is_submitted: false,
      delete_success: false,
      error_delete: null
    }
  }

  componentDidMount = () => {
    this.handleRetrieveSchedule(this.state.start_date)
  }

  handleRetrieveSchedule = (start_date: any) => {
    if (!(this.props.account && this.props.account.current_account))
      this.props.history.push('/?origin=shift')

    let retrieve_query:string = `start=${start_date.getTime()}`
    if (this.props.account && this.props.account.current_account && this.props.account.current_account._id) {
      retrieve_query += `&account_id=${this.props.account.current_account._id}`
    }

    this.props.retrieveScheduleAction(retrieve_query)
  }

  retrieveNextCourse = (e: any) => {
    e.preventDefault()

    const start_date = new Date(new Date(this.state.start_date).setDate(this.state.start_date.getDate()+7))
    this.handleRetrieveSchedule(start_date)
    this.setState({ start_date })
  }

  retrievePrevCourse = (e: any) => {
    e.preventDefault()

    const start_date = new Date(new Date(this.state.start_date).setDate(this.state.start_date.getDate()-7))
    this.handleRetrieveSchedule(start_date)
    this.setState({ start_date })
  }

  handleEditForm = (e: any, schedule: any) => {
    e.preventDefault()
    const edit_form_content = {
      start_time: new Date(schedule.start_time),
      end_time: new Date(schedule.end_time),
      shift_date: new Date(schedule.start_time),
      id: schedule._id,
      notes: schedule.notes,
      shift_type: schedule.shift_type || 'general'
    }
    this.setState({
      open_shift_form: true,
      edit_form_content
    })
  }

  submitDeleteShift = async (e: any) => {
    e.preventDefault()

    const { deleted_schedule } = this.state

    this.setState({
      is_submitted: true,
      error_delete: null
    })
    
    try {
      const shift = {
        data: [{
          start_time: deleted_schedule.start_time,
          end_time: deleted_schedule.end_time,
          id: deleted_schedule._id
        }],
        account_id: this.props.account.current_account._id,
        deleted_on: true,
        shift_type: deleted_schedule.shift_type
      }
  
      await api_interface.updateShift(shift)
      this.setState({
        is_submitted: false,
        open_delete_dialog: false
      })
    } catch (error) {
      console.log('error:', error)
      alert('failed to submit shift form')
      this.setState({
        is_submitted: false,
        error_delete: error.toString()
      })
    }
  }

  handleCloseSnackbar = (e: any, reason: any) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      delete_success: false
    })
  }

  shiftList = () => {
    const { schedules } = this.props.schedule
    const { start_date } = this.state

    const date_arr = Array.from({ length: 7 }, (v: any, i: number) => {
      return new Date(new Date(start_date).setDate( new Date(start_date).getDate() + i ))
    })
    return (
      <div>
        { date_arr.map( (d: any, i:number) => {
          const date_arr_schedules = schedules.length ? schedules.filter( (s: any) => s.start_time >= d.getTime() && s.end_time <= d.getTime() + 23*60*60*1000 + 59*60*1000 ) : []
          return (
            <div key={i} style={{ margin: '1em 0', lineHeight: '1.618' }} >
              <div style={{ fontWeight: 'bold', fontSize: '1.25em' }} >{ formatIntoDate(d) }</div>
              {
                date_arr_schedules.length ?
                date_arr_schedules.map( (s, j) => {
                  return (
                    <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1em 0' }} >
                      <div style={{ lineHeight: '36px', flexBasis: '20%' }} >
                        <span style={{ marginRight: '.5em' }} >{ new Date(s.start_time).getHours() < 10 ? '0' : '' }{ new Date(s.start_time).getHours() }:{ new Date(s.start_time).getMinutes() < 10 ? '0' : '' }{ new Date(s.start_time).getMinutes() }</span>
                        -
                        <span style={{ marginLeft: '.5em' }} >{ new Date(s.end_time).getHours() < 10 ? '0' : '' }{ new Date(s.end_time).getHours() }:{ new Date(s.end_time).getMinutes() < 10 ? '0' : '' }{ new Date(s.end_time).getMinutes() }</span>
                      </div>
                      <div style={{ flexBasis: '70%' }} >{ s.notes }</div>
                      <div style={{ flexBasis: '10%', display: 'inline-flex', justifyContent: 'flex-end' }} >
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end' }} >
                          <IconButton style={{ height: 36, width: 36, margin: 4 }} onClick={(e: any) => this.setState({ open_delete_dialog: true, deleted_schedule: s })} ><DeleteIcon /></IconButton>
                          <IconButton style={{ height: 36, width: 36, margin: 4 }} onClick={(e) => this.handleEditForm(e, s)} ><EditIcon /></IconButton>
                        </div>
                      </div>
                    </div>
                  )
                })
                :
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1em 0', fontWeight: 'bold' }} >
                  -
                </div>
              }
            </div>
          )
        } ) }
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
          <Button onClick={(e: any) => this.retrievePrevCourse(e) } >Previous Week</Button>
          <Button onClick={(e: any) => this.retrieveNextCourse(e) } >Next Week</Button>
        </div>
      </div>
    )
  }
  
  render(){
    const { open_shift_form, open_delete_dialog, deleted_schedule, edit_form_content, delete_success } = this.state

    return (
      <div style={{ background: '#eee', minHeight: 'calc(100vh - 200px)', padding: '100px 250px', width: 'calc(100% - 500px)' }} >

        <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', margin: '2em 0' }} >
          {
            open_shift_form ?
            <div style={{ padding: '1em 2.4em', background: '#f5f5f5', position: 'relative', display: 'flex' }} >
              <div onClick={() => this.setState({ open_shift_form: false })} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }} >
                <KeyboardBackspaceIcon style={{ marginRight: '.25em' }} />
                Back
              </div>
            </div>
            :
            <div style={{ padding: '1em 2.4em', background: '#f5f5f5', position: 'relative', display: 'flex' }} >
              <h2 style={{ paddingRight: '100px' }} >My Shift</h2>
              <div style={{ position: 'absolute', right: 0 }} >
                <Button style={{ padding: '.5em 2em', right: '2.4em', borderRadius: '5em', background: 'rgb(49, 120, 198)', color: '#fff', top: '1em' }} onClick={() => this.setState({ open_shift_form: true })} ><AddIcon style={{ marginRight: '.1em', fontSize: '1em' }} />Shift</Button>
              </div>
            </div>
          }
          <Divider />
          <div style={{ padding: '1em 2.4em' }}>
            {
              open_shift_form ?
              <div style={{ margin: '1em 0' }} >
                <ShiftForm current_account={ this.props.account.current_account } existing_data={ edit_form_content } submit_type={ edit_form_content ? 'Update' : 'Create' } retrieveScheduleAction={ this.props.retrieveScheduleAction } query_schedule={ `start=${this.state.start_date.getTime()}&account_id=${this.props.account.current_account._id}` } />
              </div>
              :
              <div style={{ margin: '1em 0' }} >
                { this.shiftList() }
              </div>
            }
          </div>
        </div>
        <Dialog open={ open_delete_dialog } onClose={ () => this.setState({ open_delete_dialog: false, error_delete: null }) } maxWidth='md' >
          { deleted_schedule &&
            <div>
              {
                this.state.error_delete ?
                <div style={{ padding: '1em 2.4em', width: '500px', lineHeight: '1.618' }}>
                  <div style={{ fontSize: '1.25em' }} >Failed to delete shift</div>
                  <div>Reason: <span style={{ color: 'red' }} >{ this.state.error_delete }</span></div>
                </div>
                :
                <div style={{ padding: '1em 2.4em', width: '500px', lineHeight: '1.618' }} >
                  <h2 style={{ lineHeight: '1.1', fontWeight: 'normal', margin: '1.5em 0' }} >Are you sure you want to delete this shift?</h2>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1em' }} >
                    <span style={{ marginRight: '.5em' }} >{ new Date(deleted_schedule.start_time).getHours() < 10 ? '0' : '' }{ new Date(deleted_schedule.start_time).getHours() }:{ new Date(deleted_schedule.start_time).getMinutes() < 10 ? '0' : '' }{ new Date(deleted_schedule.start_time).getMinutes() }</span>
                    -
                    <span style={{ marginLeft: '.5em' }} >{ new Date(deleted_schedule.end_time).getHours() < 10 ? '0' : '' }{ new Date(deleted_schedule.end_time).getHours() }:{ new Date(deleted_schedule.end_time).getMinutes() < 10 ? '0' : '' }{ new Date(deleted_schedule.end_time).getMinutes() }</span>
                  </div>
                  <div style={{ fontSize: '1.1em', marginBottom: '1em' }} >{ deleted_schedule.notes }</div>
                </div>
              }
              <Divider />
              <div style={{ padding: '1em 2.4em', width: '500px', display: 'flex', alignItems: 'center', justifyContent: this.state.is_submitted ? 'center' : 'flex-end' }} >
                {
                  this.state.is_submitted ?
                  <CircularProgress />
                  :
                  <Button style={{ background: 'red', color: '#fff', padding: '.8em 2em', textTransform: 'capitalize' }} disabled={ this.state.is_submitted } onClick={(e) => this.submitDeleteShift(e)} >Yes, Delete</Button>
                }
              </div>
            </div>
          }
        </Dialog>
        <Snackbar open={ delete_success } onClose={ (e: any, reason: any) => this.handleCloseSnackbar(e, reason) } autoHideDuration={6000} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} >
          <div style={{ background: '#015a42', fontSize: '.875em', lineHeight: '1', fontWeight: 'lighter', padding: '1em 2.4em', color: '#fff', borderRadius: '4px', boxShadow: '0 2px 7px 3px rgb(0 0 0 / 25%)' }} >Shift has been deleted</div>
        </Snackbar>
      </div>
    )
  }
  
}

const mapStateToProps = (state:object) => {
  return state
}

export default connect(mapStateToProps, { retrieveScheduleAction })(Shift)