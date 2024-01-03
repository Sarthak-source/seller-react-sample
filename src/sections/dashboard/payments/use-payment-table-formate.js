export function usePaymentTableFormate() {
    const paymentHeaderRow = [
        { id: 'date', label: 'Date' },
        { id: 'paymentsId', label: 'Payments ID' },
        { id: 'amount', label: 'Amount' },
        { id: 'status', label: 'Status' },
        { id: 'millName', label: 'Mill Name' },
        { id: 'tradeName', label: 'Trader Name' }, 
        { id: 'refNo', label: 'Referce no' },
        { id: '' },
    ]

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processed':
            case 'Verified':
                return 'rgb(0, 128, 0)';
            case 'Cancel':
            case 'Cancelled':
            case 'Returned':
                return 'rgb(255, 0, 0)';
            default:
                return 'rgb(0, 0, 0)';
        }
    };

    return {
        getStatusColor,
        paymentHeaderRow,
    };
}