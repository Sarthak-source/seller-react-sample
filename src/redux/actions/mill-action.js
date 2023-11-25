import * as actionTypes from '../action-types/action-types';

export const selectMill = (mill) => ({
  type: actionTypes.SELECT_MILL,
  payload: mill
});
