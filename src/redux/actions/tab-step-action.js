import * as actionTypes from '../action-types/action-types';

export const selectDashboardTab = (tab) => ({
    type: actionTypes.DASHBOARD_TAB_STATE,
    payload: tab
});

export const selectTenderStep = (step) => ({
    type: actionTypes.TENDER_STEP_STATE,
    payload: step
});

export const selectOrderStep = (step) => ({
    type: actionTypes.ORDER_STEP_STATE,
    payload: step
});

export const selectPaymentStep = (step) => ({
    type: actionTypes.PAYMENT_STEP_STATE,
    payload: step
});

export const selectDispatchStep = (step) => ({
    type: actionTypes.DISPATCH_STEP_STATE,
    payload: step
});