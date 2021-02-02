import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'

import AppHeader from './components/AppHeader'
import Home from './components/Home'
import Calendar from './components/Calendar'
import Shift from './components/Shift'

const App: React.FC = () => {
  return (
    <Router>
      <section className="section">
        <header><AppHeader /></header>
        <div className="container">
          <Switch>
            <Route exact path="/" component={ Home } />
            <Route exact path="/calendar" component={ Calendar } />
            <Route exact path="/shift" component={ Shift } />
          </Switch>
        </div>
      </section>
    </Router>
  );
}

export default App;
