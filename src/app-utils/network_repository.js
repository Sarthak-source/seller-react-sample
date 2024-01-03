import { toast } from 'react-toastify';

import store from '../redux/configure-store';
import { ApiAppConstants, auth, ip } from './api-constants';
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

  sellerConfig: async () => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url:
          `${ApiAppConstants.sellerConfig}?seller=${sellerId}`,
        header: { authorization: auth },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
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

      console.log('datadata', data)

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

  orderPostView: async (
    price,
    qty,
    freight_rate,
    remark,
    tender,
  ) => {
    try {

      const data = new URLSearchParams();

      data.append("price", price.toString());
      data.append("freight_rate", freight_rate.toString());
      data.append("qty", qty.toString());
      data.append("trader", '172');
      data.append("tender", tender.toString());
      data.append("remark", remark);

      const apiResponse = await NetworkAxios.postAxiosHttpMethod({

        url: `${ApiAppConstants.orderPostView}`,
        data,
        header: {
          'authorization': auth
        },

      }
      );

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
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


  updateOrderDetails: async (
    orderId,
    poNumber,
    invoicePrefix,
    lutNum,
    remark,
    eTransporter) => {

    try {

      const data = new URLSearchParams();
      data.append("order_pk", orderId.toString());
      data.append("lut_num", lutNum.toString());
      data.append("invoice_prefix", invoicePrefix.toString());
      data.append("remark", remark);
      data.append("purchaseorder_num", poNumber.toString());
      data.append("e_transporter", eTransporter);


      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: `${ApiAppConstants.updateOrderDetails}`,
        data: data.toString(),
        header: {
          'authorization': auth
        },
      });

      console.log('\x1b[97m Response :', apiResponse);

      return apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  transporterGstinListView: async (gstIn) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url:
          `${ApiAppConstants.transporterGstinListView}?gstin=${gstIn}`,
        header: {
          'authorization': auth
        },
      });
      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  gstinListView: async (gstIn) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url:
          `${ApiAppConstants.gstinListView}?trader=${sellerId}&gstin=${gstIn}`,
        header: {
          'authorization': auth
        },
      });

      console.log('apiResponseapiResponseapiResponse', apiResponse)
      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  addressListPost: async (
    { name,
      gstin,
      pin,
      address,
      location }) => {
    try {
      const data = new URLSearchParams();

      data.append("trader", sellerId.toString());
      data.append("name", name.toString());
      data.append("gstin", gstin.toString());
      data.append("pin", pin.toString());
      data.append("address", address.toString());
      data.append("location", location.toString());

      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: `$${ApiAppConstants.addressListPost}`,
        header: {
          'authorization': auth
        },
        data: data.toString(),
      });
      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  removeFlexibleProducts: async (orderId) => {
    try {
      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url:
          `${ApiAppConstants.removeFlexibleProducts}`,
        header: {
          'authorization': auth
        },
        data: { "order": orderId }
      });
      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  addressListView: async (gstIn) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url:
          `${ApiAppConstants.addressList}?gstin__gstin=${gstIn}`,
        header: {
          'authorization': auth
        },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  eoiSetting2: async (
    orderId,
    boe,
    documents,
    supType,
    subSupType,
    docType,
  ) => {
    try {


      const data = JSON.stringify({
        'boe_num': boe,
        'document': documents,
        'supply_type': supType,
        'sub_supply_type': subSupType,
        'document_type': docType
      });

      console.log('eoiSetting212', data, {
        'boe_num': boe,
        'document': documents,
        'supply_type': supType,
        'sub_supply_type': subSupType,
        'document_type': docType
      })

      const apiResponse =
        await NetworkAxios.putAxiosHttpMethod({
          url: `${ApiAppConstants.orderUpdate}${orderId}/`,
          header: { 'authorization': auth },
          data,
          ContentType: 'application/json'
        });
      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },


  mailDoInvoice: async (invoices, id) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: invoices
          ? `http://${ip}/${ApiAppConstants.mailInvoice}${id}`
          : `http://${ip}/${ApiAppConstants.mailDoc}${id}`,
        header: { 'authorization': auth },
        full: false,
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  getPdf: async (url) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url,
        header: { 'authorization': auth },
        full: false,
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  tenderUpdate: async (
    tenderHeadId, status) => {
    try {
      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url:
          `${ApiAppConstants.tenderUpdateStatus}`,
        data: {
          "tender_head": tenderHeadId,
          "status": status,
          "user_id": sellerId
        },
        header: { 'authorization': auth },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  orderUpdateStatus: async (
    orderId, status) => {
    try {
      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url:
          `${ApiAppConstants.orderUpdateStatus}`,
        data: {
          "order_id": orderId,
          "status": status,
          "user_id": sellerId,
        },
        header: { 'authorization': auth },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  paymentHeadUpdateStatus: async (
    paymentID, status) => {
    try {
      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url:
          `${ApiAppConstants.paymentHeadUpdateStatus}`,
        data: {
          "status": status,
          "payment_head_pk": paymentID,
          "user_id": sellerId
        },
        header: { 'authorization': auth },
      });
      console.log('paymentHeadUpdateStatus', await apiResponse)
      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },


  generateInternalDO: async (
    mill,
    product,
    vehicleNo,
    doType,
    qty,
  ) => {
    try {
      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url:
          `${ApiAppConstants.generateInternalDO}`,
        header: { 'authorization': auth },
        data: {
          "mill": mill,
          "product": product,
          "qty": qty,
          "vehicle_num": vehicleNo,
          "dotype": doType
        }
      }
      );
      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  loadingInstructionPost: async (
    qty,
    trader,
    gstin,
    order_head,
    vehicle_num,
    address,
    billing_gstin,
    billing_address,
    product,
    lr_number) => {
    try {
      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url:
          `${ApiAppConstants.loadingInstructionPost}`,
        header: { 'authorization': auth },
        data: {
          "order_head": order_head,
          "qty": qty,
          "vehicle_num": vehicle_num,
          "trader": trader ?? sellerId,
          "gstin": gstin,
          "address": address,
          "billing_gstin": billing_gstin,
          "billing_address": billing_address,
          "product": product,
          "lr_number": lr_number,
        },
      });
      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  vehicleExistCheck2: async (id) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url:
          `${ApiAppConstants.vehicle2}?vehicle=${id}`,
        header: { 'authorization': auth },
      })
      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  }

}


export default NetworkRepository;


