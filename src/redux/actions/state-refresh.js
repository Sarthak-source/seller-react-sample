import * as actionTypes from '../action-types/action-types';

export const selectState = (state) => ({
  type: actionTypes.STATE_REFRESH,
  payload: state
});
