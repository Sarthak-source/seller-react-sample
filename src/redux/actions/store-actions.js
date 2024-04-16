import * as actionTypes from '../action-types/action-types';

export const storeState = (state, fromVehicleInward) => ({
  type: actionTypes.STORE_STATE,
  payload: { state, fromVehicleInward } // Include fromVehicleInward in payload
});

export const storeSummaryState = (state) => ({
  type: actionTypes.STORE_SUMMARY_STATE,
  payload: state,  // Include fromVehicleInward in payload
});