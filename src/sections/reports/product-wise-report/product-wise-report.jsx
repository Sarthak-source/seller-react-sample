import { Button, Stack, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';


export default function ProductWiseReportView() {
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const selectedUser = useSelector((state) => state.user.selectedUser);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const IframeBody = () => (
    <iframe
      src={`http://192.46.215.236/reports/product_reports/?mill_pk=${encodeURIComponent(selectedOption)}&product_pk=${encodeURIComponent(selectedProduct)}`}
      title="Order Dashboard"
      style={{
        height: '100vh',
        width: '100%',
        border: 'none',
        marginTop: '20px',
      }}
    />
  );

  const FullScreen = ({title}) => (
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
          {selectedOption && selectedProduct && <IframeBody />}
        </Card>
      ) : (
        <Card sx={{ p: 2 }}>
          <Stack direction="row">
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
            <Stack pl={5}>
              <Typography sx={{ pb: 2 }} color="grey" fontWeight="bold">
                Select product
              </Typography>
              {selectedOption && (
                <Select
                  value={selectedProduct}
                  onChange={handleProductChange}
                  displayEmpty
                  style={{ width: '250px' }}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value="" disabled>
                    Select a product
                  </MenuItem>
                  {selectedUser.mills
                    .find((mill) => mill.id === selectedOption)
                    ?.products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.product_type.product_type} {/* Use the appropriate property */}
                      </MenuItem>
                    ))}
                </Select>
              )}
            </Stack>
          </Stack>
          {selectedOption && selectedProduct && <IframeBody />}
          {selectedOption && selectedProduct && <FullScreen title='Go to full Screen' />}
        </Card>
      )}
    </>
  );
}
