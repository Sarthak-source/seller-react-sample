import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Container, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';

const OrderCreate = () => {
  const [millValue, setMillValue] = useState({});
  const [mill, setMill] = useState([]);
  const [product, setProduct] = useState([]);
  const [productName, setProductName] = useState('');
  const [productID, setProductID] = useState('');
  const [qtyUnit, setQtyUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rate, setRate] = useState('');
  const [remark, setRemark] = useState('');

  const handleMillChange = (event) => {
    const newValue = event.target.value;
    setMillValue(newValue);
    setProduct(newValue.products);
  };

  const handleProductChange = (event) => {
    const newValue = event.target.value;
    setProductName(newValue.name);
    setProductID(newValue.id);
    setQtyUnit(newValue.unit);
  };

  const handleSubmit = () => {
    // Add your form submission logic here
    // ...
  };

  return (
    <Container>
      
      <Box m={4}>
        <FormControl fullWidth>
          <InputLabel>Mill</InputLabel>
          <Select
            value={millValue}
            onChange={handleMillChange}
          >
            {mill.map((item) => (
              <MenuItem key={item.id} value={item}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {product.length > 0 && (
          <FormControl fullWidth>
            <InputLabel>Product</InputLabel>
            <Select
              value={productName}
              onChange={handleProductChange}
            >
              {product.map((item) => (
                <MenuItem key={item.id} value={item}>
                  {`${item.product_type.product_type} ${item.code}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <TextField
          label="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <TextField
          label={`Rate per ${qtyUnit}`}
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />

        <TextField
          label="Remarks"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />

        <LoadingButton variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </LoadingButton>
      </Box>
    </Container>
  );
};

export default OrderCreate;
