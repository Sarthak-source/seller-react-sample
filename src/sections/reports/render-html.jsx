import { Box, Button, ButtonGroup, Paper, Typography } from '@mui/material';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';
import { useState } from 'react';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';
import * as XLSX from 'xlsx';

const RenderHtmlFromLink = ({ link }) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);

  const width = window.resizeTo(window.innerWidth, window.innerHeight);

  const fetchHtml = async () => {
    try {
      const response = await fetch(link);
      const html = await response.text();

      console.log(html);
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const navbarElement = doc.querySelector('.navbar');
      if (navbarElement) {
        navbarElement.remove();
      }

      const sanitizedHtml = DOMPurify.sanitize(doc.documentElement.innerHTML, { FORCE_BODY: true });

      const styledHtml = `
        <html>
          <head>
            <style>
              table {
                width: 100%;
                margin-top: 30px;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid black;
                text-align: center;
                padding-top: 10px;
                padding-bottom: 10px;
                font-family: 'Public Sans', sans-serif;
              }              
              b,td {
                font-size: 15px;
                font-family: 'Public Sans', sans-serif;
              }
              h3{
                font-size: 16px;
                font-family: Public Sans, sans-serif;
              }         
              h2{
                font-size:22px;
                font-family: Public Sans, sans-serif;
              }
              h4 {
                font-size:16px;
              font-family: Public Sans, sans-serif;
              }
              h1{
                font-size:20px;
              font-family: Public Sans, sans-serif;
              }
              title {
                font-family: Public Sans, sans-serif;
              }
            </style>
          </head>
          <body>
            ${sanitizedHtml}
          </body>
        </html>
      `;

      console.log(styledHtml);

      setHtmlContent(styledHtml);
    } catch (error) {
      console.error('Error fetching HTML:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchHtml();

  const downloadPDF = () => {
    const newWindow = window.open('', '_blank');
    newWindow.document.write(htmlContent);
    newWindow.print();
  };

  const downloadExcel = () => {
    const table = document.querySelector('.dataTable');
    if (table) {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.table_to_sheet(table);

      // Iterate through rows and columns to merge cells based on rowspan and colspan
      table.querySelectorAll('tr').forEach((row, rowIndex) => {
        row.querySelectorAll('td').forEach((cell, colIndex) => {
          const rowspan = cell.rowSpan;
          const colspan = cell.colSpan;

          // Handle rowspan
          if (rowspan && rowspan > 1) {
            for (let i = 1; i < rowspan; i += 1) {
              const nextRow = row.nextElementSibling;
              if (nextRow) {
                const nextCell = nextRow.children[colIndex];
                if (nextCell) {
                  // Merge cells using xlsx library's range setting
                  const range = {
                    s: { r: rowIndex, c: colIndex },
                    e: { r: rowIndex + rowspan - 1, c: colIndex },
                  };
                  worksheet['!merges'] = worksheet['!merges'] || [];
                  worksheet['!merges'].push(range);

                  // Apply style to center text
                  const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });

                  if (worksheet[cellAddress]) {
                    worksheet[cellAddress].s = worksheet[cellAddress].s || {};
                    worksheet[cellAddress].s.alignment = {
                      horizontal: 'center',
                      vertical: 'center',
                    };
                  } else {
                    console.error(`Cell at address ${cellAddress} does not exist in the worksheet.`);
                  }
                }
              }
            }
          }

          // Handle colspan
          if (colspan && colspan > 1) {
            for (let j = 1; j < colspan; j += 1) {
              const nextCell = row.children[colIndex + j];
              if (nextCell) {
                // Merge cells using xlsx library's range setting
                const range = {
                  s: { r: rowIndex, c: colIndex },
                  e: { r: rowIndex, c: colIndex + colspan - 1 },
                };
                worksheet['!merges'] = worksheet['!merges'] || [];
                worksheet['!merges'].push(range);

                // Apply style to center text
                const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex + j });

                // Check if the cell exists in the worksheet
                if (worksheet[cellAddress]) {
                  // Merge cells using xlsx library's range setting
                  const colrange = {
                    s: { r: rowIndex, c: colIndex },
                    e: { r: rowIndex, c: colIndex + colspan - 1 },
                  };
                  worksheet['!merges'] = worksheet['!merges'] || [];
                  worksheet['!merges'].push(colrange);

                  // Apply style to center text
                  worksheet[cellAddress].s = worksheet[cellAddress].s || {};
                  worksheet[cellAddress].s.alignment = {
                    horizontal: 'center',
                    vertical: 'center',
                  };
                } else {
                  console.error(`Cell at address ${cellAddress} does not exist in the worksheet.`);
                }

              }
            }
          }
        });
      });

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // Write the workbook to a file using xlsx writeFile
      XLSX.writeFile(workbook, 'table.xlsx');
    } else {
      console.error('No table element found with class "dataTable".');
    }
  };

  return (
    <Paper
      onMouseEnter={(e) => {
        e.currentTarget.style.borderRadius = '8px';
        e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderRadius = '8px';
        e.currentTarget.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.2)';
      }}

      elevation={3}
      style={{ margin: '16px 0', maxHeight: '100%', maxWidth: width, overflow: 'auto' }}

    >
      <Box
        sx={{ display: 'flex', justifyContent: 'flex-end', pr: '16px', pt: '16px' }}
      >
        <ButtonGroup variant="outlined" aria-label="outlined button group" size='small'
          style={{ position: 'sticky', top: '0', zIndex: '1', backgroundColor: 'white' }}
        >
          <Button onClick={downloadExcel}>EXCEL</Button>
          <Button onClick={downloadPDF}>PDF</Button>
        </ButtonGroup>
      </Box>
      {!loading ? (

        <Typography variant="body1"
          sx={{ px: '30px', mb: '20px' }}
          dangerouslySetInnerHTML={{ __html: htmlContent }} />
      ) : (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '600px' }}>
          <SkeletonLoader />
        </Box>
      )}
    </Paper>
  );
};

RenderHtmlFromLink.propTypes = {
  link: PropTypes.string.isRequired,
};

export default RenderHtmlFromLink;
