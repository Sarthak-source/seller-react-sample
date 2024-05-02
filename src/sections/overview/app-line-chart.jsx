import { Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ApexChart from 'react-apexcharts';

function LineChart() {
  // Sample data for inward and outward quantities
  const inwardData = [50, 46, 45, 60, 70, 80, 70];
  const outwardData = [90, 55, 55, 50, 60, 70, 50];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  // ApexCharts options
  const options = {
    chart: {
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: months,
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
    <Card sx={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
      <CardHeader title="Total stock" />

      
      <Typography sx={{ml:3}} variant="h4" color="secondary">4,24,720 QTY</Typography>
      <ApexChart
        type="line"
        series={series}
        options={options}
        width="100%"
        height={400}
      />
      
    </Card>
  );
}

export default LineChart;


