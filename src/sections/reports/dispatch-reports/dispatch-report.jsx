import { Card, Fab, MenuItem, Select, Stack, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import moment from 'moment';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';

import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ip } from 'src/app-utils/api-constants';
import Scrollbar from 'src/components/scrollbar';
import RenderTableFromJson from '../render-html-from-json';


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
    if (fromDate && date.diff(fromDate, 'days') > 0) {
      alert('From date cannot be greater than to date.');
      setFromDate(null);
    } if (toDate && toDate.diff(date, 'days') > 30) {
      alert('From date must be within one months from the to date.');
      setFromDate(null);

    } else if (fromDate && date.diff(fromDate, 'days') > 30) {
      alert('To date must be within one months from the from date.');
      setFromDate(null);

    } else {
      setFromDate(date);
    }
  };


  const handleToDateChange = (date) => {
    const today = moment();
    if (fromDate && date.diff(fromDate, 'days') < 0) {
      alert('To date cannot be less than From date.');
      setToDate(null);
    } else if (fromDate && date.diff(fromDate, 'days') > 30) {
      alert('To date must be within one month from the from date.');
      setToDate(null);
    } else if (fromDate && fromDate.diff(date, 'days') > 30) {
      alert('From date must be within one month from the to date.');
      setToDate(null);
    } else if (date.diff(today, 'days') > 0) {
      alert('To date cannot be greater than today\'s date.');
      setToDate(null);
    } else {
      setToDate(date);
    }
  };

  const now = new Date();
  const yesterdayBegin = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const [value, onChange] = useState([yesterdayBegin, todayEnd]);


  const formateDate = (date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
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

  const invoiceTypes = ['all', 'unload', 'cancelled'];

  console.log(`http://${ip}/reports/dispatch_reports/?mill_pk=${encodeURIComponent(selectedOption)}
  &from_date=${encodeURIComponent(formateDate(fromDate))}&to_date=${encodeURIComponent(formateDate((toDate)))}&invoice_type=${encodeURIComponent(selectedInvoice)}`);

  return (
    <>
      {isFullScreen ? (
        <Card sx={{ p: 2, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
          {selectedOption && fromDate && toDate && selectedInvoice && <FullScreen icon={<Iconify icon="bi:fullscreen-exit" />} />}
          {selectedOption && fromDate && toDate && selectedInvoice && (
            <RenderTableFromJson
              millPk={selectedOption}
              fromDate={formateDate(fromDate)}
              toDate={formateDate(toDate)}
              invoiceType={selectedInvoice}
            />
          )}
        </Card>
      ) : (
        <Card sx={{ p: 2 }}>
          <Scrollbar>
            <Scrollbar>
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
                  {/* <DateRangePicker
                    calendarAriaLabel="Toggle calendar"
                    clearAriaLabel="Clear value"
                    dayAriaLabel="Day"
                    monthAriaLabel="Month"
                    nativeInputAriaLabel="Date"
                    onChange={onChange}
                    value={value}
                    yearAriaLabel="Year"
                  /> */}
                  <Stack>
                    <Typography sx={{ pb: 2 }} color="grey" fontWeight="bold" fontSize={13.5}>
                      From date
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer sx={{ mt: -1.2 }} components={['DatePicker']}>
                        <DatePicker
                          value={fromDate}
                          onChange={handleFromDateChange}
                          format="DD-MMM-YYYY"
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
                          format="DD-MMM-YYYY"
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
            </Scrollbar>
          </Scrollbar>
          {selectedOption && fromDate && toDate && selectedInvoice && (
            <RenderTableFromJson
              millPk={selectedOption}
              fromDate={formateDate(fromDate)}
              toDate={formateDate(toDate)}
              invoiceType={selectedInvoice}
            />
          )}
          {selectedOption && fromDate && toDate && selectedInvoice && (
            <FullScreen icon={<Iconify icon="bi:fullscreen" />} />
          )}
        </Card>
      )}
    </>
  );
}

