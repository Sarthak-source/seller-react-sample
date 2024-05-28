import * as actionTypes from '../action-types/action-types';

const initialState = {
    selectedSeller: null,
  error: null,
};

const sellerUpdateReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SELLER_DATA_UPDATE:
      return {
        ...state,
        selectedSeller: action.payload,
      };
    default:
      return state;
  }
};

export default sellerUpdateReducer;