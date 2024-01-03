import { LoadingButton } from '@mui/lab';
import { Alert, Card, InputAdornment, MenuItem, Select, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NetworkRepository from 'src/app-utils/network_repository';

const DeliveryCreate = () => {
  const selectedUserConfig = useSelector((state) => state.user.selectUserConfig);

  const [doType, setDoType] = useState(selectedUserConfig.internal_sub_type);
  const [mill, setMill] = useState(selectedUserConfig.seller.mills);
  const [product, setProduct] = useState({});
  const [millValue, setMillValue] = useState({});
  const [qtyUnit, setQtyUnit] = useState('');
  const [deliveryOrder, setDeliveryOrder] = useState({});
  const [quantity, setQuantity] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const nav = () => {
    setTimeout(() => {
      navigate(`/home/`);
    }, 2000);
  };

  const handleDoTypeChange = (event) => {
    const newValue = event.target.value;
    setDeliveryOrder(newValue);
  };

  const handleMillChange = (event) => {
    const newValue = event.target.value;
    setMillValue(newValue);

    setProduct(newValue.products);
  };

  const handleProductChange = (event) => {
    const newValue = event.target.value;
    setQtyUnit(newValue.product_type.unit)
    setProduct(newValue);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true)
      if (millValue.id === '') {
        showSnackbar('Please select mill.', 'error');
      }
      else if (deliveryOrder === '') {
        showSnackbar('Select Do Type', 'error');
      }
      else if (product.id === '') {
        showSnackbar('Please select product.', 'error');
      } else if (quantity === '') {
        showSnackbar('Please enter quantity.', 'error');
      } else if (vehicleNo === '') {
        showSnackbar('Please enter vehicle number.', 'error');
      
      } else {
        await NetworkRepository.generateInternalDO(
          millValue.id,
          product.id,
          quantity,
          vehicleNo,
          deliveryOrder,
        )
        showSnackbar('Tender and order created successfully.', 'success');
        nav();
      }
    } catch (error) {
      console.error('Error creating tender:', error);
      showSnackbar('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false)
    }
  };

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ height: 1, pt: 2 }}>
      <Card
        onMouseEnter={(e) => {
          e.currentTarget.style.borderRadius = '8px';
          e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';

        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderRadius = '8px';
          e.currentTarget.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.2)';
        }}
        sx={{
          p: 5,
          width: 1,
          maxWidth: 600,
        }}
      >
        <Typography variant="h4" sx={{ pb: 2 }}>Internal Do</Typography>

        <Stack spacing={3} pb={2} pt={1}>
          <Select
            value={deliveryOrder}
            onChange={handleDoTypeChange}
          >
            <MenuItem value={deliveryOrder} disabled>
              Select Internal Do Type
            </MenuItem>
            {doType.map((doItem) => (
              <MenuItem key={doItem.id} value={doItem}>
                {doItem.sub_type}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={millValue}
            onChange={handleMillChange}
          >
            <MenuItem value={millValue} disabled>
              Select Mill
            </MenuItem>
            {mill.map((millItem) => (
              <MenuItem key={millItem.id} value={millItem}>
                {millItem.name}
              </MenuItem>
            ))}
          </Select>

          {millValue && millValue.products && (

            <Select
              value={millValue && product ? product : ''}
              onChange={handleProductChange}
            >
              <MenuItem value='' disabled>
                Select Product
              </MenuItem>
              {millValue.products.map((productItem) => (
                <MenuItem key={productItem.id} value={productItem}>
                  {productItem.code}
                </MenuItem>
              ))}
            </Select>

          )}

          <TextField
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">{qtyUnit}</InputAdornment>,
            }}
          />

          {deliveryOrder !== "Within Premises" && (

            <TextField
              label="Vehicle"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
            />

          )}



        </Stack>

        <LoadingButton loading={loading} fullWidth size="large" variant="contained" onClick={handleSubmit}>
          Submit
        </LoadingButton>

      </Card>



      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>


    </Stack>
  );
};

export default DeliveryCreate;
