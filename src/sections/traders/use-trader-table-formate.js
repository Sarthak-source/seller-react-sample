export function useTraderTableFormat() {


    const traderHeaderRow = [
        { id: 'name', label: 'Trader name' },
        { id: 'gstno', label: 'GST number' },
        { id: 'phoneNumber', label: 'Phone number' },
        { id: 'email', label: 'Email' },
        { id: 'status', label: 'Status' },
        { id: '' },
    ]

    return {
        traderHeaderRow
    };
}
