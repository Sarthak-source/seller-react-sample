import { Box, Button, ButtonGroup, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Paper, Select, Typography } from '@mui/material';
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

  const [selectedColumns, setSelectedColumns] = useState([]);


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
    console.log('columnKey',columnKey);
    setColumnVisibility(prevState => {
      if (Object.hasOwnProperty.call(prevState, columnKey)) {
        return {
          ...prevState,
          [columnKey]: !prevState[columnKey]
        };
      }
      return prevState; // Column key doesn't exist, return previous state
    });
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
  const handleChange = (event) => {
    const selectedColumn = event.target.value;
    
    setSelectedColumns(selectedColumn);
    console.log('selectedColumn',selectedColumn[selectedColumn.length-1]);
    toggleColumnVisibility(selectedColumn[selectedColumn.length-1]);
  };

  return (
    <Paper elevation={3} style={{ margin: '16px 0', maxHeight: '100%', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: '16px', pt: '16px' }}>
        <ButtonGroup variant="outlined" aria-label="outlined button group" size='small'>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">Select Columns</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={selectedColumns}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Select Columns" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={renderTableHeader(value)} />
                  ))}
                </Box>
              )}
            >
              {Object.keys(columnVisibility).map((columnKey) => (
                <MenuItem key={columnKey} value={columnKey}>
                  {renderTableHeader(columnKey)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
                        {renderTableCell(key, item) ?? '-'}
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





