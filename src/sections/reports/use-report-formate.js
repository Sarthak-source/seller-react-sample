import { format, parseISO } from "date-fns";
import { useOrderTableFormate } from "../dashboard/orders/use-order-table-formate";


const useRenderFunctions = () => {

  const { formatPrice, formatQuantity } = useOrderTableFormate();


  const renderTableHeader = (key) => {
    switch (key) {
      case 'slNo':
        return 'Sl No'
      case 'tenderNum':
        return 'Tender Num';
      case 'orderNum':
        return 'Order Num';
      case 'dispatchDate':
        return 'Dispatch Date';
      case 'dispatchFrom':
        return 'Dispatch From';
      case 'dispatchTo':
        return 'Dispatch To';
      case 'billTo':
        return 'Bill To';
      case 'invoiceQty':
        return 'Invoice Qty';
      case 'totalAmount':
        return 'Total Amount';
      case 'totalTaxAmount':
        return 'Total Tax Amount';
      case 'totalInvoiceValue':
        return 'Total Invoice Value';
      case 'lrNo':
        return 'LR No';
      case 'customerPONo':
        return 'Customer PO No';
      case 'vehicleNo':
        return 'Vehicle No';
      case 'customerInvoiceNo':
        return 'Customer Invoice No';
      case 'bagsCount':
        return 'Bags Count';
      case 'grossWeight':
        return 'Gross Weight';
      case 'tareWeight':
        return 'Tare Weight';
      case 'netWeight':
        return 'Net Weight';
      case 'bagWeight':
        return 'Bag Weight';
      case 'actualMaterialWeight':
        return 'Actual Material Weight';
      case 'driverName':
        return 'Driver Name';
      case 'driverNo':
        return 'Driver No';
      case 'transporterName':
        return 'Transporter Name';
      case 'millName':
        return 'Mill Name';
      case 'traderName':
        return 'Trader Name';
      case 'deliveryOrderNo':
        return 'Delivery Order No';
      case 'invoiceNo':
        return 'Invoice No';
      case 'remarks':
        return 'Remarks';
      case 'ewaybill':
        return 'Eway Bill';
      case 'product':
        return 'Product';
      case 'cgst':
        return 'CGST';
      case 'igst':
        return 'IGST';
      case 'sgst':
        return 'SGST';
      case 'tcs':
        return 'TCS';
      case 'price':
        return 'Price';
      case 'status':
        return 'Status';
      case 'sealNo':
        return 'Seal No';
      default:
        return null;
    }
  };


  const renderOrderTableHeader = (key, unit) => {
    switch (key) {
      case 'slNo':
        return 'Sl No'
      case 'party':
        return 'Party';
      case 'orderNum':
        return 'Order Num';
      case 'rate':
        return `Rate per ${unit}`;
      case 'orderQty':
        return `Order Qty in ${unit}`;
      case 'dispatchQty':
        return `Dispatch Qty in ${unit}`;
      case 'balanceQty':
        return `Balance Qty in ${unit}`;
      case 'date':
        return 'Date';
      default:
        return null;
    }
  };

  const dispatchColumns = {
    slNo: true,
    tenderNum: true,
    orderNum: true,
    dispatchDate: true,
    dispatchFrom: true,
    dispatchTo: true,
    billTo: true,
    invoiceQty: true,
    totalAmount: true,
    totalTaxAmount: true,
    totalInvoiceValue: true,
    lrNo: true,
    customerPONo: true,
    vehicleNo: true,
    customerInvoiceNo: false,
    bagsCount: false,
    grossWeight: false,
    tareWeight: false,
    netWeight: true,
    bagWeight: false,
    actualMaterialWeight: false,
    driverName: false,
    driverNo: false,
    transporterName: true,
    millName: true,
    status: true,
    traderName: true,
    deliveryOrderNo: true,
    invoiceNo: true,
    remarks: false,
    ewaybill: true,
    cgst: true,
    igst: true,
    sgst: true,
    tcs: true,
    price: true,
    product: true,
    sealNo: false,
  }


  const orderColumns = {
    slNo: true,
    party: true,
    orderNum: true,
    rate: true,
    orderQty: true,
    dispatchQty: true,
    balanceQty: true,
    date: true,
  }



  const renderTableCell = (key, item, index) => {
    switch (key) {
      case 'slNo':
        return index;
      case 'tenderNum':
        return item.loading_instruction?.tender_num;
      case 'orderNum':
        return item.loading_instruction?.order_num;
      case 'dispatchDate':
        return item.invoice_date ? new Date(item.invoice_date).toLocaleDateString() : item.invoice_date
      case 'dispatchFrom':
        return item.dispatch_from;
      case 'dispatchTo':
        return item.dispatch_to;
      case 'billTo':
        return item.bill_to;
      case 'invoiceQty':
        return item.total_qty;
      case 'totalAmount':
        return item.total_amount;
      case 'status':
        return item.status;
      case 'totalTaxAmount':
        return item.total_tax_amount;
      case 'totalInvoiceValue':
        return item.total_invoice_amount;
      case 'lrNo':
        return item.loading_instruction?.lr_num;
      case 'customerPONo':
        return item.loading_instruction?.po_num;
      case 'vehicleNo':
        return item.vehicle_num;
      case 'customerInvoiceNo':
        return item.invoice_num;
      case 'bagsCount':
        return item.delivery_order?.bag_count;
      case 'grossWeight':
        return item.delivery_order?.gross_weight;
      case 'tareWeight':
        return item.delivery_order?.tare_weight;
      case 'netWeight':
        return item.delivery_order?.net_weight;
      case 'bagWeight':
        return item.delivery_order?.bag_weight;
      case 'actualMaterialWeight':
        return item.delivery_order?.actual_material_weight;
      case 'driverName':
        return item.loading_instruction?.driver;
      case 'driverNo':
        return item.loading_instruction?.mobile;
      case 'transporterName':
        return item.loading_instruction?.transporter;
      case 'millName':
        return item.mill;
      case 'traderName':
        return item.trader_name;
      case 'deliveryOrderNo':
        return item.delivery_order?.do_num;
      case 'invoiceNo':
        return `${item?.invoice_prefix}${item?.invoice_num !== "0" ? item?.invoice_num : item?.dc_num}`;
      case 'remarks':
        return item.loading_instruction?.remark;
      case 'ewaybill':
        return item.ewb_no;
      case 'cgst':
        return item.invoice_items
          ?.cgst;
      case 'igst':
        return item.invoice_items
          ?.igst;
      case 'sgst':
        return item.invoice_items
          ?.sgst;
      case 'tcs':
        return item.delivery_order?.tcs;
      case 'price':
        return `₹ ${item.loading_instruction?.price}`;
      case 'product':
        return item.loading_instruction?.product;
      case 'sealNo':
        return item.delivery_order?.seal_no;
      default:
        return null;
    }
  };

  const renderOrderTableCell = (key, item, index) => {
    switch (key) {
      case 'slNo':
        return index;
      case 'party':
        return item.trader.name;
      case 'orderNum':
        return item.id;
      case 'rate':
        return item.price;
      case 'orderQty':
        return `${formatQuantity(item, 'qty', item.qty)}`;
      case 'dispatchQty':
        return `${formatQuantity(item, 'dispatched_qty', item.dispatched_qty)}`;
      case 'balanceQty':
        return `${formatQuantity(item, 'available_qty', item.yet_to_load)}`;
      case 'date':
        return format(parseISO(item.date), 'dd/MMM/yyyy');
      default:
        return '-';
    }
  };



  return {
    renderTableHeader,
    renderTableCell,
    renderOrderTableHeader,
    renderOrderTableCell,
    dispatchColumns,
    orderColumns
  };
};

export default useRenderFunctions;
