import * as actionTypes from '../action-types/action-types';

export const selectSellerData = (state) => ({
  type: actionTypes.SELLER_DATA_UPDATE,
  payload: state
});
