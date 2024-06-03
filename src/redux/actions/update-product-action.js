import * as actionTypes from '../action-types/action-types';

export const selectProductData = (state) => ({
  type: actionTypes.PRODUCT_DATA_UPDATE,
  payload: state
});
