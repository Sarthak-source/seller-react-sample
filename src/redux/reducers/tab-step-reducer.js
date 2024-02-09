// reducers/tabStepReducer.js

import * as actionTypes from '../action-types/action-types';

const initialState = {
    dashboardTabState: 0,
    tenderStepState: 0,
    orderStepState: 0,
    paymentStepState: 0,
    dispatchStepState: 0,
};

const tabStepReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.DASHBOARD_TAB_STATE:
            return {
                ...state,
                dashboardTabState: action.payload,
            };
        case actionTypes.TENDER_STEP_STATE:
            return {
                ...state,
                tenderStepState: action.payload,
            };
        case actionTypes.ORDER_STEP_STATE:
            return {
                ...state,
                orderStepState: action.payload,
            };
        case actionTypes.PAYMENT_STEP_STATE:
            return {
                ...state,
                paymentStepState: action.payload,
            };
        case actionTypes.DISPATCH_STEP_STATE:
            return {
                ...state,
                dispatchStepState: action.payload,
            };
        default:
            return state;
    }
};

export default tabStepReducer;
