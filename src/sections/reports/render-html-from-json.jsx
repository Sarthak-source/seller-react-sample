import { Box, Button, ButtonGroup, Paper, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import NetworkRepository from 'src/app-utils/network_repository';

const RenderTableFromJson = ({ millPk, fromDate, toDate, invoiceType }) => {
    const [jsonData, setJsonData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [columnVisibility, setColumnVisibility] = useState({
        tenderNum: true,
        orderNum: true,
        dispatchDate: true,
        dispatchFrom: true,
        dispatchTo: true,
        billTo: true,
        invoiceQty: true,
        totalAmount: true,
        totalTaxAmount: true,
        totalInvoiceValue: true,
        lrNo: true,
        customerPONo: true,
        vehicleNo: true,
        customerInvoiceNo: true,
        bagsCount: true,
        grossWeight: true,
        tareWeight: true,
        netWeight: true,
        bagWeight: true,
        actualMaterialWeight: true,
        driverName: true,
        driverNo: true,
        transporterName: true,
        millName: true,
        deliveryOrderNo: true,
        invoiceNo: true,
        remarks: true,
        ewaybill: true,
        product: true,
        sealNo: true,
        // Add more columns here if needed
    });

    useEffect(() => {
        const fetchJson = async () => {
            try {
                const response = await NetworkRepository.dispatchReport(millPk, fromDate, toDate, invoiceType);
                setJsonData(response);
            } catch (error) {
                console.error('Error fetching JSON:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJson();
    }, [millPk, fromDate, toDate, invoiceType]);

    const toggleColumnVisibility = (columnKey) => {
        setColumnVisibility(prevState => ({
            ...prevState,
            [columnKey]: !prevState[columnKey]
        }));
    };

    const downloadCSV = () => {
        if (jsonData) {
            const csvContent = generateCSVFromTable();
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', 'data.csv');
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } else {
            console.error('No JSON data available to download.');
        }
    };

    const generateCSVFromTable = () => {
        const table = document.querySelector('table');
        const rows = Array.from(table.querySelectorAll('tr'));
        const csvData = rows.map(row => {
            const rowData = Array.from(row.querySelectorAll('td, th'))
                .map(cell => cell.textContent.trim())
                .join(',');
            return rowData;
        }).join('\n');
        return csvData;
    };

    const renderTableHeader = (key, item) => {
        switch (key) {
          case 'tenderNum':
            return 'Tender Num';
          case 'orderNum':
            return 'Order Num';
          case 'dispatchDate':
            return 'Dispatch Date';
          case 'dispatchFrom':
            return 'Dispatch From';
          case 'dispatchTo':
            return 'Dispatch To';
          case 'billTo':
            return 'Bill To';
          case 'invoiceQty':
            return 'Invoice Qty';
          case 'totalAmount':
            return 'Total Amount';
          case 'totalTaxAmount':
            return 'Total Tax Amount';
          case 'totalInvoiceValue':
            return 'Total Invoice Value';
          case 'lrNo':
            return 'LR No';
          case 'customerPONo':
            return 'Customer PO No';
          case 'vehicleNo':
            return 'Vehicle No';
          case 'customerInvoiceNo':
            return 'Customer Invoice No';
          case 'bagsCount':
            return 'Bags Count';
          case 'grossWeight':
            return 'Gross Weight';
          case 'tareWeight':
            return 'Tare Weight';
          case 'netWeight':
            return 'Net Weight';
          case 'bagWeight':
            return 'Bag Weight';
          case 'actualMaterialWeight':
            return 'Actual Material Weight';
          case 'driverName':
            return 'Driver Name';
          case 'driverNo':
            return 'Driver No';
          case 'transporterName':
            return 'Transporter Name';
          case 'millName':
            return 'Mill Name';
          case 'deliveryOrderNo':
            return 'Delivery Order No';
          case 'invoiceNo':
            return 'Invoice No';
          case 'remarks':
            return 'Remarks';
          case 'ewaybill':
            return 'Eway Bill';
          case 'product':
            return 'Product';
          case 'sealNo':
            return 'Seal No';
          default:
            return null;
        }
      };


    const renderTableCell = (key, item) => {
        switch (key) {
          case 'tenderNum':
            return item.loading_instruction?.tender_num;
          case 'orderNum':
            return item.loading_instruction?.order_num;
          case 'dispatchDate':
            return item.invoice_date ? new Date(item.invoice_date).toLocaleDateString() : item.invoice_date
          case 'dispatchFrom':
            return item.dispatch_from;
          case 'dispatchTo':
            return item.dispatch_to;
          case 'billTo':
            return item.bill_to;
          case 'invoiceQty':
            return item.total_qty;
          case 'totalAmount':
            return item.total_amount;
          case 'totalTaxAmount':
            return item.total_tax_amount;
          case 'totalInvoiceValue':
            return item.total_invoice_amount;
          case 'lrNo':
            return item.loading_instruction?.lr_num;
          case 'customerPONo':
            return item.loading_instruction?.po_num;
          case 'vehicleNo':
            return item.vehicle_num;
          case 'customerInvoiceNo':
            return item.invoice_num;
          case 'bagsCount':
            return item.delivery_order?.bag_count;
          case 'grossWeight':
            return item.delivery_order?.gross_weight;
          case 'tareWeight':
            return item.delivery_order?.tare_weight;
          case 'netWeight':
            return item.delivery_order?.net_weight;
          case 'bagWeight':
            return item.delivery_order?.bag_weight;
          case 'actualMaterialWeight':
            return item.delivery_order?.actual_material_weight;
          case 'driverName':
            return item.loading_instruction?.driver;
          case 'driverNo':
            return item.loading_instruction?.mobile;
          case 'transporterName':
            return item.loading_instruction?.transporter;
          case 'millName':
            return item.mill;
          case 'deliveryOrderNo':
            return item.delivery_order?.do_num;
          case 'invoiceNo':
            return item.invoice_num;
          case 'remarks':
            return item.loading_instruction?.remark;
          case 'ewaybill':
            return item.ewb_no;
          case 'product':
            return item.loading_instruction?.product;
          case 'sealNo':
            return item.delivery_order?.seal_no;
          default:
            return null;
        }
      };

    return (
        <Paper elevation={3} style={{ margin: '16px 0', maxHeight: '100%', overflow: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: '16px', pt: '16px' }}>
                <ButtonGroup variant="outlined" aria-label="outlined button group" size='small'>
                    <Button onClick={downloadCSV}>EXCEL</Button>
                </ButtonGroup>
            </Box>
            {!loading ? (
                <Typography variant="body1" sx={{ px: '30px', mb: '20px' }}>
                    <table style={{ borderSpacing: 0 }}>
                        <thead>
                            <tr>
                                {Object.entries(columnVisibility).map(([key, visible]) => 
                                    visible && (
                                        <th key={key} onClick={() => toggleColumnVisibility(key)} style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>
                                            {renderTableHeader(key)}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {jsonData.map((item, index) => (
                                <tr key={index} style={{ cursor: 'pointer' }}>
                                    {Object.entries(columnVisibility).map(([key, visible]) => 
                                        visible && (
                                            <td key={`${index}-${key}`} style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>
                                                {renderTableCell(key,item)?? '-'}
                                            </td>
                                        )
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Typography>
            ) : (
                <Typography variant="body1" sx={{ px: '30px', mb: '20px' }}>
                    Loading...
                </Typography>
            )}
        </Paper>
    );
};

RenderTableFromJson.propTypes = {
    millPk: PropTypes.any,
    fromDate: PropTypes.any,
    toDate: PropTypes.any,
    invoiceType: PropTypes.any,
}

export default RenderTableFromJson;





// import { Box, Button, ButtonGroup, Paper, Typography } from '@mui/material';
// import PropTypes from 'prop-types';
// import React, { useEffect, useState } from 'react';
// import NetworkRepository from 'src/app-utils/network_repository';

// const RenderTableFromJson = ({ millPk, fromDate, toDate, invoiceType }) => {
//     const [jsonData, setJsonData] = useState(null);
//     const [loading, setLoading] = useState(true);
    
//     const [columnVisibility, setColumnVisibility] = useState({
//         tenderNum: true,
//         orderNum: true,
//         dispatchDate: true,
//         dispatchFrom: true,
//         dispatchTo: true,
//         billTo: true,
//         invoiceQty: true,
//         totalAmount: true,
//         totalTaxAmount: true,
//         totalInvoiceValue: true,
//         lrNo: true,
//         customerPONo: true,
//         vehicleNo: true,
//         customerInvoiceNo: true,
//         bagsCount: true,
//         grossWeight: true,
//         tareWeight: true,
//         netWeight: true,
//         bagWeight: true,
//         actualMaterialWeight: true,
//         driverName: true,
//         driverNo: true,
//         transporterName: true,
//         millName: true,
//         deliveryOrderNo: true,
//         invoiceNo: true,
//         remarks: true,
//         ewaybill: true,
//         product: true,
//         sealNo: true,
//         // Add more columns here if needed
//     });


//     useEffect(() => {
//         const fetchJson = async () => {
//             try {
//                 const response = await NetworkRepository.dispatchReport(millPk, fromDate, toDate, invoiceType);
//                 setJsonData(response);
                
//             } catch (error) {
//                 console.error('Error fetching JSON:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchJson();
//     }, [millPk, fromDate, toDate, invoiceType]);

   

//     const toggleColumnVisibility = (columnKey) => {
//         setColumnVisibility(prevState => ({
//             ...prevState,
//             [columnKey]: !prevState[columnKey]
//         }));
//     };

//     const downloadCSV = () => {
//         if (jsonData) {
//             const csvContent = generateCSVFromTable();
//             const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//             const link = document.createElement('a');
//             if (link.download !== undefined) {
//                 const url = URL.createObjectURL(blob);
//                 link.setAttribute('href', url);
//                 link.setAttribute('download', 'data.csv');
//                 link.style.visibility = 'hidden';
//                 document.body.appendChild(link);
//                 link.click();
//                 document.body.removeChild(link);
//             }
//         } else {
//             console.error('No JSON data available to download.');
//         }
//     };

//     const generateCSVFromTable = () => {
//         const table = document.querySelector('table');
//         const rows = Array.from(table.querySelectorAll('tr'));
//         const csvData = rows.map(row => {
//             const rowData = Array.from(row.querySelectorAll('td, th'))
//                 .map(cell => cell.textContent.trim())
//                 .join(',');
//             return rowData;
//         }).join('\n');
//         return csvData;
//     };

//     return (
//         <Paper elevation={3} style={{ margin: '16px 0', maxHeight: '100%', overflow: 'auto' }}>
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: '16px', pt: '16px' }}>
//                 <ButtonGroup variant="outlined" aria-label="outlined button group" size='small'>
//                     <Button onClick={downloadCSV}>EXCEL</Button>
//                 </ButtonGroup>
//             </Box>
//             {!loading ? (
//                 <Typography variant="body1" sx={{ px: '30px', mb: '20px' }}>
//                     <table style={{ borderSpacing: 0 }}>
//                         <thead>
//                             <tr>
//                                 {columnVisibility.tenderNum && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Tender Num</th>}
//                                 {columnVisibility.orderNum && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Order Num</th>}
//                                 {columnVisibility.dispatchDate && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Dispatch Date</th>}
//                                 {columnVisibility.dispatchFrom && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Dispatch From</th>}
//                                 {columnVisibility.dispatchTo && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Dispatch To</th>}
//                                 {columnVisibility.billTo && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Bill To</th>}
//                                 {columnVisibility.invoiceQty && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Invoice Qty</th>}
//                                 {columnVisibility.totalAmount && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Total Amount</th>}
//                                 {columnVisibility.totalTaxAmount && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Total Tax Amount</th>}
//                                 {columnVisibility.totalInvoiceValue && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Total Invoice Value</th>}
//                                 {columnVisibility.lrNo && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>LR No.</th>}
//                                 {columnVisibility.customerPONo && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Customer PO No.</th>}
//                                 {columnVisibility.vehicleNo && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Vehicle No.</th>}
//                                 {columnVisibility.customerInvoiceNo && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Customer Invoice No.</th>}
//                                 {columnVisibility.bagsCount && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>No. of Bags</th>}
//                                 {columnVisibility.grossWeight && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Gross Wt. (Kg)</th>}
//                                 {columnVisibility.tareWeight && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Tare Wt. (Kg)</th>}
//                                 {columnVisibility.netWeight && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Net Wt. (Kg)</th>}
//                                 {columnVisibility.bagWeight && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Bag Wt. (Kg)</th>}
//                                 {columnVisibility.actualMaterialWeight && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Actual Material Wt. (Kg)</th>}
//                                 {columnVisibility.driverName && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Driver Name</th>}
//                                 {columnVisibility.driverNo && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Driver No.</th>}
//                                 {columnVisibility.transporterName && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Transporter Name</th>}
//                                 {columnVisibility.millName && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Mill Name</th>}
//                                 {columnVisibility.deliveryOrderNo && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Delivery Order (DO) No.</th>}
//                                 {columnVisibility.invoiceNo && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Invoice No.</th>}
//                                 {columnVisibility.remarks && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Remarks</th>}
//                                 {columnVisibility.ewaybill && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Ewaybill</th>}
//                                 {columnVisibility.product && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Product</th>}
//                                 {columnVisibility.sealNo && <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Seal No</th>}
//                                 {/* Add more columns here */}
//                             </tr>

//                         </thead>
//                         <tbody>
//                             {jsonData.map((item, index) => (
//                                 <React.Fragment key={index}>
                                   
//                                         <tr key={index}  style={{ cursor: 'pointer' }}>
//                                             {columnVisibility.tenderNum && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction?.tender_num ?? '-'}</td>}
//                                             {columnVisibility.orderNum && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction?.order_num ?? '-'}</td>}
//                                             {columnVisibility.dispatchDate && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.invoice_date ? new Date(item.invoice_date).toLocaleDateString() : '-'}</td>}
//                                             {columnVisibility.dispatchFrom && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.dispatch_from ?? '-'}</td>}
//                                             {columnVisibility.dispatchTo && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.dispatch_to ?? '-'}</td>}
//                                             {columnVisibility.billTo && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.bill_to ?? '-'}</td>}
//                                             {columnVisibility.invoiceQty && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.total_qty ?? '-'}</td>}
//                                             {columnVisibility.totalAmount && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.total_amount ?? '-'}</td>}
//                                             {columnVisibility.totalTaxAmount && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.total_tax_amount ?? '-'}</td>}
//                                             {columnVisibility.totalInvoiceValue && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.total_invoice_amount ?? '-'}</td>}
//                                             {columnVisibility.lrNo && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction?.lr_num ?? '-'}</td>}
//                                             {columnVisibility.customerPONo && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction?.po_num ?? '-'}</td>}
//                                             {columnVisibility.vehicleNo && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.vehicle_num ?? '-'}</td>}
//                                             {columnVisibility.customerInvoiceNo && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.invoice_num ?? '-'}</td>}
//                                             {columnVisibility.bagsCount && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order?.bag_count ?? '-'}</td>}
//                                             {columnVisibility.grossWeight && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order?.gross_weight ?? '-'}</td>}
//                                             {columnVisibility.tareWeight && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order?.tare_weight ?? '-'}</td>}
//                                             {columnVisibility.netWeight && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order?.net_weight ?? '-'}</td>}
//                                             {columnVisibility.bagWeight && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order?.bag_weight ?? '-'}</td>}
//                                             {columnVisibility.actualMaterialWeight && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order?.actual_material_weight ?? '-'}</td>}
//                                             {columnVisibility.driverName && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction?.driver ?? '-'}</td>}
//                                             {columnVisibility.driverNo && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction?.mobile ?? '-'}</td>}
//                                             {columnVisibility.transporterName && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction?.transporter ?? '-'}</td>}
//                                             {columnVisibility.millName && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.mill ?? '-'}</td>}
//                                             {columnVisibility.deliveryOrderNo && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order?.do_num ?? '-'}</td>}
//                                             {columnVisibility.invoiceNo && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.invoice_num ?? '-'}</td>}
//                                             {columnVisibility.remarks && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction?.remark ?? '-'}</td>}
//                                             {columnVisibility.ewaybill && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.ewb_no ?? '-'}</td>}
//                                             {columnVisibility.product && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction?.product ?? '-'}</td>}
//                                             {columnVisibility.sealNo && <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order?.seal_no ?? '-'}</td>}
//                                             {/* Render more columns here */}
//                                         </tr>

                                    
//                                 </React.Fragment>
//                             ))}
//                         </tbody>
//                     </table>
//                 </Typography>
//             ) : (
//                 <Typography variant="body1" sx={{ px: '30px', mb: '20px' }}>
//                     Loading...
//                 </Typography>
//             )}
//         </Paper>
//     );
// };

// RenderTableFromJson.propTypes = {
//     millPk: PropTypes.any,
//     fromDate: PropTypes.any,
//     toDate: PropTypes.any,
//     invoiceType: PropTypes.any,
// }

// export default RenderTableFromJson;










// import { Box, Button, ButtonGroup, Paper, Typography } from '@mui/material';
// import PropTypes from 'prop-types';
// import React, { useEffect, useState } from 'react';

// import NetworkRepository from 'src/app-utils/network_repository';

// const RenderTableFromJson = ({ millPk, fromDate, toDate, invoiceType }) => {
//     const [jsonData, setJsonData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [rowVisibility, setRowVisibility] = useState({}); // State to track row visibility


//     useEffect(() => {
//         const fetchJson = async () => {
//             try {
//                 const response = await NetworkRepository.dispatchReport(millPk, fromDate, toDate, invoiceType);

//                 setJsonData(response);
//             } catch (error) {
//                 console.error('Error fetching JSON:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchJson();
//     }, [millPk, fromDate, toDate, invoiceType]);

//     const downloadCSV = () => {
//         if (jsonData) {
//             const csvContent = generateCSVFromTable();
//             const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//             const link = document.createElement('a');
//             if (link.download !== undefined) {
//                 const url = URL.createObjectURL(blob);
//                 link.setAttribute('href', url);
//                 link.setAttribute('download', 'data.csv');
//                 link.style.visibility = 'hidden';
//                 document.body.appendChild(link);
//                 link.click();
//                 document.body.removeChild(link);
//             }
//         } else {
//             console.error('No JSON data available to download.');
//         }
//     };

//     const generateCSVFromTable = () => {
//         const table = document.querySelector('table');
//         const rows = Array.from(table.querySelectorAll('tr'));
//         const csvData = rows.map(row => {
//             const rowData = Array.from(row.querySelectorAll('td, th'))
//                 .map(cell => cell.textContent.trim())
//                 .join(',');
//             return rowData;
//         }).join('\n');
//         return csvData;
//     };

//     const toggleRowVisibility = (index) => {
//         console.log('toggle');
//         setRowVisibility(prevState => ({
//             ...prevState,
//             [index]: !prevState[index]
//         }));
//     };

//     console.log(jsonData)

//     return (
//         <Paper
//             elevation={3}
//             style={{ margin: '16px 0', maxHeight: '100%', overflow: 'auto' }}
//         >
//             <Box
//                 sx={{ display: 'flex', justifyContent: 'flex-end', pr: '16px', pt: '16px' }}
//             >
//                 <ButtonGroup variant="outlined" aria-label="outlined button group" size='small'>
//                     <Button onClick={downloadCSV}>EXCEL</Button>
//                 </ButtonGroup>
//             </Box>
//             {!loading ? (
//                 <Typography variant="body1" sx={{ px: '30px', mb: '20px' }}>
//                     <table style={{ borderSpacing: 0 }}>
//                         <thead>
//                             <tr>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Sl No.</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Tender Num</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Order Num</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Dispatch Date</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Dispatch From</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Dispatch To</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Bill To</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Invoice Qty</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Total Amount</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Total Tax amount</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Total Invoice Value</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>LR No.</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Customer PO No.</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Vehicle No.</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Customer Invoice No.</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>No.of Bags</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Gross Wt. (Kg)</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Tare Wt. (Kg)</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Net Wt. (Kg)</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Bag Wt. (Kg)</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Actual Material Wt. (Kg)</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Driver Name</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Driver No.</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Transporter Name</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Mill Name</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Delivery Order (DO) No.</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Invoice No.</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Remarks</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Ewaybill</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Product</th>
//                                 <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Seal No</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {jsonData.map((item, index) => (
//                                 <React.Fragment key={index}>
//                                    {rowVisibility[index] && ( <tr key={index} onClick={() => toggleRowVisibility(index)} style={{ cursor: 'pointer' }}>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderCollapse: 'collapse', borderSpacing: 0, }}>{index + 1}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction.tender_num ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction.order_num ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{new Date(item.invoice_date).toLocaleDateString() ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.dispatch_from ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.dispatch_to ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.bill_to ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.total_qty ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.total_amount ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.total_tax_amount ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.total_invoice_amount ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction.lr_num ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction.po_num ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.vehicle_num ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.invoice_num ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order.bag_count ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order.gross_weight ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order.tare_weight ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order.net_weight ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order.bag_weight ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order.actual_material_weight ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction.driver ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction.mobile ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction.transporter ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.mill ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order.do_num ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.invoice_num ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction.remark ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.ewb_no ?? '-'}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction.product}</td>
//                                         <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order.seal_no ?? '-'}</td>
//                                     </tr>)}

//                                 </React.Fragment>

//                             ))}
//                         </tbody>
//                     </table>
//                 </Typography>
//             ) : (
//                 <Typography variant="body1" sx={{ px: '30px', mb: '20px' }}>
//                     Loading...
//                 </Typography>
//             )}
//         </Paper>
//     );
// };

// RenderTableFromJson.propTypes = {
//     millPk: PropTypes.any,
//     fromDate: PropTypes.any,
//     toDate: PropTypes.any,
//     invoiceType: PropTypes.any,
// }

// export default RenderTableFromJson;
