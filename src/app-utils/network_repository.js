import { toast } from 'react-toastify';

import store from '../redux/configure-store';
import { ApiAppConstants, auth } from './api-constants';
import NetworkAxios from './network_axios';

const state = store.getState();

function selectedUser() {
  if (state.user && state.user.selectedUser) {
    console.log('current user', state.user.selectedUser.id);
    return state.user.selectedUser.id;
  }
  console.error('User or selectedUser not found in state');
  return null;
}


const sellerId = selectedUser() ?? "85";


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


  sellerTender: async (page, status, millId) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.sellerTender}?seller=${sellerId}&status=${status}&page=${page}&mill_pk=${millId || ''}`,
        header: { authorization: auth }
      });

      console.log('Seller Tender Response:', apiResponse);

      if (apiResponse.error_description !== null) {
        toast.success(apiResponse.error_description);
      }
      return apiResponse;
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.detail);
      throw error.toString();
    }
  },


  getPayments: async (date, page, status, millId) => {
    try {
      let paymentsUrl = `${ApiAppConstants.payments}?seller=${sellerId}&mill_pk=${millId ?? ''}&page=${page}&status=${status}`;

      if (date !== '') {
        paymentsUrl = `${ApiAppConstants.payments}?seller=${sellerId}&mill_pk=${millId ?? ''}&page=${page}&date=${date}&status=${status}`;
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

  allOrders: async (status, page, millId) => {
    try {
      const ordersUrl = `${ApiAppConstants.orderListView}?seller=${sellerId}&status=${status}&page=${page}&mill_pk=${millId || ''}`;

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


  invoicesVehicleDetails: async (order) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.invoices}?seller=${sellerId}&page=1&order=${order}`,
        header: { authorization: auth },
      });

      console.log('invoicesVehicleDetails', apiResponse.data);

      return apiResponse;
    } catch (error) {
      console.error('Error:', error);
      throw error.toString();
    }
  },

  deliveryOrders: async (page, text, millId) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: text !== '' ? `${ApiAppConstants.deliveryOrders}?seller=${sellerId}&characters=${text}`
          : `${ApiAppConstants.deliveryOrders}?seller=${sellerId}&page=${page}&mill_pk=${millId || ''}`,

        header: { authorization: auth },
      });

      console.log('Delivery Orders Response:', apiResponse);

      return apiResponse;
    } catch (error) {
      console.error('Error:', error);
      throw error.toString();
    }
  },

  book: async (page, text, status, millId) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: text !== '' ? `${ApiAppConstants.loadingInstructions}?seller=${sellerId}&characters=${text}` :
          `${ApiAppConstants.loadingInstructions}?seller=${sellerId}&page=${page}&mill_pk=${millId || ''}&status=${status}`,

        header: { authorization: auth },
      });

      console.log('Delivery Orders Response:', apiResponse);

      return apiResponse;
    } catch (error) {
      console.error('Error:', error);
      throw error.toString();
    }
  },

  invoicesReport: async (page, text, status, millId) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: text !== '' ? `${ApiAppConstants.invoices}?seller=${sellerId}&characters=${text}&delivery_order__status=${status}` :
          `${ApiAppConstants.invoices}?seller=${sellerId}&page=${page}&mill_pk=${millId || ''}&delivery_order__status=${status}`,
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
        header: { authorization: auth },
      });

      const orderSeller = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.orderSeller}?order=${orderID}`,
        header: { authorization: auth },
      });

      // Assuming NetworkAxios returns JSON responses
      const order = apiResponse;
      const seller = orderSeller;

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
  },


  loadingInstructionDetails: async (pk) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.loadingInstructionDetails}?pk=${pk}`,
        header: { authorization: auth },
      });

      console.log('Seller Tender Response:', apiResponse);
      return apiResponse;
    } catch (e) {
      console.error('Error:', e);

      const er = e;
      return er.detail.toString();
    }
  },

  tenderPostView: async (
    mill,
    product,
    qty,
    price,
    seller,
    remark,
    traderIds,
    isExclusive,
    tenderType) => {

    try {
      const traderIdsArray = Array.isArray(traderIds) ? traderIds : [traderIds];

      const data = new URLSearchParams();
      data.append("mill", mill.toString());
      data.append("product", product.toString());
      data.append("qty", qty.toString());
      data.append("price", price.toString());
      data.append("seller", seller.toString());
      data.append("remark", remark);
      data.append("is_exclusive", isExclusive.toString());
      data.append("tender_type", tenderType);
      traderIdsArray.forEach((traderId) => {
        data.append("trader_ids", traderId);
      });

      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: `${ApiAppConstants.tenderPostView}`,
        data: data.toString(),
        header: {
          'authorization': auth
        },
      });

      console.log('\x1b[97m Response :', apiResponse);

      return apiResponse;
    } catch (error) {
      alert(error.toString());
      return error.toString();
    }
  },

  traderPostView: async (name, number) => {
    try {
      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: `${ApiAppConstants.traderPostView}`,
        data: { "name": name, "phone": number, "seller": sellerId },
        header: { authorization: auth },
      });

      console.log('\x1b[97m Response :', apiResponse);

      return apiResponse;
    } catch (error) {
      alert(error.toString());
      return error.toString();
    }
  },

  lrUpdate: async (id, lrNumber) => {
    try {
      const data = new URLSearchParams();
      data.append("lr_number", lrNumber)
      const apiResponse = await NetworkAxios.putAxiosHttpMethod({
        url: `${ApiAppConstants.lrUpdate}${id}/`,
        data: data.toString(),
        header: { authorization: auth },
      });

      console.log('\x1b[97m Response :', apiResponse);

      return apiResponse;
    } catch (error) {
      alert(error.toString());
      return error.toString();
    }
  },


}


export default NetworkRepository;


