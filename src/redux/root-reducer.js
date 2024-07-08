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
import warehouseReducer from './reducers/warehouse-update-reducer';

// Combine all reducers into a root reducer
const rootReducer = combineReducers({
  orders: orderReducer, // Reducer for managing orders
  user: userReducer, // Reducer for managing user state
  mill: millReducer, // Reducer for managing mill data
  search: searchReducer, // Reducer for search functionality
  traders: traderReducer, // Reducer for managing traders
  stateRefreash: stateRefreshReducer, // Reducer for state refresh logic
  tabSteps: tabStepReducer, // Reducer for managing tab steps
  fullScreen: fullScreenReducer, // Reducer for managing full screen state
  storeState: storeReducer, // Reducer for managing store state
  storeSummaryState: storeSummaryReducer, // Reducer for store summary
  toggleState: toggleReducer, // Reducer for managing toggle state
  loadingInstructionScreenState: loadingInstructionScreenReducer, // Reducer for loading instruction screen state
  sellerUpdate: sellerUpdateReducer, // Reducer for seller updates
  productUpdate: sellerProductReducer, // Reducer for product updates
  warehouseUpdate: warehouseReducer, // Reducer for warehouse updates
});

export default rootReducer;
