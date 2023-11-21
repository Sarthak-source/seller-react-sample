export function useTenderTableFormat() {
    const generateLocation = (location, stateName) => `${location}, ${stateName.charAt(0).toUpperCase() + stateName.substring(1).toLowerCase()}`;
    const formatPrice = (price, unit) => `₹ ${price} ${unit}`;
    const getPropertyValue = (properties, index, property, defaultValue) =>
        properties.length > index ? properties[index][property] : defaultValue;

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
        tenderHeaderRow,
    };
}
