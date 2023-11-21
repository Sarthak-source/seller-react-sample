import { toast } from 'react-toastify';

import store from '../redux/configure-store';
import { ApiAppConstants, auth } from './api-constants';
import NetworkAxios from './network_axios';


function selectedUser() {
  const state = store.getState();
  if (state.user && state.user.selectedUser) {
    console.log('current user', state.user.selectedUser.id);
    return state.user.selectedUser.id;
  }
  console.error('User or selectedUser not found in state');
  return null;
}


selectedUser()

const sellerId = selectedUser() ?? "85";
const selectedMillId = localStorage.getItem('selectedMillId') ?? '';

const NetworkRepository = {
  userSignup: async (name, password, number) => {
    try {
      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: `${ApiAppConstants.signup}`,
        data: { "name": name, "password": password, "phone_number": number },
        header: { authorization: auth },
      });

      console.log('\x1b[97m Response :', apiResponse);

      return apiResponse;
    } catch (error) {
      alert(error.toString());
      return error.toString();
    }
  },

  userLogin: async (number) => {
    try {
      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: `${ApiAppConstants.otp}`,
        data: { "mobile_number": number },
        header: { authorization: auth },
      });

      console.log('\x1b[97m Response :', apiResponse);

      return apiResponse;
    } catch (error) {
      alert(error.toString());
      return error.toString();
    }
  },

  verifyLogin: async (number, otp) => {
    try {
      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: `${ApiAppConstants.verifyOTP}`,
        data: { "mobile_number": number, "otp": otp },
        header: { authorization: auth },
      });
      console.log('\x1b[97m Response :', apiResponse);

      return apiResponse;
    } catch (error) {
      return error.toString();
    }
  },

  retry: async (number) => {
    try {
      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: `${ApiAppConstants.resendOTP}`,
        data: { "mobile_number": number, "retrytype": "text" },
        header: { authorization: auth },
      });
      console.log(`Response :`, apiResponse);
      return apiResponse;
    } catch (error) {
      return error.toString();
    }
  },

  checkSeller: async (number) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.checkSeller}?username=${number}`,
        header: { authorization: auth },
      });
      console.log('Seller Check Response:', apiResponse);
      return apiResponse;
    } catch (error) {
      return error.toString();
    }
  },


  sellerTender: async (page, status) => {
    try {
      console.log('sellerId',sellerId)
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
      throw error.toString();
    }
  },


  getPayments: async (date, page, status) => {
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

  deliveryOrders: async (page, text) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: text !== '' ? `${ApiAppConstants.deliveryOrders}?seller=${sellerId}&characters=${text}` : `${ApiAppConstants.deliveryOrders}?seller=${sellerId}&page=${page}&mill_pk=${selectedMillId || ''}`,

        header: { authorization: auth },
      });

      console.log('Delivery Orders Response:', apiResponse);

      return apiResponse;
    } catch (error) {
      console.error('Error:', error);
      throw error.toString();
    }
  },

  book: async (page, text, status) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: text !== '' ? `${ApiAppConstants.loadingInstructions}?seller=${sellerId}&characters=${text}` : `${ApiAppConstants.loadingInstructions}?seller=${sellerId}&page=${page}&mill_pk=${selectedMillId || ''}&status=${status}`,

        header: { authorization: auth },
      });

      console.log('Delivery Orders Response:', apiResponse);

      return apiResponse;
    } catch (error) {
      console.error('Error:', error);
      throw error.toString();
    }
  },

  invoicesReport: async (page, text, status) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: text !== '' ? `${ApiAppConstants.invoices}?seller=${sellerId}&characters=${text}` : `${ApiAppConstants.invoices}?seller=${sellerId}&page=${page}&mill_pk=${selectedMillId || ''}&status=${status}`,

        header: { authorization: auth },
      });

      console.log('Delivery Orders Response:', apiResponse);

      return apiResponse;
    } catch (error) {
      console.error('Error:', error);
      throw error.toString();
    }
  },

  orderSummary: async (orderID) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.order}/${orderID}`,
        headers: { authorization: auth }
      });

      const orderSeller = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.orderSeller}?order=${orderID}`,
        headers: { authorization: auth }
      });

      // Assuming NetworkAxios returns JSON responses
      const order = apiResponse.body;
      const seller = orderSeller.body;

      console.log('Order Summary Response:', orderSeller);

      return {
        order,
        orderSeller: seller
      };
    } catch (error) {
      console.error('Error:', error);

      throw error.toString();
    }
  },

  tenderDetails: async (tender) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.tender}${tender}`,
        header: { authorization: auth },
      });

      console.log('Tender Details Response:', apiResponse);

      return apiResponse;
    } catch (error) {
      console.error('Error:', error);
      throw error.toString();
    }
  },

  tenderOrder: async (tenderId) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.order}?tender_head__id=${tenderId}`,
        header: { authorization: auth },
      });

      console.log('Tender Order Response:', apiResponse);

      return apiResponse;
    } catch (error) {
      console.error('Error:', error);
      throw error.toString();
    }
  },

  sellerTraders: async () => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.sellerTraders}?seller=${sellerId}`,
        header: { authorization: auth },
      });

      console.log('Seller Tender Response:', apiResponse);

      return apiResponse;
    } catch (e) {
      console.error('Error:', e);

      const er = e;
      return er.detail.toString();
    }
  }

}


export default NetworkRepository;


