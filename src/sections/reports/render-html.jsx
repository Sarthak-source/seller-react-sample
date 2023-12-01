import { Box, Button, ButtonGroup, Paper, Typography } from '@mui/material';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';
import { useState } from 'react';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';

const RenderHtmlFromLink = ({ link }) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);

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
                font-size: 14px;
                padding-top: 10px;
                padding-bottom: 10px;
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
      const rows = Array.from(table.querySelectorAll('tr'));
      const excelContent = [];
      const mergedCells = new Set(); // Track merged cells to avoid duplication
  
      rows.forEach((row, rowIndex) => {
        const excelRow = [];
        const columns = Array.from(row.children);
  
        columns.forEach((column, colIndex) => {
          const cellContent = column.outerText;
          const rowspan = column.rowSpan || 1;
          const colspan = column.colSpan || 1;
  
          console.log('rowspan colspan', rowspan, colspan);
  
          if (rowspan > 1 || colspan > 1) {
            for (let i = 0; i < rowspan; i += 1) {
              for (let j = 0; j < colspan; j += 1) {
                const key = `${rowIndex + i}_${colIndex + j}`;
                console.log(key);
                if (!mergedCells.has(key)) {
                  mergedCells.add(key);
                  // Only add content for the first cell in the merged range
                  if (i === 0 && j === 0) {
                    excelRow.push(cellContent);
                  }
                }
              }
            }
          } else {
            excelRow.push(cellContent);
          }
        });
        excelContent.push(excelRow.join('\t'));
      });
  
      const excelData = excelContent.join('\n');
      console.log('excelData',excelData)
      const blob = new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
      const linkExcel = document.createElement('a');
      linkExcel.href = window.URL.createObjectURL(blob);
      linkExcel.download = 'table.xlsx';
      linkExcel.click();
    } else {
      console.error('No table element found with class "dataTable".');
    }
  };
  

  return (
    <Paper elevation={3} style={{ margin: '16px 0', maxHeight: '100%', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: '16px', pt: '16px' }}>
        <ButtonGroup variant="outlined" aria-label="outlined button group" size='small'>
          <Button onClick={downloadExcel}>EXCEL</Button>
          <Button onClick={downloadPDF}>PDF</Button>
        </ButtonGroup>
      </Box>
      {!loading ? (
        <Typography variant="body1" sx={{ px: '30px', mb: '20px' }} dangerouslySetInnerHTML={{ __html: htmlContent }} />
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
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
