// store/index.js
import {createStore} from 'redux'
import { userReducer } from './userReducer';

// Create the Redux store
const store = createStore(userReducer);

export default store;
