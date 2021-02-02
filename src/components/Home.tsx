import React from 'react'

import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import api_interface from '../api_interface'

interface IProps {
  history: any;
  location: object;
  match: object;
}

interface IState {
  selected_account: any;
  account_object: any;
  account_options: string[];
}

class Home extends React.Component<IProps, IState> {
  constructor(props : IProps){
    super(props)

    this.state = {
      selected_account: '',
      account_object: null,
      account_options: []
    }
  }

  componentDidMount = async () => {
    try {
      const account_res_data:any = await api_interface.retrieveAccounts()
      console.log(account_res_data, account_res_data)
      const account_options = account_res_data.accounts.map( (account: { name: string }) => account.name )
      this.setState({
        selected_account: account_options[0],
        account_object: account_res_data.accounts,
        account_options
      })
    } catch (e) {
      console.log('error', e)
    }
  }

  handleContinue = (e: any) => {
    e.preventDefault()
    // this.props.setupAccount(this.state.selected_account)
    this.props.history.push('/calendar')
  }
  
  render(){
    
    const { selected_account, account_options } = this.state

    return (
      <div style={{ background: '#eee', display: 'flex', minHeight: 'calc(100vh - 120px)', alignItems: 'center', width: '100%', justifyContent: 'center', padding: '60px 0' }} >
        {
          account_options === null ?
          'Loading ...'
          :
          <div style={{ background: '#fff', width: '400px', padding: '1em 2.4em', borderRadius: '16px' }} >
            <h2>Choose account</h2>
            <div>
              <Select fullWidth variant='outlined' value={ selected_account } onChange={(e) => this.setState({ selected_account: e.target.value })} >
                {
                  account_options.map( (option:any, i:number) => {
                    return (
                      <MenuItem key={i} value={option} >{ option }</MenuItem>
                    )
                  } )
                }
              </Select>
            </div>
            <div style={{ textAlign: 'center', margin: '1em 0' }} >
              <Button variant='contained' color='primary' onClick={ (e) => this.handleContinue(e) } style={{ textTransform: 'capitalize', padding: '.5em 2.4em' }} >Continue</Button>
            </div>
          </div>
        }
      </div>
    )
  }
  
}

export default Home