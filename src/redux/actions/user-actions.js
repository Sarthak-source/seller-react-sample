import * as actionTypes from '../action-types/action-types';

export const selectUser = (user) => ({
  type: actionTypes.SELECT_USER,
  payload: user
});
