import { combineReducers } from 'redux';
import user from './user'
import house from './house'
import global from './global'

export default combineReducers({ user, house, global })
