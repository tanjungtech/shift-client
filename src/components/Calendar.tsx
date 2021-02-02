import React from 'react'
import { connect } from 'react-redux'

// import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

import { retrieveScheduleAction } from './../stores/actions/scheduleAction'
import { formatIntoWeekLabel, getMonDuringWeek } from './../utils'
import RenderHourShift from './sections/RenderHourShift'

interface IProps {
  schedule: any;
  history: any;
  location: object;
  match: object;
  retrieveScheduleAction: any;
}

interface IState {
  week_format: any;
  week_period: any;
  current_date: any;
  base_date: any;
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
      week_format, current_date, base_date,
      week_period: week_format.period_label
    }
  }

  componentDidMount = async () => {
    try {
      await this.props.retrieveScheduleAction(`start=${this.state.base_date}`)
    } catch (e) {
      alert('Failed to retrieve shift schedule')
      console.log('e', e)
    }
  }

  handleNext = async (e:any) => {
    e.preventDefault()
    const base_date = new Date(new Date(this.state.base_date).setDate(this.state.base_date.getDate()+7))
    const week_format = formatIntoWeekLabel(base_date)
    try {
      await this.props.retrieveScheduleAction(`start=${base_date}`)
      this.setState({
        base_date, week_format,
        week_period: week_format.period_label
      })
    } catch (error) {
      alert('failed to retrieve next schedule')
      console.log('error', error)
    }
  }

  handlePrev = (e:any) => {
    e.preventDefault()
    const base_date = new Date(new Date(this.state.base_date).setDate(this.state.base_date.getDate()-7))
    const week_format = formatIntoWeekLabel(base_date)
    this.setState({
      base_date, week_format,
      week_period: week_format.period_label
    })
  }

  render(){
    const { week_period, week_format, current_date } = this.state

    console.log('week_format', week_format)
    console.log('current_date', current_date)
    console.log('this.props', this.props)

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
            <div style={{ background: '#fff', flexBasis: '90%', borderRadius: '16px', overflow: 'hidden', margin: '2em 0 0' }} >
              <div style={{ background: '#f5f5f5', display: 'flex', height: '150px', alignItems: 'center' }} >
                { week_format.date_list.map( (date_row: any, i: number) => {
                  return (
                    <div key={i}
                    style={{
                      flex: 1, textAlign: 'center', alignItems: 'center', justifyContent: 'center', borderRight: week_format.date_list.length === i+1 ? 'none': '1px solid #e0e0e0',
                      color: current_date.getTime() === date_row.date_set.getTime() ? 'red': '#212121' }}
                    >
                      <div style={{ fontSize: '3.5em', fontWeight: 'lighter' }} >{ date_row.date_label }</div>
                      <div style={{ fontSize: '.875em' }} >{ date_row.day_label }</div>
                    </div>
                  )
                } ) }
              </div>
              <div style={{ display: 'flex' }} >
                { week_format.date_list.map( (d_list:any, k:number) => {
                  return (
                    <div key={k} style={{ fontSize: '1.1em', fontWeight: 'bold', flex: 1, borderRight: week_format.date_list.length === k+1 ? 'none' : '1px solid rgba(0,0,0,.12)' }} >
                      <RenderHourShift rendered_schedules={ this.props.schedule.schedules } hourlist={ hourlist } />
                    </div>
                  )
                } ) }
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