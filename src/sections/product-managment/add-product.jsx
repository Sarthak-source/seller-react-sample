import { LoadingButton } from '@mui/lab';
import { Alert, Card, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NetworkRepository from 'src/app-utils/network_repository';

const ProductForm = () => {
  const [productType, setProductType] = useState('');
  const [productCode, setProductCode] = useState('');
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]); // Initialize as an empty array
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  const selectedUser = useSelector((state) => state.user.selectedUser);

  const navigate = useNavigate();

  const nav = () => {
    setTimeout(() => {
      navigate(`/home/products`);
    }, 2000);
  };

  const handleProductTypeChange = (event) => {
    const selectedProduct = data.find(product => product.id === event.target.value);
    setProductType(selectedProduct.id);
  };

  const handleProductCodeChange = (event) => {
    setProductCode(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await NetworkRepository.createProduct(productType, productCode, selectedUser.id);
      console.log(response);
      if (response.status === 200 && response.data.Success) {
        setSuccessMessage(response.data.Success);
        alert(response.data.Success);
      }
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
      nav();
    }
  };

  useEffect(() => {
    const fetchProductDropDownDetails = async () => {
      setLoading(true);
      try {
        const productDropDownDetails = await NetworkRepository.getProductDropdownDetails(selectedUser.id);
        setData(productDropDownDetails.product_types); // Use product_types from the response
      } catch (error) {
        console.error('Error fetching product dropdown details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDropDownDetails();
  }, [selectedUser]);

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
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>} {/* Success message */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Product Code"
            variant="outlined"
            value={productCode}
            onChange={handleProductCodeChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="product-type-label">Product Type</InputLabel>
            <Select
              labelId="product-type-label"
              value={productType}
              onChange={handleProductTypeChange}
              label="Product Type"
            >
              {data.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.product_type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl component="fieldset" fullWidth margin="normal">
            <RadioGroup row aria-label="status" name="status" value={status} onChange={handleStatusChange}>
              <FormControlLabel value="active" control={<Radio />} label="Active" />
              <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
            </RadioGroup>
          </FormControl>
          <LoadingButton loading={loading} fullWidth type="submit" variant="contained" color="primary">
            Submit
          </LoadingButton>
        </form>
      </Card>
    </Stack>
  );
};

export default ProductForm;
