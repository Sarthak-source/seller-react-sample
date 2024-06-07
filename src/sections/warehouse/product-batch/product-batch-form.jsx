import { Card, Snackbar, Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';

const ProductBatchForm = () => {
  const [product, setProduct] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [batchStartDate, setBatchStartDate] = useState('');
  const [batchEndDate, setBatchEndDate] = useState('');
  const [status, setStatus] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const selectedUserConfig = useSelector((state) => state.user.selectUserConfig);

  const productBatch = useSelector((state) => state.warehouseUpdate.productBatches);


  console.log('selectedUserConfig', selectedUserConfig);

  console.log('lol', productBatch);

  const isUpdate = Object.keys(productBatch).length === 0;


  const handleAutoGenerate = () => {
    const randomBatchNumber = Math.floor(10000000 + Math.random() * 90000000); // Generate a random 8-digit number
    setBatchNumber(randomBatchNumber.toString()); // Convert the number to a string and set it as the batch number
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'product':
        setProduct(value);
        break;
      case 'batchNumber':
        setBatchNumber(value);
        break;
      case 'batchStartDate':
        setBatchStartDate(value);
        break;
      case 'batchEndDate':
        setBatchEndDate(value);
        break;
      case 'status':
        setStatus(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isUpdate) {

      try {
        await NetworkRepository.postProductBatch(product, batchNumber, batchStartDate, batchEndDate, selectedUserConfig.seller.user);
        setSnackbarMessage('Product batch added successfully');
        setSnackbarSeverity('success');
      } catch (error) {
        setSnackbarMessage('Failed to add product batch');
        setSnackbarSeverity('error');
      } finally {
        setSnackbarOpen(true);
      }
      
    } else {
      console.log('helloeoeo')

      try {
        await NetworkRepository.postProductBatch(product, batchNumber, batchStartDate, batchEndDate, selectedUserConfig.seller.user);
        setSnackbarMessage('Product batch updated successfully');
        setSnackbarSeverity('success');
      } catch (error) {
        setSnackbarMessage('Failed to updated product batch');
        setSnackbarSeverity('error');
      } finally {
        setSnackbarOpen(true);
      }
      
    }  
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  useEffect(() => {
    if (!isUpdate) {
      setProduct(productBatch.product); // Assuming productBatch has a product property
      setBatchNumber(productBatch.batch_num); // Assuming productBatch has a batch_num property
      setBatchStartDate(productBatch.batch_start_date ? productBatch.batch_start_date.split('T')[0] : ''); // Extracting date part only
      setBatchEndDate(productBatch.batch_end_date ? productBatch.batch_end_date.split('T')[0] : ''); // Extracting date part only
      setStatus(productBatch.is_active); // Assuming productBatch has an is_active property
    }
  }, [isUpdate, productBatch]);

  return (
    <Stack alignItems="center" justifyContent="center" sx={{  pt: 2 }}>
      <Card
        sx={{
          p: 5,
          width: 1,
          maxWidth: 600,
          borderRadius: '8px',
          boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            boxShadow: '5px 5px 10px rgba(77, 182, 172,0.9)',
          },
        }}
      >
        <Typography variant="h4" sx={{ pb: 2 }}>Add Product Batch</Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="product">Product</InputLabel>
            <Select
              labelId="product"
              id="product"
              value={product}
              label="Product"
              name="product"
              onChange={handleChange}
            >
              {selectedUserConfig.seller.products.map((item) => (
                <MenuItem key={item.id} value={item.id}>{item.product_type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            id="batchNumber"
            label="Batch Number"
            name="batchNumber"
            value={batchNumber}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <Button
                  variant="contained"
                  sx={{ mt: 2, mr: 2,mb:2 }}
                  onClick={handleAutoGenerate}
                >
                  Auto Generate
                </Button>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="batchStartDate"
            label="Batch Start Date"
            name="batchStartDate"
            type="date"
            value={batchStartDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="batchEndDate"
            label="Batch End Date"
            name="batchEndDate"
            type="date"
            value={batchEndDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Button sx={{ mt: 2 }} type="submit" fullWidth variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
        
    </Stack>
  );
};

export default ProductBatchForm;
