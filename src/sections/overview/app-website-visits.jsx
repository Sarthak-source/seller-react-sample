import { Button, Dialog } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { addDays } from 'date-fns';
import { id } from 'date-fns/locale';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Chart, { useChart } from 'src/components/chart';

export default function AppWebsiteVisits({ title, subheader, chart, ...other }) {
  const { labels, colors, series, options } = chart;
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    key: 'selection'
  });
  const [selectedLabel, setSelectedLabel] = useState(labels[0]); // Initial selected label
  const [open, setOpen] = useState(false); // State for dialog visibility
  const chartOptions = useChart({
    chart: {
      type: 'line',
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

  const handleDateRangeChange = (ranges) => {
    setSelectedRange(ranges.selection);
  };

  return (
    <Card sx={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',}} {...other} >
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Stack spacing={2}>
            <Button variant="outlined" onClick={() => setOpen(true)}>
              Select Date Range
            </Button>

          </Stack>
        }
      />

      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          dir="ltr"
          type="line"
          series={series}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} sx={{ width: '80vw' }} PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "80vw!important",
        },
      }}>
        <DateRangePicker
          locale={id}
          onChange={handleDateRangeChange}
          showSelectionPreview
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={[selectedRange]}
          direction="horizontal"
          onClose={() => setOpen(false)}
        />
      </Dialog>
    </Card>
  );
}

AppWebsiteVisits.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
