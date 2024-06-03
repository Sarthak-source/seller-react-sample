import * as actionTypes from '../action-types/action-types';

const initialState = {
    selectedProducts: null,
    error: null,
};

const sellerProductReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.PRODUCT_DATA_UPDATE:
            return {
                ...state,
                selectedProducts: action.payload,
            };
        default:
            return state;
    }
};

export default sellerProductReducer;