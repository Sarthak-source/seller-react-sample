import { combineReducers } from 'redux';
import fullScreenReducer from './reducers/full-screen-reducer';
import loadingInstructionScreenReducer from './reducers/loading-instruction-reducer';
import millReducer from './reducers/mill-reducer';
import orderReducer from './reducers/order-reducer';
import searchReducer from './reducers/search-reducer';
import sellerUpdateReducer from './reducers/seller-update-reducer';
import stateRefreshReducer from './reducers/state-refresh-reducer';
import storeReducer from './reducers/store-state-reducer';
import storeSummaryReducer from './reducers/store-summary-reducer';
import tabStepReducer from './reducers/tab-step-reducer';
import toggleReducer from './reducers/toggle-reducer';
import traderReducer from './reducers/trader-reducer';
import sellerProductReducer from './reducers/update-products-reducer';
import userReducer from './reducers/user-reducer';

const rootReducer = combineReducers({
  orders: orderReducer,
  user: userReducer,
  mill: millReducer,
  search: searchReducer,
  traders: traderReducer,
  stateRefreash: stateRefreshReducer,
  tabSteps: tabStepReducer,
  fullScreen: fullScreenReducer,
  storeState: storeReducer,
  storeSummaryState: storeSummaryReducer,
  toggleState: toggleReducer,
  loadingInstructionScreenState: loadingInstructionScreenReducer,
  sellerUpdate: sellerUpdateReducer,
  productUpdate:sellerProductReducer,
});


export default rootReducer;
