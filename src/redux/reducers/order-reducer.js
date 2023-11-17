import * as actionTypes from '../action-types/action-types';

const initialState = {
  selectedOrder: null,
  error: null,
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SELECT_ORDER:
      return {
        ...state,
        selectedOrder: action.payload,
      };
    default:
      return state;
  }
};

export default orderReducer;
