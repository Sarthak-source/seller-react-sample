import { useTheme } from '@emotion/react';
import { Box, Button, ButtonGroup, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Paper, Select, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

const RenderTableFromJson = ({
  renderTableHeader,
  renderTableCell,
  fetchData
}) => {
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const [columnVisibility, setColumnVisibility] = useState({
    slNo: true,
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
    customerInvoiceNo: false,
    bagsCount: false,
    grossWeight: false,
    tareWeight: false,
    netWeight: true,
    bagWeight: false,
    actualMaterialWeight: false,
    driverName: false,
    driverNo: false,
    transporterName: true,
    millName: true,
    deliveryOrderNo: true,
    invoiceNo: true,
    remarks: false,
    ewaybill: true,
    cgst: true,
    igst: true,
    sgst: true,
    tcs: true,
    price:true,
    product: true,
    sealNo: false,
    // Add more columns here if needed
  });

  const [selectedColumns, setSelectedColumns] = useState(Object.keys(columnVisibility).filter(key => columnVisibility[key]));

  useEffect(() => {
    const fetchJson = async () => {
      try {
        const response = await fetchData();
        setJsonData(response);
      } catch (error) {
        console.error('Error fetching JSON:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJson();
  }, [fetchData]);

  const toggleColumnVisibility = (columnKey) => {
    console.log('columnKey', columnKey);
    setColumnVisibility(prevState => {
      if (Object.hasOwnProperty.call(prevState, columnKey)) {
        return {
          ...prevState,
          [columnKey]: !prevState[columnKey]
        };
      }
      return false; // Column key doesn't exist, return previous state
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

  const handleChange = (event) => {
    console.log(event);
    const selectedColumn = event.target.value;

    setSelectedColumns(selectedColumn);
    console.log('selectedColumn', selectedColumn[selectedColumn.length - 1]);
    toggleColumnVisibility(selectedColumn[selectedColumn.length - 1]);
  };

  const handleDelete = (columnKey) => {
    const newSelectedColumns = selectedColumns.filter((selectedColumn) => selectedColumn !== columnKey);
    setSelectedColumns(newSelectedColumns);
    toggleColumnVisibility(columnKey);
  };

  const tableRef = useRef(null);

  const generatePDF = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      const htmlContent = tableRef.current.outerHTML;
      newWindow.document.write(htmlContent);
      newWindow.document.close();
      newWindow.document.getElementsByTagName('html')[0].style = 'width: 594mm; height: 841mm;'; // A1 size in landscape orientation

      newWindow.print();
    } else {
      console.error('Failed to open new window for PDF generation.');
    }
  };



  return (
    <Paper elevation={3} style={{ margin: '16px 0', maxHeight: '100%', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', pr: '16px', pt: '16px' }}>
      <FormControl sx={{ m: 1, mx:'30px', maxWidth: '70vw',  }}>
            <InputLabel id="demo-multiple-chip-label">Select Columns</InputLabel>
            <Box sx={{ maxHeight: 70, overflowY: 'scroll' }}>
              <Select
                MenuProps={{
                  sx: {
                    "&& .Mui-selected": {
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                    }
                  }
                }}
                sx={{ minWidth: '70vw' }}
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={selectedColumns}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Select Columns" />}
                renderValue={(selected) => (
                  <Box sx={{ width: '100%' }}> {/* Adjust width as needed */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={renderTableHeader(value)} onDelete={() => handleDelete(value)} />
                      ))}
                    </Box>
                  </Box>
                )}
              >
                {Object.keys(columnVisibility).map((columnKey) => (
                  <MenuItem key={columnKey} value={columnKey}>
                    {renderTableHeader(columnKey)}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </FormControl>
        <ButtonGroup variant="outlined" aria-label="outlined button group" size='small'>
          
          <Button sx={{ maxHeight: 55, mt: 0.8 }} onClick={generatePDF}>PDF</Button>
          <Button sx={{ maxHeight: 55, mt: 0.8 }} onClick={downloadCSV}>EXCEL</Button>
        </ButtonGroup>
      </Box>
      {!loading ? (
        <Typography variant="body1" sx={{ px: '30px', mb: '20px' }}>
          <table ref={tableRef} style={{ borderSpacing: 0 }}>
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
                        {renderTableCell(key, item, index + 1) ?? '-'}
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
  renderTableHeader: PropTypes.func.isRequired,
  renderTableCell: PropTypes.func.isRequired,
  fetchData: PropTypes.any
}

export default RenderTableFromJson;
