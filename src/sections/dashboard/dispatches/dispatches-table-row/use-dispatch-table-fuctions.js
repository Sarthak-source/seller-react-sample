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

    return {
        handlePrint,
    };
}