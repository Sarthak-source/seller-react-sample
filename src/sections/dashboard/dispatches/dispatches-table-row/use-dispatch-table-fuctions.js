export function useDispatchTableFuctions() {
    const handlePrint = (url) => {
       
            // Open the PDF URL in a new window
            const printWindow = window.open(url, '_blank');
        
            // Check if the window has loaded
            printWindow.onload = () => {
                // Optionally, you can trigger the print dialog once the window has loaded
                printWindow.print();
            };
        
        
        
    };

    const getStatusColor= (status) => {
        switch (status) {
            case 'Done':
                return 'rgb(0, 128, 0)';
            case 'Requested':
                return 'rgb(255, 165, 0)';
            case 'Not_Done':
                return 'rgb(255, 0, 0)'; // Green
            default:
                return 'rgb(255, 0, 0)';
        }
    }

    const getStatus= (status) => {
        switch (status) {
            case 'Done':
                return 'Done';
            case 'Requested':
                return 'Requested';
            case 'Not_Done':
                return 'Not done'; // Green
            default:
                return 'Not given';
        }
    }

    return {
        handlePrint,
        getStatusColor,
        getStatus
    };
}