export function useDispatchesTableFormat() {
   
  const deliveryOrderHeaderRow=  [
        { id: 'orderNo', label: 'Order No' },
        { id: 'lrNo', label: 'LR No' },
        { id: 'doNo', label: 'Do No' },
        { id: 'name', label: 'Mill name' },
        { id: 'trader', label: 'Trader' },
        { id: 'date', label: 'Date' },
        { id: 'vehicleNumber', label: 'Vehicle Number' },
        { id: 'quantity', label: 'Quantity' },
        { id: 'billedTo', label: 'Billed To' },
        { id: 'ShipTo', label: 'Shipped To' },
        { id: 'rate', label: 'Rate' },
        { id: 'grade', label: 'Grade' },
        { id: '' },
    ]

    

    const loadingInstructionHeaderRow = [
        { id: 'orderNo', label: 'Order No' },
        { id: 'lrNo', label: 'LR No' },
        { id: 'qcStatus', label: 'QC Status' },
        { id: 'name', label: 'Mill name' },
        { id: 'userName', label: 'Name' },
        { id: 'date', label: 'Date' },
        { id: 'vehicleNumber', label: 'Vehicle Number' },
        { id: 'quantity', label: 'Quantity' },
        { id: 'billedTo', label: 'Billed To' },
        { id: 'ShipTo', label: 'Shipped To' },
        { id: 'rate', label: 'Rate' },
        { id: 'grade', label: 'Grade' },
        { id: 'remark', label: 'Remark', align: 'center' },
        { id: 'TCS' },
        { id: '' },
    ]

    const invoiceHeaderRow = [
        { id: 'orderNo', label: 'Order No' },
        { id: 'lrNo', label: 'LR No' },
        { id: 'invoiceNo', label: 'Invoice/DC No' },
        { id: 'name', label: 'Mill name' },
        { id: 'userName', label: 'Name' },
        { id: 'date', label: 'Date' },
        { id: 'vehicleNumber', label: 'Vehicle Number' },
        { id: 'quantity', label: 'Quantity' },
        { id: 'billedTo', label: 'Billed To' },
        { id: 'ShipTo', label: 'Shipped To' },
        { id: 'rate', label: 'Rate' },
        { id: 'grade', label: 'Grade' },
        { id: 'remark', label: 'Remark', align: 'center' },
        { id: 'TCS' },
        { id: '' },
    ]

    return {
        deliveryOrderHeaderRow,
        loadingInstructionHeaderRow,
        invoiceHeaderRow,
    };
}
