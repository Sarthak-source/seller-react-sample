import { Card, Fab, MenuItem, Select, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ip } from 'src/app-utils/api-constants';
import Iconify from 'src/components/iconify';
import RenderHtmlFromLink from '../render-html';


export default function WarehouseReportView() {
  const [selectedOption, setSelectedOption] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const selectedUser = useSelector((state) => state.user.selectedUser);

  const handleSelectChange = (event) => {
    console.log('event.target.value', event.target.value);
    setSelectedOption(event.target.value);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const link=`http://${ip}/reports/wareHouse_reports/?mill_pk=${encodeURIComponent(selectedOption)}`

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
          {selectedOption && <FullScreen icon={<Iconify icon="bi:fullscreen-exit" />} />}
          {selectedOption && <RenderHtmlFromLink link={link} />}
        </Card>
      ) : (
        <Card sx={{ p: 2 }}>
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
              <MenuItem key={mill.name} value={mill.id}>
                {mill.name}
              </MenuItem>
            ))}
          </Select>

          {selectedOption && <RenderHtmlFromLink link={link} />}
          {selectedOption && <FullScreen icon={<Iconify icon="bi:fullscreen" />} />}
        </Card>
      )}
    </>
  );
}
