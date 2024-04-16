import { Card, Fab, MenuItem, Select, Stack, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';

import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';
import Scrollbar from 'src/components/scrollbar';
import RenderTableFromJson from '../render-html-from-json';
import useRenderFunctions from '../use-report-formate';


export default function OrderReportView() {
  const [selectedOption, setSelectedOption] = useState('');
  const [date, setDate] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const { renderOrderTableHeader, renderOrderTableCell, orderColumns } = useRenderFunctions(); // Use the custom hook


  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };


  const handleToDateChange = (selectedDate) => {
    setDate(selectedDate)
  };


  const formateDate = (selectedDate) => {
    const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
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



  return (
    <>
      {isFullScreen ? (
        <Card sx={{ p: 2, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
          {selectedOption && date && <FullScreen icon={<Iconify icon="bi:fullscreen-exit" />} />}
          {selectedOption && date && (
            <RenderTableFromJson
              fetchData={() => NetworkRepository.ordersReports(formateDate(date), selectedOption, selectedUser.id)}
              renderTableHeader={renderOrderTableHeader}
              renderTableCell={renderOrderTableCell}
              usedIn='OrderReportView'
              columns={orderColumns}
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
                  <Stack>
                    <Typography sx={{ pb: 2 }} color="grey" fontWeight="bold" fontSize={13.5}>
                      Select date
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer sx={{ mt: -1.2 }} components={['DatePicker']}>
                        <DatePicker
                          value={date}
                          onChange={handleToDateChange}
                          format="DD-MMM-YYYY"
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Stack>

                </Stack>
              </Scrollbar>
            </Scrollbar>
          </Scrollbar>
          {selectedOption && date && (
            <RenderTableFromJson
              fetchData={() => NetworkRepository.ordersReports(formateDate(date), selectedOption, selectedUser.id)}
              renderTableHeader={renderOrderTableHeader}
              renderTableCell={renderOrderTableCell}
              usedIn='OrderReportView'
              columns={orderColumns}
            />
          )}
          {selectedOption && date && (
            <FullScreen icon={<Iconify icon="bi:fullscreen" />} />
          )}
        </Card>
      )}
    </>
  );
}

