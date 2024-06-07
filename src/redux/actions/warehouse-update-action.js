import * as actionTypes from '../action-types/action-types';

  
  export const updateProductBatch = (productBatch) => ({
    type: actionTypes.UPDATE_PRODUCT_BATCH,
    payload: productBatch,
  });
  
  export const updateProductMFGbatch = (productMFGbatch) => ({
    type: actionTypes.UPDATE_PRODUCT_MFG_BATCH,
    payload: productMFGbatch,
  });
  
  export const updateWarehouse = (warehouse) => ({
    type: actionTypes.UPDATE_WAREHOUSE,
    payload: warehouse,
  });
  
  export const updateInbound = (inbound) => ({
    type: actionTypes.UPDATE_INBOUND,
    payload: inbound,
  });
  
  export const updateOutbound = (outbound) => ({
    type: actionTypes.UPDATE_OUTBOUND,
    payload: outbound,
  });
  