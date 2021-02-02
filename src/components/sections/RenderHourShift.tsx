import React from 'react'

interface RenderHourProps {
  rendered_schedules: any[];
  hourlist: any[];
}

const RenderHourShift: React.FC<RenderHourProps> = (props) => {

  return (
    <React.Fragment>
      {props.hourlist.map( (_hour, i: number) => {
        return (
          <div key={i} style={{ height: '50px', borderTop: '1px solid rgba(0, 0, 0, 0.12)' }} >
          </div>
        )
      } )}
    </React.Fragment>
  )
}

export default RenderHourShift