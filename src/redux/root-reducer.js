import { combineReducers } from 'redux';
import orderReducer from './reducers/order-reducer';
import userReducer from './reducers/user-reducer';

const rootReducer = combineReducers({
  orders: orderReducer,
  user: userReducer,
});


export default rootReducer;
