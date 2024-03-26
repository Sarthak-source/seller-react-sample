import { Box, Button, ButtonGroup, Paper, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import NetworkRepository from 'src/app-utils/network_repository';

const RenderTableFromJson = ({ millPk, fromDate, toDate, invoiceType }) => {
    const [jsonData, setJsonData] = useState(null);
    const [loading, setLoading] = useState(true);

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

    console.log(jsonData)

    return (
        <Paper
            elevation={3}
            style={{ margin: '16px 0', maxHeight: '100%', overflow: 'auto' }}
        >
            <Box
                sx={{ display: 'flex', justifyContent: 'flex-end', pr: '16px', pt: '16px' }}
            >
                <ButtonGroup variant="outlined" aria-label="outlined button group" size='small'>
                    <Button onClick={downloadCSV}>EXCEL</Button>
                </ButtonGroup>
            </Box>
            {!loading ? (
                <Typography variant="body1" sx={{ px: '30px', mb: '20px' }}>
                    <table style={{ borderSpacing: 0 }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Sl No.</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Tender Num</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Order Num</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Dispatch Date</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Dispatch From</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Dispatch To</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Bill To</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Invoice Qty</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Total Amount</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Total Tax amount</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Total Invoice Value</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>LR No.</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Customer PO No.</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Vehicle No.</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Customer Invoice No.</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>No.of Bags</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Gross Wt. (Kg)</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Tare Wt. (Kg)</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Net Wt. (Kg)</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Bag Wt. (Kg)</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Actual Material Wt. (Kg)</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Driver Name</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Driver No.</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Transporter Name</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Mill Name</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Delivery Order (DO) No.</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Invoice No.</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Remarks</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Ewaybill</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Product</th>
                                <th style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>Seal No</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jsonData.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid black', padding: '8px', borderCollapse: 'collapse', borderSpacing: 0, }}>{index + 1}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction.tender_num??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction.order_num??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{new Date(item.invoice_date).toLocaleDateString()??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.dispatch_from??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.dispatch_to??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.bill_to??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.total_qty??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.total_amount??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.total_tax_amount??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.total_invoice_amount??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction.lr_num??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction.po_num??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.vehicle_num??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.invoice_num??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order.bag_count??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order.gross_weight??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order.tare_weight??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order.net_weight??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order.bag_weight??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order.actual_material_weight??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction.driver??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction.mobile??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction.transporter??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.mill??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order.do_num??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.invoice_num??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction.remark??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.ewb_no??'-'}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.loading_instruction.product}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>{item.delivery_order.seal_no??'-'}</td>
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
