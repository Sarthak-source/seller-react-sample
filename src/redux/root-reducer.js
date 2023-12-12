import { combineReducers } from 'redux';
import millReducer from './reducers/mill-reducer';
import orderReducer from './reducers/order-reducer';
import searchReducer from './reducers/search-reducer';
import traderReducer from './reducers/trader-reducer';
import userReducer from './reducers/user-reducer';

const rootReducer = combineReducers({
  orders: orderReducer,
  user: userReducer,
  mill: millReducer,
  search: searchReducer,
  traders:traderReducer,
});


export default rootReducer;
