import { fCurrency } from "src/utils/format-number";

export function useOrderTableFormate() {

    const formatPrice = (price, unit) => `₹ ${fCurrency(price)} /${unit}`;

    function getStatusText(status) {
        let statusText;

        if (status === "close") {
            statusText = "Closed";
        } else if (status === "cancel") {
            statusText = "Canceled";
        } else if (status === "rejected") {
            statusText = "Rejected";
        } else if (status === "Approved") {
            statusText = "Bid Accepted";
        } else if (status === "booked") {
            statusText = "Bid Received";
        } else if (status === "doIssued") {
            statusText = "Completed";
        } else {
            statusText = `${status}`;
        }

        return statusText;
    }

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'close':
            case 'cancel':
            case 'rejected':
                return 'rgb(255, 0, 0)'; // Red
            case 'approved':
                return 'rgb(0, 0, 255)'; // Blue
            case 'booked':
                return 'rgb(255, 165, 0)'; // Orange
            case 'doissued':
                return 'rgb(0, 128, 0)'; // Green
            default:
                return 'rgb(0, 128, 0)'; // Black
        }
    };


    function formatQty(qty) {
        const qtyString = qty;
        const qtyParts = qtyString.split(".");

        if (qtyParts[1] === "00" || qtyParts[1] === "0") {
            return parseFloat(qtyString).toFixed(0);
        }
        return qtyString;
    }

    function formatQuantity(data, key, parts) {
        const qtyString = data[key].toString();
        const qtyParts = qtyString.split(".");

        if (parts.length === 2 && (qtyParts[1] === "00" || qtyParts[1] === "0")) {
            return parseFloat(qtyString).toFixed(0);
        }

        return qtyString;
    }

    const orderHeaderRow = [
        { id: 'ordersId', label: 'Orders no' },
        { id: 'millName', label: 'Mill name' },
        { id: 'traderName', label: 'Trader Name' },
        { id: 'date', label: 'Date' },
        { id: 'status', label: 'Status' },
        { id: 'price', label: 'Price/Unit' },
        { id: 'tenderType', label: 'Tender type' },
        { id: 'productType', label: 'Product' },
        { id: 'grade', label: 'Grade' },
        { id: 'season', label: 'Season' },
        { id: 'sold', label: 'Sold' },
        { id: 'loading', label: 'Loading' },
        { id: 'dispatched', label: 'Dispatched' },
        { id: 'balance', label: 'Balance', align: 'center' },
        { id: '' },
    ]

    return {
        formatPrice,
        getStatusText,
        formatQty,
        formatQuantity,
        getStatusColor,
        orderHeaderRow,
    };
}