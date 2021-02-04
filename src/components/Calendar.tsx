import React from 'react'
import { connect } from 'react-redux'

// import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import CloseIcon from '@material-ui/icons/Close'

import { retrieveScheduleAction } from './../stores/actions/scheduleAction'
import { formatIntoWeekLabel, getMonDuringWeek } from './../utils'
import RenderHourShift from './sections/RenderHourShift'
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
  week_format: any;
  week_period: any;
  current_date: any;
  base_date: any;
  relative_form_position: {
    top: number,
    left: number,
    day: any,
    hour: any
  };
  relative_date_provided: any;
  query_schedule: {
    start: string,
    accounts: string[]
  };
}

const hourlist: any[] = Array.from({length: 24}, (v, i) => { return { text: `${i < 10 ? '0' : ''}${i}:00`, hour_set: i } })

class Calendar extends React.Component<IProps, IState> {
  constructor(props : IProps){
    super(props)

    const raw_date = new Date()
    const current_date = new Date(raw_date.getFullYear(), raw_date.getMonth(), raw_date.getDate(), 0, 0)
    const base_date = getMonDuringWeek(new Date())
    const week_format = formatIntoWeekLabel(new Date())

    this.state = {
      current_date, base_date, week_format,
      week_period: week_format.period_label,
      relative_form_position: { top: 0, left: 0, day: null, hour: 0 },
      relative_date_provided: null,
      query_schedule: {
        start: '',
        accounts: []
      }
    }
  }

  componentDidMount = () => {
    if (!(this.props.account && this.props.account.current_account))
      this.props.history.push('/?origin=calendar')

    let retrieve_query:string = `start=${this.state.base_date.getTime()}`
    this.props.retrieveScheduleAction(retrieve_query)
    this.setState({
      query_schedule: {
        ...this.state.query_schedule,
        start: this.state.base_date.getTime(),
        accounts: [ this.props.account.current_account ]
      }
    })
  }

  handleNext = async (e:any) => {
    e.preventDefault()
    const base_date = new Date(new Date(this.state.base_date).setDate(this.state.base_date.getDate()+7))
    const week_format = formatIntoWeekLabel(base_date)
    try {
      await this.props.retrieveScheduleAction(`start=${base_date.getTime()}`)
      this.setState({
        base_date, week_format,
        week_period: week_format.period_label,
        query_schedule: {
          ...this.state.query_schedule,
          start: base_date.getTime().toString()
        }
      })
    } catch (error) {
      alert('failed to retrieve next schedule')
      console.log('error', error)
    }
  }

  handlePrev = async (e:any) => {
    e.preventDefault()
    const base_date = new Date(new Date(this.state.base_date).setDate(this.state.base_date.getDate()-7))
    const week_format = formatIntoWeekLabel(base_date)
    console.log('base_date', base_date)
    try {
      await this.props.retrieveScheduleAction(`start=${base_date.getTime()}`)
      this.setState({
        base_date, week_format,
        week_period: week_format.period_label,
        query_schedule: {
          ...this.state.query_schedule,
          start: base_date.getTime().toString()
        }
      })
    } catch (error) {
      alert('failed to retrieve next schedule')
      console.log('error', error)
    }
  }

  handleRelativeFormPosition = (new_rel_pos: any) => {

    const parsed_hour = Math.floor(new_rel_pos.hour)
    const parsed_mins = Math.ceil((new_rel_pos.hour - parsed_hour)*60)
    const relative_date_provided = new Date(new_rel_pos.day.date_set.getFullYear(), new_rel_pos.day.date_set.getMonth(), new_rel_pos.day.date_set.getDate(), parsed_hour, parsed_mins)

    this.setState({
      relative_form_position: {
        ...this.state.relative_form_position,
        ...new_rel_pos
      },
      relative_date_provided
    })
  }

  handleQueryString = () => {
    const { query_schedule, base_date } = this.state
    let updated_query_schedule = `start=${base_date.getTime()}`
    if (query_schedule.accounts) {
      updated_query_schedule += '&' + query_schedule.accounts.join('&account[]=')
    }
    return updated_query_schedule
  }

