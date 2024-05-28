export function useAddressTableFormat() {

    const getStatusColor = (status) => {
        console.log('status', status);
        switch (status) {
           
            case 'Active':
                return 'rgb(0, 128, 0)';
                
            default:
                return 'rgb(255, 0, 0)';
        }
    };


    const addressHeaderRow = [
        { id: 'name', label: 'Company name' },
        { id: 'gstno', label: 'GST number' },
        { id: 'address', label: 'Address' },
        { id: 'city', label: 'City' },
        { id: 'pin', label: 'Pin' },
        { id: '' },
    ]

    return {
        getStatusColor,
        addressHeaderRow,
    };
}
