import React from 'react'
import { connect } from 'react-redux'

import Divider from '@material-ui/core/Divider'

import { retrieveScheduleAction } from './../stores/actions/scheduleAction'
import { formatIntoDate } from './../utils'

interface IProps {
  history: any;
  location: object;
  match: object;
  retrieveScheduleAction: any;
}

interface IState {
  schedules: any;
}

class Shift extends React.Component<IProps, IState> {
  constructor(props : IProps){
    super(props)

    this.state = {
      schedules: null
    }
  }

  componentDidMount = () => {
    this.props.retrieveScheduleAction(10, 0)
  }
  
  render(){
    return (
      <div style={{ background: '#eee', minHeight: 'calc(100vh - 200px)', padding: '100px 250px', width: 'calc(100% - 500px)' }} >
        <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', margin: '2em 0' }} >
          <div style={{ padding: '1em 2.4em', background: '#f5f5f5'}} >
            <h2>My Shift</h2>
          </div>
          <Divider />
          <div style={{ padding: '1em 2.4em' }}>
            <div style={{ margin: '1em 0' }} >
              <div style={{ fontSize: '1.1em', fontWeight: 'bold' }} >
                { formatIntoDate(new Date()) }
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

export default connect(mapStateToProps, { retrieveScheduleAction })(Shift)