import React from 'react'

import Tooltip from '@material-ui/core/Tooltip'

import { formatIntoStartAndEnd } from './../../utils'

interface RenderHourProps {
  rendered_schedules: any[];
  hourlist: any[];
  handleRelativeFormPosition: any;
  d_list: any;
}

const hour = 1000 * 60 * 60

const RenderHourShift: React.FC<RenderHourProps> = (props) => {
  
  const handleNewShift = (e: any, d_list: any) => {
    props.handleRelativeFormPosition({ top: e.nativeEvent.layerY, left: '20%', day: d_list, hour: e.nativeEvent.layerY/51 })
  }

  return (
    <div style={{ position: 'relative', boxSizing: 'border-box' }} className='cal-wrapper'>
      { props.hourlist.map( (_hour, i: number) => {
        return (
          <div key={i} style={{ height: '50px', borderTop: '1px solid rgba(0, 0, 0, 0.12)' }} onClick={(e: any) => handleNewShift(e, props.d_list)} >
          </div>
        )
      } )}
      {props.rendered_schedules.length ?
        props.rendered_schedules.map( (s: any, i: number) => {
          const height = ((parseInt(s.end_time) - parseInt(s.start_time))/hour)*51
          const s_date_object = new Date(s.start_time)
          const s_hrs = s_date_object.getHours()
          const s_mins = s_date_object.getMinutes()
          const duration = formatIntoStartAndEnd(s.start_time, s.end_time)
          return (
            <div key={i} style={{ position: 'absolute', display: 'flex', alignItems: 'center', right: 0, top: (s_hrs+s_mins/60)*51, left: 0, height: height, 
            border: '1px solid #3178c6',
            background: s.shift_type === 'published' ? '#3178c6' : '#fff',
            color: s.shift_type === 'published' ? '#fff' : '#3178c6',
            // background: '#bdbdbd',
            }} >
              <Tooltip title={
                <React.Fragment>
                  <div>
                    <div>{ s.account_id.name }</div>
                    <div style={{ fontWeight: 'lighter', fontSize: '.875em' }} >{ duration.start } to { duration.end }</div>
                    <div style={{ fontSize: '1.5em', margin: '1em 0' }} >{ s.notes }</div>
                  </div>
                </React.Fragment>
              } aria-label="schedule" placement="bottom">
                <div style={{ position: 'absolute', height: height, display: 'flex', textAlign: 'left', padding: '.5em', justifyContent: 'center', flexDirection: 'column' }} >
                  <div>{ s.account_id.name }</div>
                  { height > 51 &&
                    <div style={{ fontWeight: 'lighter', fontSize: '.875em' }} >{ duration.start } to { duration.end }</div>
                  }
                </div>
              </Tooltip>
            </div>
          )
        } )
        :
        null
      }
    </div>
  )
}

export default RenderHourShift