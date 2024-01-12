import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Card, InputAdornment, MenuItem, Select, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NetworkRepository from 'src/app-utils/network_repository';

const OrderCreate = () => {
  const selectedUser = useSelector((state) => state.user.selectedUser);

  const [millValue, setMillValue] = useState({});
  const [product, setProduct] = useState('');
  const [qtyUnit, setQtyUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rate, setRate] = useState('');
  const [remark, setRemark] = useState('');
  const [mills, setMill] = useState(selectedUser.mills);
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


  const handleMillChange = (event) => {
    const newValue = event.target.value;
    setMillValue(newValue);
    setProduct(newValue.products);
  };

  const handleProductChange = (newValue) => {
    setQtyUnit(newValue.target.value.product_type.unit)
    setProduct(newValue.target.value);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true)
      if (millValue.id === '') {
        showSnackbar('Please select mill.', 'error');
      } else if (product.id === '') {
        showSnackbar('Please select product.', 'error');
      } else if (quantity === '') {
        showSnackbar('Please enter quantity.', 'error');
      } else if (rate === '') {
        showSnackbar('Please enter rate.', 'error');
      } else {
        await NetworkRepository.tenderPostView(
          millValue.id,
          product.id,
          quantity,
          rate ?? '',
          selectedUser.id,
          remark,
          [],
          false,
          'Offline',
        ).then(async (tender) => {
          console.log('tender.idherewe', tender.id)
          await NetworkRepository.tenderUpdate(tender.id, "Active", selectedUser.id).then(async (tenderUpadate) => {
            await NetworkRepository
              .orderPostView(
                rate,
                quantity,
                '',
                remark,
                tenderUpadate.id,
                '172',
              )
              .then(async (order) => {
                await NetworkRepository.orderUpdateStatus(
                  order.id,
                  "Approved",
                  selectedUser.id);
              });
          })
        });

        // Your existing logic here
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

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ height: 1, pt: 2 }}>

      <Card onMouseEnter={(e) => {
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
        }}>
        <Typography variant="h4" sx={{ pb: 2 }}>Add self order</Typography>
        <Stack spacing={3} pb={2} pt={1}>

          <Select
            value={Object.keys(millValue).length === 0 ? '' : millValue}
            onChange={handleMillChange}
            displayEmpty  // Use displayEmpty to show the initial empty value
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value="" disabled>
              Select Mill
            </MenuItem>
            {mills.map((mill) => (

              <MenuItem key={mill.id} value={mill}>
                {mill.name}
              </MenuItem>
            ))}
          </Select>
          {millValue && millValue.products && (
            <Select value={millValue && product ? product : ''}
              onChange={handleProductChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}>
              <MenuItem value='' disabled>
                Select Product
              </MenuItem>

              {millValue.products.map((product_selected) => (
                <MenuItem key={product_selected.id} value={product_selected}>
                  {product_selected.code}
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

          <TextField
            label={`Rate per ${qtyUnit}`}
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">per {qtyUnit}</InputAdornment>,
            }}
          />

          <TextField
            label="Remarks"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </Stack>
        <LoadingButton loading={loading} fullWidth variant="contained" size="large" color="primary" onClick={handleSubmit} >
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

export default OrderCreate;
