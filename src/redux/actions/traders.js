// traderActions.js
import NetworkRepository from 'src/app-utils/network_repository';
import * as actionTypes from '../action-types/action-types';

export const fetchTraderDataStart = () => ({
  type: actionTypes.FETCH_TRADER_DATA_START,
});

export const fetchTraderDataSuccess = (data) => ({
  type: actionTypes.FETCH_TRADER_DATA_SUCCESS,
  payload: data,
});

export const fetchTraderDataFailure = (error) => ({
  type: actionTypes.FETCH_TRADER_DATA_FAILURE,
  payload: error,
});

export const updateTraderData = (data) => ({
  type: actionTypes.TRADER_DATA_UPDATE,
  payload: data,
});

export const fetchTraderData = (selectedUserId) => async (dispatch) => {

  dispatch(fetchTraderDataStart());

  try {
    const response = await NetworkRepository.sellerTraders(selectedUserId);
    dispatch(fetchTraderDataSuccess(response));
  } catch (error) {
    dispatch(fetchTraderDataFailure(error.message));
  }
};
