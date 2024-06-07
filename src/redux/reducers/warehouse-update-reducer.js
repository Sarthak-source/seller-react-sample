import * as actionTypes from '../action-types/action-types';

const initialState = {
    productBatches: {},
    productMFGbatches: {},
    warehouses: {},
    inbounds: {},
    outbounds: {},
};

const warehouseReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_PRODUCT_BATCH:
            return {
                ...state,
                productBatches: action.payload,
            };
        case actionTypes.UPDATE_PRODUCT_MFG_BATCH:
            return {
                ...state,
                productMFGbatches: action.payload,
            };
        case actionTypes.UPDATE_WAREHOUSE:
            return {
                ...state,
                warehouses: action.payload,
            };
        case actionTypes.UPDATE_INBOUND:
            return {
                ...state,
                inbounds: action.payload,
            };
        case actionTypes.UPDATE_OUTBOUND:
            return {
                ...state,
                outbounds: action.payload,
            };
        default:
            return state;
    }
};

export default warehouseReducer;
