import { createStore, applyMiddleware } from 'redux'
import rootReducers from '../stores/reducers/rootReducers'
import thunk from 'redux-thunk'

export default createStore(rootReducers, applyMiddleware(thunk))