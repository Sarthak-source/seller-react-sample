import { Button, Card, MenuItem, Select, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function StockReportView() {
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

  const IframeBody = () => (
    <iframe
      src={`http://192.46.215.236/reports/stock_reports/?mill_pk=${encodeURIComponent(selectedOption)}`}
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
          {selectedOption && <IframeBody />}
        </Card>
      ) : (
        <Card sx={{ p: 2 }}>
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
              <MenuItem key={mill.name} value={mill.id}>
                {mill.name}
              </MenuItem>
            ))}
          </Select>

          {selectedOption && <IframeBody />}
          {selectedOption && <FullScreen title='Go to full Screen' />}
        </Card>
      )}
    </>
  );
}
