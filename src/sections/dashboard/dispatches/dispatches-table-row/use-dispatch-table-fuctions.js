export function useDispatchTableFuctions() {
    const handlePrint = (url) => {
        window.open(url, '_blank');
        // const iframe = document.createElement('iframe');
        // iframe.style.display = 'none';
        // iframe.src = url;
        // document.body.appendChild(iframe);
        // iframe.onload = () => {
        //     iframe.contentWindow.print();
        //     document.body.removeChild(iframe);
        // };
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