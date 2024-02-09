import { fCurrency } from "src/utils/format-number";

export function useTenderTableFormat() {
    const generateLocation = (location, stateName) => `${location}, ${stateName.charAt(0).toUpperCase() + stateName.substring(1).toLowerCase()}`;
    const formatPrice = (price, unit) => `₹ ${fCurrency(price)} /${unit}`;
    const getPropertyValue = (properties, property, defaultValue) => {
        console.log('properties', properties)

        const newPropertyMap = {
            [properties[0]?.label]: properties[0]?.value,
            [properties[1]?.label]: properties[1]?.value,
        };

        console.log('properties', newPropertyMap)

        return newPropertyMap[property] === undefined ? defaultValue : newPropertyMap[property];
    }


    const getStatusColor = (status) => {
        console.log('status', status);
        switch (status) {
            case 'Close':
                // Use RGB representation for grey
                return 'rgb(128, 128, 128)';
            case 'Rejected':
                // Use RGB representation for red
                return 'rgb(255, 0, 0)';
            case 'Active':
                // Use RGB representation for blue
                return 'rgb(0, 204, 255)';
            case 'Added':
                // Use RGB representation for orange
                return 'rgb(255, 165, 0)';
            default:
                // Use RGB representation for green
                return 'rgb(0, 128, 0)';
        }
    };

    const getStatus = (status) => {
        console.log('status', status);
        switch (status) {
            case 'Close':
                // Use RGB representation for grey
                return 'Closed';
            case 'Rejected':
                // Use RGB representation for red
                return 'Rejected';
            case 'Active':
                // Use RGB representation for blue
                return 'Active';
            case 'Added':
                // Use RGB representation for orange
                return 'Added';
            case 'Completed':
                return 'Completed'
            default:
                // Use RGB representation for green
                return status;
        }
    };

    const tenderHeaderRow = [
        { id: 'tenderId', label: 'Tender no' },
        { id: 'name', label: 'Mill name' },
        { id: 'location', label: 'Location' },
        { id: 'date', label: 'Date' },
        { id: 'price', label: 'Price/Unit' },
        { id: 'status', label: 'Status' },
        { id: 'tenderType', label: 'Tender type' },
        { id: 'productType', label: 'Product' },
        { id: 'grade', label: 'Grade' },
        { id: 'season', label: 'Season' },
        { id: 'total', label: 'Total' },
        { id: 'sold', label: 'Sold' },
        { id: 'balance', label: 'Balance', align: 'center' },
        { id: '' },
    ]

    return {
        generateLocation,
        formatPrice,
        getPropertyValue,
        getStatusColor,
        getStatus,
        tenderHeaderRow,
    };
}
