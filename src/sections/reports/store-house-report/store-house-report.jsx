import { Button, Card, MenuItem, Select, Stack, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import { DatePicker } from '@mui/x-date-pickers';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';


export default function StoreHouseReportView() {
  const [selectedOption, setSelectedOption] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const selectedUser = useSelector((state) => state.user.selectedUser);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };



  const handleFromDateChange = (date) => {

    setFromDate(date);
  };

  const handleToDateChange = (date) => {

    setToDate(date);
  };

  const formateDate = (date) => date.toDate().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });


  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const IframeBody = () => (
    <iframe
      src={`http://192.46.215.236/reports/store_reports_rg1/?mill_pk=${encodeURIComponent(selectedOption)}
      &from_date=${encodeURIComponent(formateDate(fromDate))}&to_date=${encodeURIComponent(formateDate((toDate)))}`}
      title="Order Dashboard"
      style={{
        height: '100vh',
        width: '100%',
        border: 'none',
        marginTop: '20px',
      }}
    />
  );

  const FullScreen = ({ title }) => (
    <Button onClick={toggleFullScreen} variant="outlined" color="primary">
      {title}
    </Button>
  );

  FullScreen.propTypes = {
    title: PropTypes.string.isRequired,
  };

  return (
    <>
      {isFullScreen ? (
        <Card sx={{ p: 2, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
          <FullScreen title='Exit Full Screen' />
          {selectedOption &&fromDate&&toDate&& <IframeBody />}
        </Card>
      ) : (
        <Card sx={{ p: 2 }}>
          <Stack direction="row" spacing={2}>
            <Stack>
              <Typography sx={{ pb: 2 }} color="grey" fontWeight="bold">
                Select mill
              </Typography>
              <Select
                value={selectedOption}
                onChange={handleSelectChange}
                displayEmpty
                style={{ width: '250px' }}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value="" disabled>
                  Select a mill
                </MenuItem>
                {selectedUser.mills.map((mill) => (
                  <MenuItem key={mill.id} value={mill.id}>
                    {mill.name}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack>
              <Typography sx={{ pb: 2 }} color="grey" fontWeight="bold">
                From Date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer sx={{ mt: -1.2 }} components={['DatePicker']}>
                  <DatePicker
                    value={fromDate}
                    onChange={handleFromDateChange}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Stack>
            <Stack>
              <Typography sx={{ pb: 2 }} color="grey" fontWeight="bold">
                To Date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer sx={{ mt: -1.2 }} components={['DatePicker']}>
                  <DatePicker
                    value={toDate}
                    onChange={handleToDateChange}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Stack>
          </Stack>
          {selectedOption &&fromDate&&toDate && <IframeBody />}
          {selectedOption &&fromDate&&toDate&& <FullScreen title='Go to Full Screen' />}
        </Card>
      )}
    </>
  );
}
