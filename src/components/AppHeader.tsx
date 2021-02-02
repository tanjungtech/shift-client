import React from 'react'
import { withRouter, RouteComponentProps, NavLink } from "react-router-dom"

interface IProps {
  history: any;
  readonly location: object;
  readonly match: object;
}

type navlink = {
  to: string;
  style: any;
}

const navlink_style:any = {
  textDecoration: 'none',
  color: '#212121',
  padding: '.8em 1.2em'
}

const base_urls: string[] = [ '/', '' ]

class AppHeader extends React.Component<IProps&RouteComponentProps, navlink> {
  
  render(){

    console.log(this.props)
    const { pathname } = this.props.location

    console.log('pathname', pathname.slice(1) )

    return (
     	<div style={{ position: 'fixed', zIndex: 999, top: 0, right: 0, height: '60px', left: 0, background: '#fff', boxShadow: '0 3px 5px 2px rgba(0,0,0,.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 100px' }} >
        <div style={{ fontSize: '1.25em', fontWeight: 'bold' }} >{ pathname && base_urls.indexOf(pathname) < 0 ? pathname.slice(1).toUpperCase() : 'HOME' }</div>
        {
          pathname && base_urls.indexOf(pathname) < 0&&
          <div style={{ display: 'inline-flex' }} >
            <NavLink<navlink> to={'/calendar'} style={navlink_style} >Calendar</NavLink>
            <NavLink<navlink> to={'/shift'} style={navlink_style} >Shift</NavLink>
          </div>
        }
      </div>
    )
  }
  
}

export default withRouter(AppHeader)