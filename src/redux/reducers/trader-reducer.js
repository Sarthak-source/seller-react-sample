import * as actionTypes from '../action-types/action-types';

const initialState = {
  traderData: [],
  loading: false,
  error: null,
  updateTraderData: null,
};

const traderReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_TRADER_DATA_START:
      return { ...state, loading: true, error: null };

    case actionTypes.FETCH_TRADER_DATA_SUCCESS:
      return { ...state, loading: false, traderData: action.payload };

    case actionTypes.FETCH_TRADER_DATA_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case actionTypes.TRADER_DATA_UPDATE:
      return { ...state, updateTraderData: action.payload };

    default:
      return state;
  }
};

export default traderReducer;
