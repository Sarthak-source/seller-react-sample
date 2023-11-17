import * as actionTypes from '../action-types/action-types';

export const selectOrder = (order) => ({
  type: actionTypes.SELECT_ORDER,
  payload: order
});
