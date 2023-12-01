import * as actionTypes from '../action-types/action-types';

export const selectUser = (user) => ({
  type: actionTypes.SELECT_USER,
  payload: user
});

export const selectTempUser = (user) => ({
  type: actionTypes.SELECT_TEMP_USER,
  payload: user
});
