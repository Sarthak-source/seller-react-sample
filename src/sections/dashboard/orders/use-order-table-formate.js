import { fCurrency } from "src/utils/format-number";

export function useOrderTableFormate() {

    const formatPrice = (price, unit) => `₹ ${fCurrency(price)} /${unit}`;

    function getStatusText(status) {
        try {
            let statusText;

            switch (status) {
                case "close":
                    statusText = "Closed";
                    break;
                case "Cancel":
                    statusText = "Closed";
                    break;
                case "rejected":
                    statusText = "Rejected";
                    break;
                case "Approved":
                    statusText = "Bid Accepted";
                    break;
                case "Booked":
                    statusText = "Pending Approval";
                    break;
                case "DOIssued":
                    statusText = "Completed";
                    break;
                default:
                    statusText = `${status}`;
            }

            return statusText;
        } catch (error) {
            console.error("Error converting status:", error);
            return "Unknown"; // or handle the error in a way that makes sense for your application
        }
    }


    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'closed':
            case 'canceled':
            case 'rejected':
                return 'rgb(255, 0, 0)'; // Red
            case 'approved':
                return 'rgb(0, 0, 255)'; // Blue
            case 'pending approval':
                return 'rgb(255, 165, 0)'; // Orange
            case 'completed':
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
        { id: 'sale', label: 'Sale' },
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