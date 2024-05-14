import { Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import PropTypes from 'prop-types';
import ApexChart from 'react-apexcharts';

function LineChart({ productData }) {
  // Extracting dates, inward quantities, and outward quantities from productData
  const dates = productData?.product_data?.map(data => data?.date) || [];
  const inwardData = productData?.product_data?.map(data => data?.inward_qty) || [];
  const outwardData = productData?.product_data?.map(data => data?.outward_qty) || [];

  // ApexCharts options
  const options = {
    chart: {
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: dates,
      title: {
        text: 'Months',
      },
    },
    yaxis: {
      title: {
        text: 'Quantity',
      },
    },
    legend: {
      position: 'top',
    },
  };

  // ApexCharts series data
  const series = [
    {
      name: 'Inward',
      data: inwardData,
    },
    {
      name: 'Outward',
      data: outwardData,
    },
  ];

  return (
    productData && (
      <Card sx={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
        <CardHeader title="Total stock" />
        <Typography sx={{ ml: 3 }} variant="h4" color="secondary">
          {productData.total_stock_qty}
        </Typography>
        <ApexChart
          type="line"
          series={series}
          options={options}
          width="100%"
          height={400}
        />
      </Card>
    )
  );
}


LineChart.propTypes = {
  productData: PropTypes.any,
};

export default LineChart;
