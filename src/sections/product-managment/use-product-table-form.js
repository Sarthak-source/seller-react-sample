export function useProductTableFormat() {

    const productHeaderRow = [
        { id: 'code', label: 'Product Code' },
        { id: 'productType', label: 'Product Type' },
        { id: 'status', label: 'Status' },
    ];

    const getStatusColor = (status) => {
        console.log('status', status);
        switch (status) {
           
            case 'Active':
                return 'rgb(0, 128, 0)';
                
            default:
                return 'rgb(255, 0, 0)';
        }
    };


    return {
        productHeaderRow,
        getStatusColor, 
    };
}
