export function usePaymentTableFormate() {
    const paymentHeaderRow = [
        { id: 'paymentsId', label: 'Payments ID' },
        { id: 'amount', label: 'Amount' },
        { id: 'refNo', label: 'Referce no' },
        { id: 'status', label: 'Status' },
        { id: 'millName', label: 'Mill Name' },
        { id: 'tradeName', label: 'Trader Name' },
        { id: 'date', label: 'Date' },
        { id: '' },
    ]

    return {
        paymentHeaderRow,
    };
}