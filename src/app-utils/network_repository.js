import { toast } from 'react-toastify';

import { ApiAppConstants, auth } from './api-constants';
import NetworkAxios from './network_axios';

const sellerId = localStorage.getItem('sellerID') ?? "54";
const selectedMillId = localStorage.getItem('selectedMillId') ?? '';

const NetworkRepository = {

  sellerTender: async (page, status) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.sellerTender}?seller=${sellerId}&status=${status}&page=${page}&mill_pk=${localStorage.getItem('selectedMillId') || ''}`,
        header: { authorization: auth }
      });

      console.log('Seller Tender Response:', apiResponse);

      if (apiResponse.error_description !== null) {
        // Assuming you're using a toast notification library
        toast.success(apiResponse.error_description);
      }
      return apiResponse;
    } catch (error) {
      console.error('Error:', error);

      // Assuming you're using a toast notification library
      toast.error(error.detail);

      throw error.detail;
    }
  },


  getPayments: async (date = '', page = 1, status = '') => {
    try {
      let paymentsUrl = `${ApiAppConstants.payments}?seller=${sellerId}&mill_pk=${selectedMillId ?? ''}&page=${page}&status=${status}`;

      if (date !== '') {
        paymentsUrl = `${ApiAppConstants.payments}?seller=${sellerId}&mill_pk=${selectedMillId ?? ''}&page=${page}&date=${date}&status=${status}`;
      }

      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: paymentsUrl,
        header: { authorization: auth },
      });

      console.log('Payment Response:', apiResponse.data);

      return apiResponse;
    } catch (error) {
      console.error('Error:', error);
      throw error.toString();
    }
  },

  allOrders: async (status, page) => {
    try {
      const ordersUrl = `${ApiAppConstants.orderListView}?seller=${sellerId}&status=${status}&page=${page}&mill_pk=${selectedMillId || ''}`;

      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: ordersUrl,
        header: { authorization: auth },
      });

      console.log('Orders Response:', apiResponse.data);

      return apiResponse;
    } catch (error) {
      console.error('Error:', error);
      throw error.toString();
    }
  },

  deliveryOrders: async ( page, text ) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: text !== ''
          ? `${ApiAppConstants.deliveryOrders}?seller=${sellerId}&characters=${text}`
          : `${ApiAppConstants.deliveryOrders}?seller=${sellerId}&page=${page}&mill_pk=${selectedMillId || ''}`,
        header: { authorization: auth },
      });

      console.log('Delivery Orders Response:', apiResponse.data);

      return apiResponse;
    } catch (error) {
      console.error('Error:', error);
      throw error.toString();
    }
  },
}


export default NetworkRepository;


