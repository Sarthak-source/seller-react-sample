import { useTheme } from '@emotion/react';
import { Box, Button, ButtonGroup, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Paper, Select, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';


/**
 * RenderTableFromJson is a reusable React component that fetches JSON data, dynamically renders
 * a table based on the data, and provides options to download the table content as a PDF or Excel file.
 * Users can also toggle the visibility of specific columns.
 * 
 * @param {Function} renderTableHeader - A function that takes a column key and returns the header label for that column.
 * @param {Function} renderTableCell - A function that takes a column key, data item, and row index, and returns the cell content for that column.
 * @param {Function} fetchData - A function that fetches the JSON data.
 * @param {string} usedIn - A string to identify where the component is used, affecting data handling logic.
 * @param {Object} columns - An object where keys are column identifiers and values are booleans indicating visibility.
 */


const RenderTableFromJson = ({
  renderTableHeader,
  renderTableCell,
  fetchData,
  usedIn,
  columns,
}) => {
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const [columnVisibility, setColumnVisibility] = useState(columns);

  const [selectedColumns, setSelectedColumns] = useState(Object.keys(columnVisibility).filter(key => columnVisibility[key]));

  // Fetch data on component mount
  useEffect(() => {
    const fetchJson = async () => {
      try {
        const response = await fetchData();
        console.log('JavaScript', response)
        if (usedIn === 'OrderReportView') {
          setJsonData(response.results);
        } else {
          setJsonData(response);
        }
      } catch (error) {
        console.error('Error fetching JSON:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJson();
  }, [fetchData, usedIn]);

  // Toggle column visibility

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



  // Function to download table data as an Excel file
  const downloadCSV = () => {
    // Check if there is JSON data available
    if (jsonData) {
      // Reference the table element
      const table = tableRef.current;

      // Select all table rows and convert them to an array
      const rows = Array.from(table.querySelectorAll('tr'));

      // Map each row to an array of its cell values (text content)
      const data = rows.map(row => {
        // Select all cells in the current row and convert them to an array
        const cells = Array.from(row.querySelectorAll('td, th'));

        // Map each cell to its trimmed text content
        return cells.map(cell => cell.textContent.trim());
      });

      // Create a worksheet from the 2D array of data
      const worksheet = XLSX.utils.aoa_to_sheet(data);

      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Append the worksheet to the workbook with the name 'Sheet1'
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // Write the workbook to a file named 'data.xlsx' and trigger a download
      XLSX.writeFile(workbook, 'data.xlsx');
    } else {
      // Log an error if no JSON data is available
      console.error('No JSON data available to download.');
    }
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


  console.log('jsonData', jsonData)

  return (
    <Paper elevation={3} style={{ margin: '16px 0', maxHeight: '100%', overflow: 'auto' }}>
      {usedIn !== 'OrderReportView' && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', pr: '16px', pt: '16px' }}>
          <FormControl sx={{ m: 1, mx: '30px', maxWidth: '70vw', }}>
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
      )}
      {!loading ? (
        <Typography variant="body1" sx={{ px: '30px', mb: '20px' }}>
          <table ref={tableRef} style={{ borderSpacing: 0 }}>
            <thead>
              <tr>
                {Object.entries(columnVisibility).map(([key, visible]) =>
                  visible && (
                    <th key={key} style={{ border: '1px solid black', padding: '8px', borderSpacing: 0 }}>
                      {renderTableHeader(key, jsonData && jsonData[0]?.tender_head?.product?.product_type?.unit)}
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
  fetchData: PropTypes.any,
  usedIn: PropTypes.any,
  columns: PropTypes.any,
}

export default RenderTableFromJson;
