import { ApiAppConstants, auth, ip } from './api-constants';
import NetworkAxios from './network_axios';


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

  sellerConfig: async (sellerId) => {
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


  sellerTender: async (page, status, millId, sellerId) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.sellerTender}?seller=${sellerId}&status=${status}&page=${page}&mill_pk=${millId || ''}`,
        header: { authorization: auth }
      });

      console.log('Seller Tender Response:', apiResponse);


      return apiResponse;
    } catch (error) {
      console.error('Error:', error);
      alert(error.detail);
      throw error.toString();
    }
  },


  getPayments: async (date, page, status, millId, sellerId) => {
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

  allOrders: async (status, page, millId, sellerId) => {
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


  invoicesVehicleDetails: async (order, sellerId) => {
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

  deliveryOrders: async (page, text, millId, sellerId) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: text !== '' ? `${ApiAppConstants.deliveryOrders}?seller=${sellerId}&characters=${text}&mill_pk=${millId || ''}`
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

  book: async (page, text, status, millId, sellerId) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: text !== '' ? `${ApiAppConstants.loadingInstructions}?seller=${sellerId}&characters=${text}&mill_pk=${millId || ''}&status=${status}` :
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

  invoicesReport: async (page, text, status, millId, sellerId) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: text !== '' ? `${ApiAppConstants.invoices}?seller=${sellerId}&characters=${text}&delivery_order__status=${status}&mill_pk=${millId || ''}` :
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

  sellerTraders: async (sellerId) => {
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
    sellerId
  ) => {
    try {

      const data = new URLSearchParams();

      data.append("price", price.toString());
      data.append("freight_rate", freight_rate.toString());
      data.append("qty", qty.toString());
      data.append("trader", sellerId);
      data.append("tender", tender.toString());
      data.append("remark", remark);

      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: `${ApiAppConstants.orderPostView}`,
        data,
        header: { 'authorization': auth },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  traderPostView: async (name, number, sellerId) => {
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


  updateOrderDetails2: async (
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


      const apiResponse = await NetworkAxios.putAxiosHttpMethod({
        url: `${ApiAppConstants.orderUpdate}${orderId}/`,
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
          `${ApiAppConstants.gstinListView}?gstin=${gstIn}`,
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

  addressListPost: async (
    name,
    gstin,
    pin,
    address,
    location,
    sellerId) => {
    try {


      const data = JSON.stringify({
        "trader": sellerId,
        "name": name,
        "gstin": gstin,
        "pin": pin,
        "address": address,
        "location": location,
      },);


      console.log('addresspost', data)

      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: `${ApiAppConstants.addressListPost}`,
        header: {
          'authorization': auth
        },
        data: {
          "trader": sellerId,
          "name": name,
          "gstin": gstin,
          "pin": pin,
          "address": address,
          "location": location,
        },
      });
      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },


  updateAddress: async (
    addressPk,
    name,
    gstin,
    pin,
    address,
    location,
    sellerId) => {
    try {


      const data = JSON.stringify({
        "trader": sellerId,
        "name": name,
        "gstin": gstin,
        "pin": pin,
        "address": address,
        "location": location,
      },);


      console.log('addresspost', data)

      const apiResponse = await NetworkAxios.patchAxiosHttpMethod({
        url: `${ApiAppConstants.addressUpdate}${addressPk}`,
        header: {
          'authorization': auth
        },
        data: {
          "trader": sellerId,
          "name": name,
          "gstin": gstin,
          "pin": pin,
          "address": address,
          "location": location,
        },
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

  loadingInstructionUpdate: async ({
    orderId,
    qty,
    status,
    sellerId
  },
    gstin_other_tax,
    remaining_balance,
    credit,
  ) => {
    try {
      const data = {
        "credit": credit ?? false,
        "ids": orderId,
        "qty": qty,
        "status": status,
        "remaining_balance": remaining_balance ?? 0,
        "user_id": sellerId,
      };

      console.log('make it matter', data)

      if (gstin_other_tax !== null) {
        data.gstin_other_tax = gstin_other_tax ?? '';
      }

      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: `${ApiAppConstants.loadingInstructionUpdate}`,
        data,
        ContentType: 'application/json',
        header: {
          'authorization': auth
        },
      });

      console.log('apiResponse', apiResponse)

      // log(apiResponse['body']);
      return apiResponse;
    } catch (error) {
      // Extract error response data from Axios error object
      if (error.response) {
        console.log('Error response:', error.response.data);
        console.log('Error status:', error.response.status);
        console.log('Error headers:', error.response.headers);
      } else if (error.request) {
        console.log('No response received:', error.request);
      } else {
        console.log('Error setting up request:', error.message);
      }

      // Handle the error accordingly
      return error;
    }
  },

  loadingInstructionUpdate2: async ({
    orderId,
    qty,
    status,
    sellerId,
    gstin_other_tax,
    remaining_balance,
    credit },
  ) => {
    try {
      const data = {
        "version": '1',
        "credit": credit ?? false,
        "ids": orderId,
        "qty": qty,
        "status": status,
        "remaining_balance": remaining_balance ?? 0,
        "user_id": sellerId,
      };

      console.log('make it matter', data)

      if (gstin_other_tax !== null) {
        data.gstin_other_tax = gstin_other_tax ?? '';
      }

      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: `${ApiAppConstants.loadingInstructionUpdate}`,
        data,
        ContentType: 'application/json',
        header: {
          'authorization': auth
        },
      });

      console.log('apiResponse', apiResponse)

      // log(apiResponse['body']);
      return apiResponse;
    } catch (error) {
      // Extract error response data from Axios error object
      if (error.response) {
        console.log('Error response:', error.response.data);
        console.log('Error status:', error.response.status);
        console.log('Error headers:', error.response.headers);
      } else if (error.request) {
        console.log('No response received:', error.request);
      } else {
        console.log('Error setting up request:', error.message);
      }

      // Handle the error accordingly
      return error;
    }
  },



  orderHeadAddressUpdate: async (
    orderPk,
    shippingAddress,
    billingAddress) => {

    console.log('poster', {
      "order_head_pk": orderPk,
      "billing_address_pk": billingAddress,
      "address_pk": shippingAddress
    })


    try {
      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url:
          `${ApiAppConstants.orderHeadAddressUpdate}`,
        header: { 'authorization': auth },
        data: {
          "order_head_pk": orderPk,
          "billing_address_pk": billingAddress,
          "address_pk": shippingAddress
        }
      });

      return await apiResponse;
    } catch (e) {
      return console.log(e.toString());
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
    tenderHeadId, status, sellerId) => {
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
    orderId, status, sellerId) => {
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

  assignToTransporter: async (
    orderId,
    transporterName,
    transporterNum,
    sellerId,
  ) => {
    try {
      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url:
          `${ApiAppConstants.assignOrderToTransporter}`,
        header: { 'authorization': auth },
        data: {
          "order_pk": orderId,
          "transporter_name": transporterName,
          "transporter_num": transporterNum,
          "trader_pk": sellerId,
        }
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  paymentHeadUpdateStatus: async (
    paymentID, status, sellerId) => {
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
      });
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

      console.log('fear', {
        "order_head": order_head,
        "qty": qty,
        "vehicle_num": vehicle_num,
        "trader": trader,
        "gstin": gstin,
        "address": address,
        "billing_gstin": billing_gstin,
        "billing_address": billing_address,
        "product": product,
        "lr_number": lr_number,
      })


      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url:
          `${ApiAppConstants.loadingInstructionPost}`,
        header: { 'authorization': auth },
        data: {
          "order_head": order_head,
          "qty": qty,
          "vehicle_num": vehicle_num,
          "trader": trader,
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
  },

  vehicleCheck: async (sellerId) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url:
          `${ApiAppConstants.vehicles}${sellerId}`,
        header: { 'authorization': auth },
      })
      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  sendOtpDriver: async (
    mobile,
    vehicleNo,
    sellerId
  ) => {
    try {
      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: `${ApiAppConstants.sendOtp}`,
        header: { 'authorization': auth },
        data: {
          "mobile": mobile.toString(),
          "vehicle": vehicleNo.toString(),
          "seller_pk": sellerId
        },
      });
      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  postDriver: async (
    otp,
    name,
    mobileNo,
    drivingLicenseNo,
    hlNo,
    driverPk,
    dlFront,
    dlBack,
  ) => {

    const data = new FormData();

    data.append('otp', otp);
    data.append('name', name);
    data.append('mobile_num', mobileNo);
    data.append('dl_num', drivingLicenseNo);

    if (hlNo != null) {
      data.append('hl_num', hlNo);
    }

    if (driverPk == null) {
      data.append('dl_front', dlFront);
      data.append('dl_back', dlBack);
    } else {
      data.append('driver_pk', driverPk);
    }

    try {
      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: ApiAppConstants.postDriver,
        header: { 'authorization': auth },
        data,
      });

      return apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  vehicleDo: async (vehicle_num, sellerId) => {
    const url =
      `${ApiAppConstants.checkDOStatus}?seller=${sellerId}&vehicle_num=${vehicle_num}`;
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url,
        header: { 'authorization': auth },
      });


      return apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },


  dispatchReport: async (millPk, fromDate, toDate, invoiceType) => {
    console.log('dfsdfsdfsdfsdf', `${ApiAppConstants.dispatchReports}?mill_pk=${millPk}&from_date=${fromDate}&to_date=${toDate}&invoice_type=${invoiceType}`)
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url:
          `${ApiAppConstants.dispatchReports}?mill_pk=${millPk}&from_date=${fromDate}&to_date=${toDate}&invoice_type=${invoiceType}`,
        header: { 'authorization': auth },
      })
      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  ordersReports: async (date, millId, sellerId) => {
    try {
      const ordersUrl = `${ApiAppConstants.orderListView}?seller=${sellerId}&date=${date}&mill_pk=${millId || ''}`;

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


  productData: async (mill, product) => {
    console.log('productData', mill, product);
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url:
          `${ApiAppConstants.apiEndPoint}${ApiAppConstants.productData}?&mill=${mill}&product=${product}`,
        header: { authorization: auth },
      });


      console.log('apiResponse', apiResponse)


      return apiResponse;
    } catch (e) {
      return e.toString();
    }
  },

  getInvoiceStats: async (from, to, mill, product) => {
    console.log('count124', `${ApiAppConstants.invoiceStats}?from_date=${from}&to_date=${to}&mill=${mill}&product=${product}`)

    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url:
          `${ApiAppConstants.invoiceStats}?from_date=${from}&to_date=${to}&mill=${mill}&product=${product}`,
        header: { authorization: auth },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  getInvoiceStatsForDate: async (date, mill, product) => {
    console.log('count124', `${ApiAppConstants.invoiceStats}?date=${date}&mill=${mill}&product=${product}`)
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.invoiceStats}?date=${date}&mill=${mill}&product=${product}`,
        header: { authorization: auth },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  getRecentInvoices: async (mill, from, to, product, seller) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.recentInvoices}?&mill=${mill}&from_date=${from}&to_date=${to}&product=${product}&seller=${seller}`,
        header: { authorization: auth },
      });

      console.log('getRecentInvoicesApi', `${ApiAppConstants.recentInvoices}?&mill=${mill}&from_date=${from}&to_date=${to}&product=${product}`, apiResponse)

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  getProductDashboard: async (mill, year, month, product) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.productDashboard}?mill=${mill}&year=${year}&month=${month}&product=${product}`,
        header: { authorization: auth },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  yearDispatches: async (mill) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.yearDispatches}?mill=${mill}`,
        header: { authorization: auth },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  getUserDropdownDetails: async (seller) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.users}create/?seller=${seller}`,
        header: { authorization: auth },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  getProductDropdownDetails: async (seller) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.product}create/?seller=${seller}`,
        header: { authorization: auth },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  postUserData: async (
    name,
    sellerType,
    sellerRole,
    mills,
    phoneNumber,
    seller,
    products
  ) => {
    try {
      const data = JSON.stringify({
        'name': name,
        'seller_type': sellerType,
        'seller_role': sellerRole,
        'mills': mills,
        'phone_number': phoneNumber,
        'seller': seller,
        'products': products,
      });

      console.log('postUserData', `${ApiAppConstants.users}create/`, {
        'name': name,
        'seller_type': sellerType,
        'seller_role': sellerRole,
        'mills': mills,
        'phone_number': phoneNumber,
        'seller': seller,
        'products': products,
      }, data)


      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: `${ApiAppConstants.users}create/`,
        ContentType: 'application/json',
        header: { 'authorization': auth },
        data,
      });
      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },


  updateUserData: async (
    name,
    sellerType,
    sellerRole,
    mills,
    phoneNumber,
    seller,
    products
  ) => {
    try {
      const data = JSON.stringify({
        'name': name,
        'seller_type': sellerType,
        'seller_role': sellerRole,
        'mills': mills,
        'phone_number': phoneNumber,
        'seller': seller,
        'products': products,
      });

      console.log('postUserData', `${ApiAppConstants.users}${seller}/update/`, {
        'name': name,
        'seller_type': sellerType,
        'seller_role': sellerRole,
        'mills': mills,
        'phone_number': phoneNumber,
        'seller': seller,
        'products': products,
      }, data)


      const apiResponse = await NetworkAxios.patchAxiosHttpMethod({
        url: `${ApiAppConstants.users}${seller}/update/`,
        ContentType: 'application/json',
        header: { 'authorization': auth },
        data,
      });
      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  getUserList: async (mill, seller) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.users}?mill=${mill}&seller=${seller}`,
        header: { authorization: auth },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  createProduct: async (productType, code, seller) => {
    try {
      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: `${ApiAppConstants.product}create/`,
        data: {
          product_type: productType,
          code,
          seller
        },
        header: { authorization: auth },
      });

      return apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  getProductList: async (mill, seller) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.productsList}?mill=${mill}&seller=${seller}`,
        header: { authorization: auth },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  getAddressList: async (seller) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.sellerAddressList}?seller=${seller}`,
        header: { authorization: auth },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },


  updateTraderData: async (
    traderId,
    traderName,
    gstin,
    city,
    address,
    email,
    pin,
    bankFile,
    panFile,
    gstFile,
    addressFile
  ) => {
    try {
      const formData = new FormData();
      formData.append("trader_name", traderName.toString());
      formData.append("trader_id", traderId.toString());
      formData.append("gstin", gstin);
      formData.append("city", city);
      formData.append("address", address);
      formData.append("email", email);
      formData.append("pin", pin);

      // Append files if they exist
      if (bankFile instanceof File) formData.append("bank_file", bankFile);
      if (panFile instanceof File) formData.append("pan_file", panFile);
      if (gstFile instanceof File) formData.append("gst_file", gstFile);
      if (addressFile instanceof File) formData.append("address_file", addressFile);

      Array.from(formData.entries()).forEach(([key, value]) => {
        console.log(`log val ${key}: ${value}`);
      });

      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: `${ApiAppConstants.updateTrader}`,
        header: {
          'authorization': auth,
          'Content-Type': 'multipart/form-data'
        },
        data: formData,
      });

      return apiResponse;
    } catch (error) {
      console.error("Error updating trader data:", error);
      alert("An error occurred while updating trader data. Please try again.");
      return error.toString();
    }
  },


  getProductBatchList: async (product) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.productBatch}?product=${product}`,
        header: { authorization: auth },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },


  getProductBatchMFGList: async () => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.productManufacture}`,
        header: { authorization: auth },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },


  getWarehouseList: async (seller) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.warehouse}?seller=${seller}`,
        header: { authorization: auth },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },


  getInboundList: async () => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.inbound}`,
        header: { authorization: auth },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },


  getOutboundList: async () => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.outbound}`,
        header: { authorization: auth },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  getWarehouseLocationList: async (warehouse) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.warehouseLocation}?ware_house=${warehouse}`,
        header: { authorization: auth },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  getStockLedgerList: async (mill, seller) => {
    try {
      const apiResponse = await NetworkAxios.getAxiosHttpMethod({
        url: `${ApiAppConstants.stockLedgerList}?mill=${mill}&seller=${seller}`,
        header: { authorization: auth },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  postProductBatch: async (
    product,
    batch_num,
    batch_start_date,
    batch_end_date,
    created_by
  ) => {
    try {
      console.log('Sending data to product_batch endpoint', {
        "product": product,
        "batch_num": batch_num,
        "batch_start_date": batch_start_date,
        "batch_end_date": batch_end_date,
        "created_by": created_by,
      });

      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: `${ApiAppConstants.productBatch}`,
        header: { 'authorization': auth },
        data: {
          "product": product,
          "batch_num": batch_num,
          "batch_start_date": batch_start_date,
          "batch_end_date": batch_end_date,
          "created_by": created_by,
        },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },


  postProductMFGBatch: async (
    product,
    mill,
    batch_num,
    mfg_date,
    exp_date,
    mfg_qty,
    uom,
    created_by
  ) => {
    try {
      console.log('Sending data to product_batch endpoint', {
        "product": product,
        "mill": mill,
        "batch_num": batch_num,
        "mfg_date": mfg_date,
        "exp_date": exp_date,
        "mfg_qty": mfg_qty,
        "uom": uom,
        "created_by": created_by,
      });

      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: `${ApiAppConstants.productManufacture}`,
        header: { 'authorization': auth },
        data: {
          "product": product,
          "mill": mill,
          "batch_num": batch_num,
          "mfg_date": mfg_date,
          "exp_date": exp_date,
          "mfg_qty": mfg_qty,
          "uom": uom,
          "created_by": created_by,
        },
      });

      return await apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  postWarehouseBatch: async (
    code,
    name,
    mill,
    ware_house_type,
    parent_ware_house,
    location,
    area,
    created_by,
    location_list
  ) => {
    try {


      const data = JSON.stringify({
        'code': code,
        'name': name,
        'mill': mill,
        'location_list': location_list,
        'ware_house_type': ware_house_type,
        'parent_ware_house': parent_ware_house,
        'location': location,
        'area': area,
        'created_by': created_by,

      });


      console.log('data1232', data, {
        'code': code,
        'name': name,
        'mill': mill,
        'ware_house_type': ware_house_type,
        'parent_ware_house': parent_ware_house,
        'location': location,
        'area': area,
        'created_by': created_by,
        'location_list': location_list
      })


      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: `${ApiAppConstants.warehouseCreate}`,
        header: { 'authorization': auth },
        ContentType: 'application/json',
        data: JSON.stringify({
          'code': code,
          'name': name,
          'mill': mill,
          'ware_house_type': ware_house_type,
          'parent_ware_house': parent_ware_house,
          'location': location,
          'area': area,
          'created_by': created_by,
          'location_list': location_list
        })
      });

      return apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },

  postInbound: async (
    ware_house,
    inbound_type,
    from_warehouse,
    po_num,
    created_by,
    inbound_data
  ) => {
    try {

      console.log('data123',
        {
          ware_house,
          inbound_type,
          from_warehouse,
          created_by,
          po_num,
          inbound_data
        }
      )

      const data = JSON.stringify({
        "ware_house": ware_house,
        "inbound_type": inbound_type,
        "created_by": created_by,
        "inbound_data": inbound_data,
        "from_warehouse": from_warehouse,
        "po_num": po_num,
      })

      console.log('data123', data)
      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: `${ApiAppConstants.inbound}`,
        header: { 'authorization': auth },
        ContentType: 'application/json',
        data,
      });

      return apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },


  postOutbound: async (
    ware_house,
    inbound_type,
    from_warehouse,
    po_num,
    created_by,
    inbound_data
  ) => {
    try {

      console.log('data123',
        {
          ware_house,
          inbound_type,
          from_warehouse,
          created_by,
          po_num,
          inbound_data
        }
      )

      const data = JSON.stringify({
        "ware_house": ware_house,
        "inbound_type": inbound_type,
        "created_by": created_by,
        "outbound_data": inbound_data,
        "from_warehouse": from_warehouse,
        "po_num": po_num,
      })

      console.log('data123', data)
      const apiResponse = await NetworkAxios.postAxiosHttpMethod({
        url: `${ApiAppConstants.outbound}`,
        header: { 'authorization': auth },
        ContentType: 'application/json',
        data,
      });

      return apiResponse;
    } catch (e) {
      alert(e.toString());
      return e.toString();
    }
  },


  productBatchEdit: async ({
    id,
    productId,
    batchNo,
    batchStartDate,
    batchEndDate,
    status,
    updated_by
  }) => {
    try {
      const data = {
        "product": productId,
        "batch_num": batchNo,
        "batch_start_date": batchStartDate,
        "batch_end_date": batchEndDate,
        "updated_by": updated_by,
        "updated_date": new Date().toISOString(),
        ...(status && { "is_active": status })
      };
      console.log('Sending data to product_batch endpoint', data);

      const apiResponse = await NetworkAxios.patchAxiosHttpMethod({
        url: `${ApiAppConstants.productBatch}${id}/`,
        header: { 'authorization': auth },
        data
      });

      alert("Product Batch Updated Successfully");
      console.log('Product Batch update Response:', apiResponse);
      return apiResponse.body;
    } catch (e) {
      console.error(e);
      alert(e.toString());
      return e.toString();
    }
  },


  productBatchMfgEdit: async ({
    mfgQty,
    id,
    updated_by,
  }) => {
    try {
      const data = {
        "mfg_qty": mfgQty,
        "updated_by": updated_by,
        "updated_date": new Date().toISOString()
      };
      console.log('Sending data to product_manufacture endpoint', data);

      const apiResponse = await NetworkAxios.patchAxiosHttpMethod({
        url: `${ApiAppConstants.productManufacture}${id}/`,
        header: { 'authorization': auth },
        data
      });

      alert("Product Batch Manufacturing Updated Successfully");
      console.log('Product Batch Manufacturing update Response:', apiResponse);
      return apiResponse;
    } catch (e) {
      console.error(e);
      alert(e.toString());
      return e.toString();
    }
  },

  warehouseEdit: async ({
    id,
    location,
    area,
    updated_by,
  }) => {
    try {
      const data = {
        "location": location.toString(),
        "area": area,
        "updated_by": updated_by,
        "updated_date": new Date().toISOString()
      };
      console.log('Sending data to warehouse endpoint', data);

      const apiResponse = await NetworkAxios.patchAxiosHttpMethod({
        url: `${ApiAppConstants.warehouse}${id}/`,
        header: { 'authorization': auth },
        ContentType: 'application/json',
        data: JSON.stringify({data})
      });

      alert("Warehouse Updated Successfully");
      console.log('Warehouse update Response:', apiResponse);
      return apiResponse;
    } catch (e) {
      console.error(e);
      alert(e.toString());
      return e.toString();
    }
  },

  inboundApprove: async ({ id, updated_by }) => {
    try {
      const data = {
        "inbound": id,
        "approved_date": new Date().toISOString(),
        "approved_by": updated_by,
      };

      console.log('inbound',data);

      const response = await NetworkAxios.putAxiosHttpMethod({
        url: `${ApiAppConstants.inbound}`,
        header: { 'authorization': auth },
        data,
      })

      console.log('Inbound Approve Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      return error.toString();
    }
  },

  outboundApprove: async ({ id, updated_by }) => {
    try {
      const data = {
        "outbound": id,
        "approved_date": new Date().toISOString(),
        "approved_by": updated_by,
      };

      console.log('inbound',data);

      const response = await NetworkAxios.putAxiosHttpMethod({
        url: `${ApiAppConstants.outbound}`,
        header: { 'authorization': auth },
        data,
      })

      console.log('Inbound Approve Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      return error.toString();
    }
  },
}


export default NetworkRepository;


