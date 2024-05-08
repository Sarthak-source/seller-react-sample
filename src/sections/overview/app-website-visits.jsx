import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import PropTypes from 'prop-types';
import { useState } from 'react';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Chart, { useChart } from 'src/components/chart';

export default function AppWebsiteVisits({ title, subheader, chart, ...other }) {
  const { labels, colors, series, options, invoiceData } = chart;

  const [selectedLabel, setSelectedLabel] = useState(labels[0]); // Initial selected label

  // Configure chart options
  const chartOptions = useChart({
    chart: {
      type: 'line', // Set the chart type to line
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM',
          day: 'dd',
          hour: 'HH',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Quantity',
      },
    },
    tooltip: {
      x: {
        format: 'MMM yyyy',
      },
    },
  });

  const formattedInvoiceData = invoiceData ? invoiceData.map(({ date, invoice_qty }) => {
    let currentDate;
    // Check if the date is in "YYYY-MM-DD" format or "12 AM"
    if (date.includes("-")) {
      // Date is in "YYYY-MM-DD" format
      currentDate = new Date(date);
    } else {
      // Date is in "12 AM" format, set it to 6 AM
      currentDate = new Date();
      const hour = parseInt(date.replace(/\D/g, ''), 10);
      currentDate.setHours(hour, 0, 0, 0);
    }
    return {
      x: currentDate.getTime(),
      y: invoice_qty,
    };
  }) : [];


  const maxQuantity = Math.max(...formattedInvoiceData.map(dataPoint => dataPoint.y));

  const highlightedData = formattedInvoiceData.map(dataPoint => ({
    x: dataPoint.x,
    y: dataPoint.y,
    fillColor: dataPoint.y === maxQuantity ? '#00CC00' : null,
    strokeColor: dataPoint.y === maxQuantity ? '#00CC00' : null,
    strokeWidth: dataPoint.y === maxQuantity ? 0 : 2,
  }));

  if (formattedInvoiceData.length > 0 && formattedInvoiceData.length <= 24) {
    chartOptions.xaxis.labels.datetimeFormatter.hour = 'HH';
  }

  console.log('maxQuantity', maxQuantity);

  return (
    <Card sx={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }} {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
      />

      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          dir="ltr"
          type="line"
          series={[{
            data: highlightedData, name: 'Invoice Quantity', type: 'column',
            fill: 'solid',
          }]}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}

AppWebsiteVisits.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
