
import { Card, Fab, MenuItem, Select, Stack, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import Iconify from 'src/components/iconify';

import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ip } from 'src/app-utils/api-constants';
import Scrollbar from 'src/components/scrollbar';
import RenderHtmlFromLink from '../render-html';


export default function DispatchReportView() {
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const selectedUser = useSelector((state) => state.user.selectedUser);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSelectInvoice = (event) => {
    setSelectedInvoice(event.target.value);
  };

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const formateDate = (date) => {
    console.log('Received date:', date);


    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    console.log('Formatted date:', formattedDate);
    return formattedDate;
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const FullScreen = ({ icon }) => (
    <Fab onClick={toggleFullScreen} color="primary" sx={{ mt: 2, position: 'fixed', top: "85%", right: 16 }}>
      {icon}
    </Fab>
  );

  FullScreen.propTypes = {
    icon: PropTypes.string.isRequired,
  };

  console.log('selectedInvoice',selectedInvoice)

  const invoiceTypes = ['all', 'unload', 'cancelled'];

  return (
    <>
      {isFullScreen ? (
        <Card sx={{ p: 2, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
          {selectedOption && fromDate && toDate && selectedInvoice && <FullScreen icon={<Iconify icon="bi:fullscreen-exit" />} />}
          {selectedOption && fromDate && toDate && selectedInvoice && <RenderHtmlFromLink
            link={`http://${ip}/reports/dispatch_reports/?mill_pk=${encodeURIComponent(selectedOption)}
                 &from_date=${encodeURIComponent(formateDate(fromDate))}&to_date=${encodeURIComponent(formateDate((toDate)))}&invoice_type=${encodeURIComponent(selectedInvoice)}`} />}
        </Card>
      ) : (
        <Card sx={{ p: 2 }}>
           <Scrollbar>

           <Stack direction="row" spacing={2}>
            <Stack>
              <Typography sx={{ pb: 2 }} color="grey" fontWeight="bold" fontSize={13.5}>
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
              <Typography sx={{ pb: 2 }} color="grey" fontWeight="bold" fontSize={13.5}>
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
              <Typography sx={{ pb: 2 }} color="grey" fontWeight="bold" fontSize={13.5}>
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

            <Stack>
              <Typography sx={{ pb: 2 }} color="grey" fontWeight="bold" fontSize={13.5}>
                Invoice type
              </Typography>
              <Select
                value={selectedInvoice}
                onChange={handleSelectInvoice}
                displayEmpty
                style={{ width: '250px' }}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value="" disabled>
                  Select a Invoice type
                </MenuItem>
                {invoiceTypes.map((invoiceType) => (
                  <MenuItem key={invoiceType} value={invoiceType}>
                    {invoiceType}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Stack>

           </Scrollbar>

          
          {selectedOption && fromDate && toDate && selectedInvoice && <RenderHtmlFromLink
            link={`http://${ip}/reports/dispatch_reports/?mill_pk=${encodeURIComponent(selectedOption)}&from_date=${encodeURIComponent(formateDate(fromDate))}&to_date=${encodeURIComponent(formateDate((toDate)))}&invoice_type=${encodeURIComponent(selectedInvoice)}`} />}
          {selectedOption && fromDate && toDate && selectedInvoice && <FullScreen icon={<Iconify icon="bi:fullscreen" />} />}
        </Card>
      )}
    </>
  );
}
