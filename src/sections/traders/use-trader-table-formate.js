export function useTraderTableFormat() {

    const getStatusColor = (status) => {
        console.log('status', status);
        switch (status) {
           
            case 'Active':
                return 'rgb(0, 128, 0)';
                
            default:
                return 'rgb(255, 0, 0)';
        }
    };


    const traderHeaderRow = [
        { id: 'name', label: 'Trader name' },
        { id: 'gstno', label: 'GST number' },
        { id: 'phoneNumber', label: 'Phone number' },
        { id: 'email', label: 'Email' },
        { id: 'status', label: 'Status' },
        { id: '' },
    ]

    return {
        getStatusColor,
        traderHeaderRow
    };
}