  render(){
    const { week_period, week_format, current_date, relative_form_position, relative_date_provided } = this.state

    return (
      <div style={{ background: '#eee', minHeight: 'calc(100vh - 200px)', alignItems: 'center', padding: '100px', width: 'calc(100% - 200px)', display: 'flex', justifyContent: 'center' }} >
        <div style={{ width: '100%' }} >
          <div style={{ position: 'relative', margin: '20px 0' }} >
            <h2 style={{ margin: '0 100px 0 10%', lineHeight: '48px' }} >{ week_period }</h2>
            <div style={{ position: 'absolute', top: '0', right: '0', width: '100px' }} >
              <IconButton onClick={ (e:any) => this.handlePrev(e) } ><ArrowBackIosIcon /></IconButton>
              <IconButton onClick={ (e:any) => this.handleNext(e) } ><ArrowForwardIosIcon /></IconButton>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }} >
            <div style={{ marginTop: 'calc(150px + 2em)', flex: '10%' }} >
              { hourlist.map( (h_list, i) => {
                return (
                  <div key={i} style={{ height: '50px', width: '100%', borderTop: '1px solid rgba(0, 0, 0, 0.1)' }} >
                    <span style={{ position: 'relative', top: '-10px', background: '#eee', padding: '.2em .5em' }} >{ h_list.text }</span>
                  </div>
                )
              } ) }
            </div>
            <div style={{ flexBasis: '90%', margin: '2em 0 0' }} >
              <div style={{ background: '#f5f5f5', display: 'flex', height: '150px', borderRadius: '16px 16px 0 0', alignItems: 'center' }} >
                { week_format.date_list.map( (date_row: any, i: number) => {
                  return (
                    <div key={i}
                    style={{
                      flex: 1, textAlign: 'center', alignItems: 'center', justifyContent: 'center',
                      color: current_date.getTime() === date_row.date_set.getTime() ? 'red': '#212121' }}
                    >
                      <div style={{ fontSize: '3.5em', fontWeight: 'lighter' }} >{ date_row.date_label }</div>
                      <div style={{ fontSize: '.875em' }} >{ date_row.day_label }</div>
                    </div>
                  )
                } ) }
              </div>
              <div style={{ display: 'flex', position: 'relative', borderRadius: '0 0 16px 16px', background: '#fff' }} >
                { week_format.date_list.map( (d_list:any, k:number) => {
                  const start_filter = new Date(d_list.date_set).getTime()
                  const end_filter = new Date(d_list.date_set.getFullYear(), d_list.date_set.getMonth(), d_list.date_set.getDate(), 23, 59).getTime()
                  return (
                    <div key={k} style={{ fontSize: '1.1em', fontWeight: 'bold', flex: 1, borderRight: week_format.date_list.length === k+1 ? 'none' : '1px solid rgba(0,0,0,.12)' }} >
                      <RenderHourShift rendered_schedules={ this.props.schedule.schedules.filter( (s:any) => (s.start_time >= start_filter && s.start_time < end_filter) || (s.end_time > start_filter && s.end_time <= end_filter) ) } hourlist={ hourlist } handleRelativeFormPosition={ this.handleRelativeFormPosition } d_list={ d_list } />
                    </div>
                  )
                } ) }
                <div style={{ position: 'absolute', display: relative_date_provided ? 'block' : 'none', top: relative_form_position.top+20, left: relative_form_position.left, width: '600px' }} >
                  <IconButton onClick={ (e) => this.setState({ relative_date_provided: null }) } style={{ position: 'absolute', right: '-20px', background: '#eee', top: '-20px' }} ><CloseIcon /></IconButton>
                  <ShiftForm
                    current_account={ this.props.account.current_account }
                    existing_data={
                      {
                        start_time: relative_date_provided ? new Date(relative_date_provided) : new Date(),
                        end_time: relative_date_provided ? new Date(relative_date_provided.setHours( new Date(relative_date_provided).getHours() + 1 )) : new Date(),
                        shift_date: relative_date_provided ? new Date(relative_date_provided) : new Date(),
                        notes: '',
                        shift_type: 'general',
                        id: null
                      }
                    }
                    submit_type={ 'Create' }
                    retrieveScheduleAction={ this.props.retrieveScheduleAction }
                    query_schedule={ this.handleQueryString() }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
}

const mapStateToProps = (state:object) => {
  return state
}

export default connect(mapStateToProps, { retrieveScheduleAction })(Calendar)